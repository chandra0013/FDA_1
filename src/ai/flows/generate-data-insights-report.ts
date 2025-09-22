
'use server';

/**
 * @fileOverview A flow to generate a data insights report in PDF format.
 *
 * - generateDataInsightsReport - A function that generates the report.
 * - GenerateDataInsightsReportInput - The input type for the generateDataInsightsReport function.
 * - GenerateDataInsightsReportOutput - The return type for the generateDataInsightsReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDataInsightsReportInputSchema = z.object({
  query: z
    .string()
    .describe("The query that was used to generate the data insights."),
  visualizations: z.array(z.string()).describe(
    "A list of data URIs representing the visualizations that the user wants to include in the report.  Each data URI must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type GenerateDataInsightsReportInput = z.infer<
  typeof GenerateDataInsightsReportInputSchema
>;

const GenerateDataInsightsReportOutputSchema = z.object({
  reportDataUri: z
    .string()
    .describe(
      'The data URI of the generated PDF report.  The data URI must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'       
    ),
});
export type GenerateDataInsightsReportOutput = z.infer<
  typeof GenerateDataInsightsReportOutputSchema
>;

export async function generateDataInsightsReport(
  input: GenerateDataInsightsReportInput
): Promise<GenerateDataInsightsReportOutput> {
  return generateDataInsightsReportFlow(input);
}

const generateDataInsightsReportPrompt = ai.definePrompt({
  name: 'generateDataInsightsReportPrompt',
  input: {schema: GenerateDataInsightsReportInputSchema},
  output: {schema: GenerateDataInsightsReportOutputSchema},
  model: 'googleai/gemini-1.5-pro-latest',
  prompt: `You are an AI assistant that generates professional, multi-page PDF reports based on user queries and data visualizations.

  **User Query:**
  "{{{query}}}"

  **Visualizations Provided:**
  {{#if visualizations}}
    {{#each visualizations}}
      - Visualization {{media url=this}}
    {{/each}}
  {{else}}
    - No visualizations were provided. Please generate a text-based report and create your own illustrative (but fake) data tables and summaries.
  {{/if}}

  **Your Task:**
  1.  **Analyze the Query**: Understand the user's request, focusing on the topic (e.g., "temperature anomalies").
  2.  **Synthesize a Report**: Create a comprehensive, well-structured, and professional-looking report in PDF format.
  3.  **Bluff Realistic Details**: Since you do not have live data access, you must create realistic-looking data, statistics, and findings. For a query about "temperature anomalies," invent plausible statistics for mean anomaly, trends, specific noteworthy events, and regional differences.
  4.  **Structure the Report**: The PDF should have a clear structure, including:
      *   A title page with "Oceanus AI Report" and the user's query.
      *   An executive summary with key bullet points.
      *   Sections for Methodology, Findings, Spatial Analysis, Temporal Trends, and a Conclusion.
      *   Use professional formatting with clear headings, paragraphs, bulleted lists, and tables for data.
  5.  **Return as PDF Data URI**: Your final output **must** be a single, complete PDF file, encoded as a Base64 data URI string. The format must be \`data:application/pdf;base64,<encoded_pdf_data>\`. Do not return text or markdown. You must generate the PDF file itself.
  `,
});

const generateDataInsightsReportFlow = ai.defineFlow(
  {
    name: 'generateDataInsightsReportFlow',
    inputSchema: GenerateDataInsightsReportInputSchema,
    outputSchema: GenerateDataInsightsReportOutputSchema,
  },
  async input => {
    const { output } = await generateDataInsightsReportPrompt(input);
    if (!output?.reportDataUri) {
      throw new Error('The AI model did not return a valid PDF report data URI.');
    }
    return output;
  }
);
