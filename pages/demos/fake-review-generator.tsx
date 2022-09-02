import React from 'react';

import {
  Box, Button, Divider, Paper, Select, Stack, Text, TextInput, Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import GPTCompletion from 'components/completion';
import { CreateCompletionRequest } from 'openai';
import { getCompletion } from 'libs/openai-client';

interface FormValues {
  product: string;
  starRating: number;
}

function generatePrompt({ product, starRating }: FormValues): CreateCompletionRequest {
  const prompt = `A collection of product reviews from Amazon.com.

Product description: ${product}

===

5 customer reviews, rating the product ${starRating} out of 5 stars in a paragraph or less:
-`;

  return {
    model: 'text-davinci-002',
    prompt,
    max_tokens: 300,
    temperature: 0.9,
    // stop: '\n',
    presence_penalty: 1.0,
    frequency_penalty: 1.5,
  };
}

interface ReviewResultProps {
  result: string;
  form: FormValues;
}
function ReviewResult({ result, form }: ReviewResultProps) {
  const reviews = result.split('\n-');
  return (
    <>
      { reviews.map((review) => (
        <Paper shadow="xs" p="md" key={review}>
          <Text size="md">
            { '⭐'.repeat(form.starRating) }
            {' '}
            { review }
          </Text>
        </Paper>
      )) }
    </>
  );
}

export default function FakeReviewGenerator() {
  const form = useForm<FormValues>({
    initialValues: {
      product: 'Sharpie S-Gel, Gel Pens, Medium Point (0.7mm), Assorted Colors, 12 Count',
      starRating: 5,
    },
    validate: {
      product: (product) => (product.length > 0 ? null : 'Invalid product'),
    },
  });
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | undefined>(undefined);
  const [openaiRequest, setOpenaiRequest] = React
    .useState<CreateCompletionRequest | undefined>(undefined);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const request = generatePrompt(values);
    setOpenaiRequest(request);
    await getCompletion(request).then((completion) => {
      setResult(completion && completion.choices
        ? completion.choices[0].text
        : 'No result, check the logs.');
    }).finally(() => {
      setLoading(false);
    });
  };

  const zeroToFour = Array.from(Array(5).keys());

  return (
    <Box sx={{ maxWidth: 500 }}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack spacing="xs">
          <TextInput
            withAsterisk
            label="Product description"
            {...form.getInputProps('product')}
          />
          <Select
            withAsterisk
            label="Star rating"
            data={zeroToFour.map((key) => ({
              label: `${key + 1} stars`,
              value: key + 1,
            }))}
            {...form.getInputProps('starRating')}
          />
          <Button type="submit" loading={loading}>Review!</Button>
          { (result && !loading)
          && (
            <>
              <Divider my="xs" />
              <Title order={4}>Result</Title>
              <ReviewResult result={result} form={form.values} />
              <Title order={4}>GPT-3 Prompt</Title>
              { openaiRequest && <GPTCompletion request={openaiRequest} result={result} /> }
            </>
          )}
        </Stack>
      </form>
    </Box>
  );
}
