'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const generativeAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY
);

const model = generativeAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export default async function getRecipe(prompt) {
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text;
}
