import React from 'react';

import { Prism } from '@mantine/prism';
import {
  Box, Button, Divider, Paper, Stack, Textarea, Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import GPTCompletion from 'components/completion';
import { CreateCompletionRequest } from 'openai';
import { getCompletion } from 'libs/openai-client';

interface FormValues {
  input: string;
}

const defaultCode = `def factorial(input: int) -> int:
  """Multiplies a number by every positive number less than it."""
  return input > 1 ? factorial(input - 1) * input : 1

def poorly_named_func(input: float) -> str:
  """[insert]
  return '{:0.2f}'.format(input)`;

function generatePrompt({ input }: FormValues): CreateCompletionRequest {
  const parts = input.split('[insert]');
  if (parts.length !== 2) {
    throw new Error('Invalid input, must contain [insert]');
  }

  return {
    model: 'code-davinci-002',
    prompt: `// code.py\n${parts[0]}`,
    suffix: parts[1],
    max_tokens: 60,
    temperature: 0,
  };
}

export default function Docstring() {
  const form = useForm<FormValues>({
    initialValues: {
      input: defaultCode,
    },
    validate: {
      input: (value) => (value.length > 0 ? null : 'Invalid input'),
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
          <Textarea
            minRows={8}
            withAsterisk
            label="Enter Python code to [insert] a docstring"
            {...form.getInputProps('input')}
          />
          <Button type="submit" loading={loading}>Document!</Button>
          { (result && !loading)
          && (
            <>
              <Divider my="xs" />
              <Title order={4}>Result</Title>
              <Paper shadow="xs" p="md">
                <Prism language="python">
                  { `${openaiRequest?.prompt}${result}${openaiRequest?.suffix}` }
                </Prism>
              </Paper>
              <Title order={5}>Prompt</Title>
              { openaiRequest && <GPTCompletion request={openaiRequest} result={result} /> }
            </>
          )}
        </Stack>
      </form>
    </Box>
  );
}
