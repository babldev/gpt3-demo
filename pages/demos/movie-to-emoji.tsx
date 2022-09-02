import {
  Box, Button, Paper, Stack, TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';

interface FormValues {
  input: string;
}

export default function MovieToEmoji() {
  const form = useForm<FormValues>({
    initialValues: {
      input: '',
    },
    validate: {
      input: (value) => (value.length > 0 ? null : 'Invalid input'),
    },
  });

  const [result, setResult] = React.useState<string | undefined>(undefined);

  return (
    <Box sx={{ maxWidth: 500 }}>
      <form onSubmit={
      form.onSubmit((values) => {
        setResult(`Result is: ${values.input}`);
      })
    }
      >
        <Stack spacing="xs">
          <TextInput
            withAsterisk
            label="Enter a movie title"
            placeholder="The Matrix"
            {...form.getInputProps('input')}
          />
          <Button type="submit">Translate</Button>
          { result
          && (
          <Paper shadow="xs" p="md">
            {result}
          </Paper>
          )}
        </Stack>
      </form>
    </Box>
  );
}
