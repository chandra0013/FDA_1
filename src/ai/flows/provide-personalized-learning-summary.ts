
'use server';
/**
 * @fileOverview A Genkit flow for generating a personalized learning summary for a user.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const LearningSummaryInputSchema = z.object({
  interactionData: z.string().describe("A summary of the user's recent interactions, like queries asked."),
});
export type LearningSummaryInput = z.infer<typeof LearningSummaryInputSchema>;

const LearningSummaryOutputSchema = z.object({
  summary: z.string().describe('A personalized summary in Markdown suggesting topics for the user to focus on.'),
});
export type LearningSummaryOutput = z.infer<typeof LearningSummaryOutputSchema>;

export async function providePersonalizedLearningSummary(
  input: LearningSummaryInput
): Promise<LearningSummaryOutput> {
  return learningSummaryFlow(input);
}

const learningSummaryPrompt = ai.definePrompt({
  name: 'learningSummaryPrompt',
  input: { schema: LearningSummaryInputSchema },
  output: { schema: LearningSummaryOutputSchema },
  model: 'googleai/gemini-pro',
  prompt: `You are an AI learning assistant for Blue Query, an ocean data platform. Your goal is to help users deepen their understanding of oceanography.

  Based on the user's recent activity, generate a short, personalized summary of what they should focus on next.

  **User's Recent Activity:**
  {{{interactionData}}}

  **Your Task:**
  1.  Analyze the user's query history.
  2.  Identify a key theme or concept they seem interested in.
  3.  Provide 2-3 specific, actionable suggestions for what to explore next.
  4.  Frame your response as a helpful, encouraging summary.

  **Example:**
  - If user asked about salinity, suggest they explore the 'halocline' or compare salinity between different ocean basins.
  - If user asked about temperature, suggest they investigate 'thermocline' or look at seasonal temperature variations.

  Generate the learning summary now.
  `,
});

const learningSummaryFlow = ai.defineFlow(
  {
    name: 'learningSummaryFlow',
    inputSchema: LearningSummaryInputSchema,
    outputSchema: LearningSummaryOutputSchema,
  },
  async input => {
    const { output } = await learningSummaryPrompt(input);
    return output || { summary: 'Sorry, I could not generate a learning summary at this time.' };
  }
);
