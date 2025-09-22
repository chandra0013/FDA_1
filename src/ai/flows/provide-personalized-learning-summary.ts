'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a personalized learning summary based on user interaction data.
 *
 * The flow takes user interaction data as input and returns a summary of important things to focus on for a more efficient learning experience.
 *
 * @file The file exports the `providePersonalizedLearningSummary` function, `PersonalizedLearningSummaryInput` type, and `PersonalizedLearningSummaryOutput` type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the personalized learning summary flow
const PersonalizedLearningSummaryInputSchema = z.object({
  interactionData: z
    .string()
    .describe(
      'A string containing user interaction data, such as queries, visualizations viewed, and learning modules completed.'
    ),
});

export type PersonalizedLearningSummaryInput = z.infer<
  typeof PersonalizedLearningSummaryInputSchema
>;

// Define the output schema for the personalized learning summary flow
const PersonalizedLearningSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A personalized summary of important things to focus on for a more efficient learning experience, based on the user interaction data.'
    ),
});

export type PersonalizedLearningSummaryOutput = z.infer<
  typeof PersonalizedLearningSummaryOutputSchema
>;

// Define the Genkit prompt for generating the personalized learning summary
const personalizedLearningSummaryPrompt = ai.definePrompt({
  name: 'personalizedLearningSummaryPrompt',
  input: {schema: PersonalizedLearningSummaryInputSchema},
  output: {schema: PersonalizedLearningSummaryOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized learning summaries.
Based on the user's interaction data, identify key areas where the user can focus their learning efforts.
Provide a concise and actionable summary of important things to focus on to improve their understanding.

User Interaction Data: {{{interactionData}}}

Personalized Learning Summary:`,
});

// Define the Genkit flow for generating the personalized learning summary
const providePersonalizedLearningSummaryFlow = ai.defineFlow(
  {
    name: 'providePersonalizedLearningSummaryFlow',
    inputSchema: PersonalizedLearningSummaryInputSchema,
    outputSchema: PersonalizedLearningSummaryOutputSchema,
  },
  async input => {
    const {output} = await personalizedLearningSummaryPrompt(input);
    return output!;
  }
);

/**
 * Generates a personalized learning summary based on user interaction data.
 *
 * @param input - The input data for generating the personalized learning summary.
 * @returns A promise that resolves to the personalized learning summary.
 */
export async function providePersonalizedLearningSummary(
  input: PersonalizedLearningSummaryInput
): Promise<PersonalizedLearningSummaryOutput> {
  return providePersonalizedLearningSummaryFlow(input);
}
