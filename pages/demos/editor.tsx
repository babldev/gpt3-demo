import React from 'react';

import {
  Box, Button, Divider, Paper, Stack, Text, Textarea, Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import GPTCompletion from 'components/completion';
import { CreateEditRequest } from 'openai';
import { getEdit } from 'libs/openai-client';

interface FormValues {
  input: string;
}

function generatePrompt({ input }: FormValues): CreateEditRequest {
  return {
    model: 'text-davinci-edit-001',
    input,
    instruction: 'Fix capitalization, typos, and grammatical issues.',
    temperature: 0,
  };
}

export default function Editor() {
  const form = useForm<FormValues>({
    initialValues: {
      input: 'i update page With new assetz. it loks better noww. '
      + 'sry for ani typos i was in a hurry and had to tipe quickly',
    },
    validate: {
      input: (value) => (value.length > 0 ? null : 'Invalid input'),
    },
  });
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | undefined>(undefined);
  const [openaiRequest, setOpenaiRequest] = React
    .useState<CreateEditRequest | undefined>(undefined);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const request = generatePrompt(values);
    setOpenaiRequest(request);
    await getEdit(request).then((completion) => {
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
            withAsterisk
            label="Enter text to correct"
            {...form.getInputProps('input')}
          />
          <Button type="submit" loading={loading}>Translate!</Button>
          { (result && !loading)
          && (
            <>
              <Divider my="xs" />
              <Title order={4}>Result</Title>
              <Paper shadow="xs" p="md">
                <Text size="xl">{ result }</Text>
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
