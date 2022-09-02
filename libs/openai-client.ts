import { CreateCompletionResponse } from 'openai';

async function getCompletion(request: CreateCompletionResponse): Promise<CreateCompletionResponse> {
  return fetch('/api/completion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }).then(
    (response) => response.json() as CreateCompletionResponse,
  );
}

export { getCompletion };
