'use server';
/**
 * @fileOverview A Genkit flow for generating conversational responses for the ARGO data chatbot.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ArgoChatInputSchema = z.object({
  query: z.string().describe("The user's question about ARGO ocean data."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe("The chat history between the user and the model."),
});
export type ArgoChatInput = z.infer<typeof ArgoChatInputSchema>;

const ArgoChatOutputSchema = z.object({
  response: z.string().describe('The AI-generated response in Markdown format.'),
});
export type ArgoChatOutput = z.infer<typeof ArgoChatOutputSchema>;


export async function generateChatResponse(
  input: ArgoChatInput
): Promise<ArgoChatOutput> {
  return generateChatResponseFlow(input);
}

const generateChatResponsePrompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  input: { schema: ArgoChatInputSchema },
  output: { schema: ArgoChatOutputSchema },
  model: 'googleai/gemini-pro',
  prompt: `You are Blue Query AI, an expert oceanographer and data analyst specializing in the ARGO float program. Your purpose is to help users understand and explore ocean data conversationally.

  **Instructions:**
  1.  **Be Conversational and Informative:** Provide clear, concise, and helpful answers.
  2.  **Use Markdown:** Format your responses with Markdown (headings, lists, bold text) for readability.
  3.  **Assume ARGO Context:** Your knowledge base is centered on the global ARGO float array and related oceanographic concepts.
  4.  **Analyze User Intent:** If the user asks for a "report", "analysis", or "overview", this prompt will not be used. A different tool handles that. You should focus on direct questions.
  5.  **Data Schema Awareness:** You are aware of the following data parameters available from ARGO floats: Temperature, Salinity, Pressure, Oxygen, Nitrate, pH, Chlorophyll, BBP700, CDOM, and Downwelling PAR.
  6.  **Example Query Handling:**
      *   If asked "What is an ARGO float?", explain it clearly.
      *   If asked to "Compare BGC parameters in Arabian Sea vs. Bay of Bengal", provide a comparative summary, bluffing reasonable data points (e.g., "The Arabian Sea typically shows higher salinity...").

  **Chat History:**
  {{#if history}}
  {{#each history}}
  **{{role}}:** {{{content}}}
  ---
  {{/each}}
  {{/if}}

  **User's Current Query:**
  "{{query}}"

  Based on this, provide your expert response.
  `,
});

const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: ArgoChatInputSchema,
    outputSchema: ArgoChatOutputSchema,
  },
  async input => {
    try {
      const { output } = await generateChatResponsePrompt(input);
      return output || { response: 'Sorry, I could not generate a response.' };
    } catch (err) {
      console.error('Prompt invocation failed:', err);
      throw new Error('Model configuration error. Check model id and API key.');
    }
  }
);
