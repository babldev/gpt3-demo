import {
  Box, Button, Code, Mark, Paper, Stack, TextInput, Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { CreateCompletionRequest, CreateCompletionResponse } from 'openai';
import React from 'react';

interface FormValues {
  movie: string;
}

// Borrowed from gpt3 examples https://beta.openai.com/examples/default-movie-to-emoji
function generatePrompt({ movie }: FormValues): string {
  return `Convert movie titles into emoji.

Back to the Future: 👨👴🚗🕒
Batman: 🤵🦇
Transformers: 🚗🤖
${movie}:`;
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

  const [result, setResult] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);

  return (
    <Box sx={{ maxWidth: 500 }}>
      <form onSubmit={
        form.onSubmit(async (values) => {
          const request: CreateCompletionRequest = {
            model: 'text-davinci-002',
            prompt: generatePrompt(values),
            max_tokens: 60,
            temperature: 0.8,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: '\n',
          };
          setLoading(true);
          await fetch('/api/completion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
          }).then(
            async (response) => {
              const completion = await response.json() as CreateCompletionResponse;
              setResult(completion && completion.choices
                ? completion.choices[0].text
                : 'No result, check the logs.');
            },
          ).finally(() => {
            setLoading(false);
          });
        })
      }
      >
        <Stack spacing="xs">
          <TextInput
            withAsterisk
            label="Enter a movie title"
            placeholder="The Matrix"
            {...form.getInputProps('movie')}
          />
          <Button type="submit" loading={loading}>Translate</Button>
          { (result && !loading)
          && (
            <>
              <Title order={4}>Result</Title>
              <Paper shadow="xs" p="md">
                { result }
              </Paper>
              <Title order={4}>GPT-3 Prompt</Title>
              <Paper shadow="xs" p="md">
                <Code block>
                  { generatePrompt(form.values) }
                  <Mark>{ result }</Mark>
                </Code>
              </Paper>
            </>
          )}
        </Stack>
      </form>
    </Box>
  );
}
