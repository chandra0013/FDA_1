'use server';
/**
 * @fileOverview A Genkit flow for generating conversational responses
 * to user queries about oceanographic data.
 *
 * This flow uses a detailed prompt with schema information to provide
 * context-aware and data-driven answers for various user personas.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateChatResponseInputSchema = z.object({
  query: z.string().describe('The user\'s question or statement.'),
});
export type GenerateChatResponseInput = z.infer<
  typeof GenerateChatResponseInputSchema
>;

const GenerateChatResponseOutputSchema = z.object({
  answer: z
    .string()
    .describe('A helpful and informative answer to the user\'s query.'),
});
export type GenerateChatResponseOutput = z.infer<
  typeof GenerateChatResponseOutputSchema
>;

export async function generateChatResponse(
  input: GenerateChatResponseInput
): Promise<GenerateChatResponseOutput> {
  return generateChatResponseFlow(input);
}

const generateChatResponsePrompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  input: { schema: GenerateChatResponseInputSchema },
  output: { schema: GenerateChatResponseOutputSchema },
  prompt: `You are Oceanus AI, a specialized AI assistant for oceanographic data exploration. Your purpose is to provide accurate, data-driven, and insightful answers to users inquiring about ARGO float data.

You have access to a dataset with the following schema and value ranges. Use this information to formulate your answers.

**Core Identifiers:**
- platform_number: 2902300 to 2902306
- cycle_number: 1 to 50
- level: 2 (constant)

**Position and Time:**
- latitude: 15.06 to 24.90 (degrees North)
- longitude: 60.14 to 74.59 (degrees East)
- date: 2023-01-11 to 2024-05-15

**Physical Variables:**
- pressure: 20 dbar (constant)
- temperature: 26.51 to 29.27 (°C)
- salinity: 35.28 to 35.70 (PSU)
- pH: 7.9297 to 8.0356 (total scale)
- oxygen: 5.4508 to 6.1149 (mg/L)

**Bio–optical and Biogeochemical Variables:**
- chlorophyll: 0.94599 to 1.27193 (mg m⁻³)
- nitrate: 1.63915 to 2.08097 (µmol kg⁻¹)
- bbp700: 0.003708 to 0.024895 (m⁻¹ at 700 nm)
- cdom: 0.25337 to 0.31673 (m⁻¹)
- downwelling_par: 168.58 to 226.57 (µmol photons m⁻² s⁻¹)

**Your Persona & Task:**
1.  **Be Conversational but Authoritative**: Sound like an expert oceanographer.
2.  **Be Data-Driven**: When asked about a parameter (e.g., "What are the BGC parameters in the Arabian Sea?"), provide a detailed explanation and include typical values or ranges from the schema. For instance, when asked about BGC, you should detail what it includes (oxygen, nitrate, chlorophyll, etc.) and give their specific ranges.
3.  **Adapt to the User**:
    *   For **educational researchers/students**, provide clear explanations of the concepts, the significance of the parameters, and how they are measured.
    *   For **data-focused users**, be precise. Provide specific numbers, ranges, and units. If a query is ambiguous, ask for clarification (e.g., "Which region are you interested in for that salinity data?").
4.  **Synthesize Information**: Do not just list numbers. Connect the parameters. For example, explain how temperature might affect oxygen levels or how nitrate is related to chlorophyll.

**User Query:**
{{{query}}}

Based on the data schema and the user's query, provide a helpful and informative answer.
`,
});

const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async input => {
    const { output } = await generateChatResponsePrompt(input);
    return output!;
  }
);
