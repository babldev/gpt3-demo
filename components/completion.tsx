import React from 'react';
import {
  Code, Mark, Paper, Table,
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
      <Table verticalSpacing={4} horizontalSpacing={4} fontSize="xs">
        <tbody>
          { Object.entries(request).map(([key, value]) => {
            if (key === 'prompt') {
              return null;
            }
            return (
              <tr key={key}>
                <td>{ key }</td>
                <td><Code>{ value }</Code></td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Paper>
  );
}
GPTCompletion.defaultProps = {
  result: undefined,
};
