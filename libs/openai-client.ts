import {
  CreateCompletionRequest, CreateCompletionResponse, CreateEditRequest,
  CreateEditResponse, CreateEmbeddingRequest, CreateEmbeddingResponse,
} from 'openai';

async function getCompletion(request: CreateCompletionRequest): Promise<CreateCompletionResponse> {
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

async function getEdit(request: CreateEditRequest): Promise<CreateEditResponse> {
  return fetch('/api/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }).then(
    (response) => response.json() as CreateEditResponse,
  );
}

async function getEmbedding(request: CreateEmbeddingRequest): Promise<CreateEmbeddingResponse> {
  return fetch('/api/embedding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }).then(
    (response) => response.json() as CreateEmbeddingResponse,
  );
}

export { getCompletion, getEdit, getEmbedding };
