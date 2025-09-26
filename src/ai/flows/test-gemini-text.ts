
'use server';
/**
 * @fileOverview A simple Genkit flow for testing Gemini text generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const testGenerationFlow = ai.defineFlow(
  {
    name: 'testGenerationFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt) => {
    const { output } = await ai.generate({
      model: 'gemini-pro',
      prompt: prompt,
    });
    
    const textResponse = output ? output.text : 'No response from model.';
    console.log(textResponse);
    return textResponse;
  }
);
