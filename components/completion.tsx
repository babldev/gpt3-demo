import React from 'react';
import {
  Code, Mark, Paper,
} from '@mantine/core';
import { CreateCompletionRequest } from 'openai';

interface GPTCompletionProps {
  request: CreateCompletionRequest;
  result?: string;
}

export default function GPTCompletion({ request, result }: GPTCompletionProps) {
  return (
    <Paper shadow="xs" p="md">
      <Code block>
        { request.prompt }
        <Mark color="green">{ result }</Mark>
      </Code>
    </Paper>
  );
}
GPTCompletion.defaultProps = {
  result: undefined,
};
