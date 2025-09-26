
'use server';
/**
 * @fileOverview A Genkit flow for generating insights for a single float's data dashboard.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateFloatDashboardInsightsInputSchema = z.object({
  floatId: z.string().describe("The ID of the ARGO float."),
  floatDataSummary: z
    .string()
    .describe('A summary of the float\'s data, including ranges and trends.'),
});
export type GenerateFloatDashboardInsightsInput = z.infer<
  typeof GenerateFloatDashboardInsightsInputSchema
>;

const GenerateFloatDashboardInsightsOutputSchema = z.object({
  insights: z
    .array(z.string())
    .describe('A list of 3-4 bullet-point insights about the float\'s performance and data quality, formatted in Markdown.'),
});
export type GenerateFloatDashboardInsightsOutput = z.infer<
  typeof GenerateFloatDashboardInsightsOutputSchema
>;

export async function generateFloatDashboardInsights(
  input: GenerateFloatDashboardInsightsInput
): Promise<GenerateFloatDashboardInsightsOutput> {
  return generateFloatDashboardInsightsFlow(input);
}

const generateInsightsPrompt = ai.definePrompt({
  name: 'generateFloatDashboardInsightsPrompt',
  input: { schema: GenerateFloatDashboardInsightsInputSchema },
  output: { schema: GenerateFloatDashboardInsightsOutputSchema },
  model: 'gemini-1.5-flash-latest',
  prompt: `You are an expert oceanographic data analyst. Based on the provided data summary for a single ARGO float, generate 3-4 concise, insightful bullet points about the float's data.

Focus on:
- Variability or stability of key parameters (e.g., Temperature, Salinity).
- Potential sensor performance indicators.
- Data quality assessment.
- Relationships between different parameters if evident.

**Float ID:** {{{floatId}}}
**Data Summary:**
{{{floatDataSummary}}}

Generate a list of 3-4 bullet points. Be specific and sound like an expert.

**Example Insights:**
- "Temperature shows high cycle-to-cycle variability at shallow depths, indicating strong surface mixing."
- "Salinity remains remarkably stable across all profiles, demonstrating reliable sensor performance."
- "Data quality is excellent with over 95% 'good' flags, making it suitable for advanced analysis."

Based on the data summary, provide your expert insights.
`,
});

const generateFloatDashboardInsightsFlow = ai.defineFlow(
  {
    name: 'generateFloatDashboardInsightsFlow',
    inputSchema: GenerateFloatDashboardInsightsInputSchema,
    outputSchema: GenerateFloatDashboardInsightsOutputSchema,
  },
  async input => {
    const { output } = await generateInsightsPrompt(input);
    return output || { insights: [] };
  }
);
