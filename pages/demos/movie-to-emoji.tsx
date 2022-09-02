import React from 'react';

import {
  Box, Button, Divider, Paper, Stack, Text, TextInput, Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import GPTCompletion from 'components/completion';
import { CreateCompletionRequest } from 'openai';
import { getCompletion } from 'libs/openai-client';

interface FormValues {
  movie: string;
}

function generatePrompt({ movie }: FormValues): CreateCompletionRequest {
  // Borrowed from gpt3 examples https://beta.openai.com/examples/default-movie-to-emoji
  const prompt = `Convert movie titles into emoji.

Back to the Future: 👨👴🚗🕒
Batman: 🤵🦇
Transformers: 🚗🤖
${movie}:`;

  return {
    model: 'text-davinci-002',
    prompt,
    max_tokens: 60,
    temperature: 0.8,
    stop: '\n',
  };
}

export default function MovieToEmoji() {
  const form = useForm<FormValues>({
    initialValues: {
      movie: '',
    },
    validate: {
      movie: (value) => (value.length > 0 ? null : 'Invalid movie'),
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

  return (
    <Box sx={{ maxWidth: 500 }}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack spacing="xs">
          <TextInput
            withAsterisk
            label="Enter a movie title"
            placeholder="The Matrix"
            {...form.getInputProps('movie')}
          />
          <Button type="submit" loading={loading}>Generate!</Button>
          { (result && !loading)
          && (
            <>
              <Divider my="xs" />
              <Title order={4}>Result</Title>
              <Paper shadow="xs" p="md">
                <Text size={50} align="center">{ result }</Text>
              </Paper>
              <Title order={4}>GPT-3 Prompt</Title>
              { openaiRequest && <GPTCompletion request={openaiRequest} result={result} /> }
            </>
          )}
        </Stack>
      </form>
    </Box>
  );
}
