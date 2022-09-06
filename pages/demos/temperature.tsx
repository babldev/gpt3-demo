import React from 'react';

import {
  Blockquote,
  Box, Button, Code, Divider, Paper, Stack, Text, TextInput, Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import GPTCompletion from 'components/completion';
import { CreateCompletionRequest } from 'openai';
import { getCompletion } from 'libs/openai-client';

interface FormValues {
  input: string;
}

interface TemperatureResult {
  result?: string;
  request: CreateCompletionRequest;
  temperature: number;
}

function generatePrompt({ input }: FormValues, temperature: number): CreateCompletionRequest {
  const prompt = `Question: ${input}
Answer:`;

  return {
    model: 'text-davinci-002',
    prompt,
    max_tokens: 120,
    temperature,
  };
}

export default function Temperature() {
  const form = useForm<FormValues>({
    initialValues: {
      input: 'Where is the capital of the United States?',
    },
    validate: {
      input: (value) => (value.length > 0 ? null : 'Invalid input'),
    },
  });
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<TemperatureResult[] | undefined>(undefined);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const temps = [0, 0.5, 0.9];
    const requests = temps.map((temp) => generatePrompt(values, temp));
    await Promise.all(requests.map(getCompletion)).then((completions) => {
      const completionResults = completions.map((completion, index) => ({
        result: completion && completion.choices
          ? completion.choices[0].text
          : 'No result, check the logs.',
        request: requests[index],
        temperature: temps[index],
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
        <a href="https://beta.openai.com/docs/api-reference/completions" target="_blank" rel="noreferrer">
          OpenAI docs
        </a>
        {' '}
        on
        <Code>temperature</Code>
        :
        <Blockquote styles={(theme) => ({ body: { fontSize: theme.fontSizes.sm } })}>
          Higher values means the model will take more risks.
          Try 0.9 for more creative applications, and 0
          (argmax sampling) for ones with a well-defined answer.
        </Blockquote>
      </Text>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack spacing="xs">
          <TextInput
            withAsterisk
            label="Question to answer"
            placeholder="Where is the capital of the United States?"
            {...form.getInputProps('input')}
          />
          <Button type="submit" loading={loading}>Answer!</Button>
          { (results && !loading)
          && results.map(({ result, request, temperature }) => (
            <>
              <Divider my="xs" />

              <Title order={4}>
                Temperature
                { temperature }
                {' '}
                Result
              </Title>
              <Paper shadow="xs" p="md">
                <Text size="sm">{ result }</Text>
              </Paper>
              <Title order={4}>GPT-3 Prompt</Title>
              { request && <GPTCompletion request={request} result={result} /> }
            </>
          ))}
        </Stack>
      </form>
    </Box>
  );
}
