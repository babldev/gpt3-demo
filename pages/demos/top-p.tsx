import React from 'react';

import {
  Blockquote,
  Box, Button, Code, Divider, Paper, Stack, Text, TextInput, Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import GPTCompletion from 'components/completion';
import { CreateCompletionRequest, CreateCompletionResponse } from 'openai';
import { getCompletion } from 'libs/openai-client';

interface FormValues {
  input: string;
}

interface TopPResult {
  result: CreateCompletionResponse;
  request: CreateCompletionRequest;
  top_p: number;
}

function generatePrompt({ input }: FormValues, top_p: number): CreateCompletionRequest {
  const prompt = `Question: What is a fun thing to do in San Francisco?
Answer: Ride a bike along the Golden Gate Bridge.

Question: What is a fun thing to do in ${input}?
Answer:`;

  return {
    model: 'text-davinci-002',
    prompt,
    max_tokens: 40,
    top_p,
    n: 3,
    stop: '\n',
  };
}

export default function TopP() {
  const form = useForm<FormValues>({
    initialValues: {
      input: 'Edinburgh',
    },
    validate: {
      input: (value) => (value.length > 0 ? null : 'Invalid input'),
    },
  });
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<TopPResult[] | undefined>(undefined);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const topPs = [0.1, 0.5, 1.0];
    const requests = topPs.map((top_p) => generatePrompt(values, top_p));
    await Promise.all(requests.map(getCompletion)).then((completions) => {
      const completionResults = completions.map((completion, index) => ({
        result: completion,
        request: requests[index],
        top_p: topPs[index],
      }));
      setResults(completionResults);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <Box sx={{ maxWidth: 500 }}>
      <Text size="sm">
        According to
        {' '}
        <a
          href="https://beta.openai.com/docs/api-reference/completions/create#completions/create-top_p"
          target="_blank"
          rel="noreferrer"
        >
          OpenAI docs
        </a>
        {' '}
        on
        <Code>top_p</Code>
        :
        <Blockquote styles={(theme) => ({ body: { fontSize: theme.fontSizes.sm } })}>
          An alternative to sampling with temperature,
          called nucleus sampling, where the model considers
          the results of the tokens with top_p probability mass.
          So 0.1 means only the tokens comprising the top 10%
          probability mass are considered.
        </Blockquote>
      </Text>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack spacing="xs">
          <TextInput
            withAsterisk
            label="Name a location for travel advice"
            placeholder="Edinburgh"
            {...form.getInputProps('input')}
          />
          <Button type="submit" loading={loading}>Answer!</Button>
          { (results && !loading)
          && results.map(({ result, request, top_p }) => (
            <>
              <Divider my="xs" />
              <Title order={4}>
                TopP
                {' '}
                { top_p }
                {' '}
                Result
              </Title>
              <Paper shadow="xs" p="md">
                <ul>
                  { result.choices?.map((choice) => (
                    <li key={choice.index}>{ choice.text }</li>
                  ))}
                </ul>
              </Paper>
              <Title order={5}>Prompt</Title>
              { request && (
              <GPTCompletion
                request={request}
                result={
                    result?.choices?.length
                      ? result?.choices[0]?.text
                      : undefined
                  }
              />
              ) }
            </>
          ))}
        </Stack>
      </form>
    </Box>
  );
}
