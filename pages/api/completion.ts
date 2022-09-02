import type { NextApiRequest, NextApiResponse } from 'next';
import {
  Configuration, CreateCompletionRequest, CreateCompletionResponse, OpenAIApi,
} from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
type APIError = { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateCompletionResponse | APIError>,
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  // This demo repo "trusts" the input and does not validate.
  const body = req.body as CreateCompletionRequest;

  const completion = await openai.createCompletion(body);
  res.status(200).json(completion.data);
}
