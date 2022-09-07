import React, { useCallback, useEffect } from 'react';

import {
  Badge,
  Box, Button, Divider, Paper, SegmentedControl, Stack, Table, Textarea, Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { CreateEmbeddingRequest, CreateEmbeddingResponse } from 'openai';
import { getEmbedding } from 'libs/openai-client';

const userFeedback = [
  "I'm not able to run the gpt-3 demo, there is an npm install error.",
  'I really trying out enjoyed the chatbot demo.',
  'Could you add another demo that showcases chat features?',
  'What is the difference between the davinci and curie models?',
  'Does the Codex model really improve the quality of the results?',
  'Mantine makes it really easy to add UX elements.',
  'Would love to see more examples of editing in addition to completions.',
  "What's the point of this app? It's no better than the GPT-3 Playground.",
];

const categories = [
  'Bug',
  'Feature request',
  'Positive sentiment',
  'Negative sentiment',
];

interface FormValues {
  userFeedback: string;
  categories: string;
}

interface EmbeddingResult {
  feedbackEmbeddings: {
    embedding: CreateEmbeddingResponse;
    feedback: string;
  }[];
  categoryEmbeddings: {
    embedding: CreateEmbeddingResponse;
    category: string;
  }[];
}

interface SearchRanking {
  feedback: string;
  relevance: number;
}

function generateEmbeddingDocument(input: string): CreateEmbeddingRequest {
  return {
    model: 'text-search-davinci-doc-001',
    input,
  };
}

function generateEmbeddingQuery(input: string): CreateEmbeddingRequest {
  return {
    model: 'text-search-davinci-query-001',
    input,
  };
}

export default function Search() {
  const form = useForm<FormValues>({
    initialValues: {
      userFeedback: userFeedback.join('\n'),
      categories: categories.join('\n'),
    },
    validate: {
      userFeedback: (value) => (value.length > 0 ? null : 'Invalid input'),
      categories: (value) => (value.length > 0 ? null : 'Invalid input'),
    },
  });
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<EmbeddingResult | undefined>(undefined);
  const [rankings, setRankings] = React.useState<SearchRanking[] | undefined>(undefined);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);

    const feedbackList = values.userFeedback.trim().split('\n');
    const categoriesList = values.categories.trim().split('\n');

    const feedbackEmbeddingTasks = feedbackList.map(
      (feedback) => getEmbedding(generateEmbeddingDocument(feedback)),
    );
    const categoriesEmbeddingTasks = categoriesList.map(
      (category) => getEmbedding(generateEmbeddingQuery(category)),
    );

    const feedbackEmbeddings = await Promise.all(feedbackEmbeddingTasks);
    const categoriesEmbeddings = await Promise.all(categoriesEmbeddingTasks);

    // TODO: Set embeddings from the API response
    setResult({
      feedbackEmbeddings: feedbackList.map((feedback, index) => ({
        embedding: feedbackEmbeddings[index],
        feedback,
      })),
      categoryEmbeddings: categoriesList.map((category, index) => ({
        embedding: categoriesEmbeddings[index],
        category,
      })),
    });
    setLoading(false);
  };

  const sortByQuery = useCallback((query: string) => {
    if (!result) {
      return;
    }
    const queryEmbedding = result.categoryEmbeddings.find(
      (category) => category.category === query,
    );
    const searchResults = result.feedbackEmbeddings.map((feedback) => {
      const docEmbeddingData = feedback?.embedding?.data;
      const queryEmbeddingData = queryEmbedding?.embedding?.data;

      if (!docEmbeddingData || !queryEmbeddingData) {
        return {
          feedback: feedback.feedback,
          relevance: 0,
        };
      }

      const docEmbeddingArray = docEmbeddingData[0].embedding;
      const queryEmbeddingArray = queryEmbeddingData[0].embedding;

      if (!docEmbeddingArray || !queryEmbeddingArray) {
        return {
          feedback: feedback.feedback,
          relevance: 0,
        };
      }

      // Calculate cosine similarity of queryEmbedding and docEmbedding
      const dotProduct = docEmbeddingArray.reduce(
        (acc, curr, index) => acc + curr * queryEmbeddingArray[index],
        0,
      );
      const docNorm = Math.sqrt(docEmbeddingArray.reduce((acc, curr) => acc + curr * curr, 0));
      const queryNorm = Math.sqrt(queryEmbeddingArray.reduce((acc, curr) => acc + curr * curr, 0));
      const cosineSimilarity = dotProduct / (docNorm * queryNorm);

      return {
        feedback: feedback.feedback,
        relevance: cosineSimilarity,
      };
    });
    searchResults.sort((a, b) => b.relevance - a.relevance);
    setRankings(searchResults);
  }, [result]);

  useEffect(() => {
    if (result) {
      sortByQuery(result.categoryEmbeddings[0].category);
    }
  }, [result, sortByQuery]);

  return (
    <Box sx={{ maxWidth: 700 }}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack spacing="xs">
          <Textarea
            withAsterisk
            minRows={userFeedback.length}
            label="User feedback, separated by newlines"
            {...form.getInputProps('userFeedback')}
          />
          <Textarea
            withAsterisk
            minRows={categories.length}
            label="Categories, separated by newlines"
            {...form.getInputProps('categories')}
          />
          <Button type="submit" loading={loading}>Index!</Button>
          { (result && !loading)
          && (
            <>
              <Divider my="xs" />
              <Title order={4}>Result</Title>
              <Paper shadow="xs" p="md">
                <SegmentedControl
                  data={result.categoryEmbeddings.map(({ category }) => ({
                    label: category,
                    value: category,
                  }))}
                  onChange={sortByQuery}
                />
                <Table mt="xs">
                  <thead>
                    <tr>
                      <th>Feedback</th>
                      <th>Relevance</th>
                    </tr>
                  </thead>
                  <tbody>
                    { rankings?.map(({ relevance, feedback }) => (
                      <tr key={feedback}>
                        <td>{feedback}</td>
                        <td>
                          <Badge color="blue">
                            {
                            // Round to 1 decimal place
                            (Math.round(relevance * 1000) / 10).toFixed(1)
                          }
                            %
                          </Badge>
                        </td>
                      </tr>
                    )) }
                  </tbody>
                </Table>
              </Paper>
            </>
          )}
        </Stack>
      </form>
    </Box>
  );
}
