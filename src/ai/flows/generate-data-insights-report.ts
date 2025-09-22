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
import * as fs from 'fs';

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
  model: 'googleai/gemini-pro',
  prompt: `You are an AI assistant that generates reports based on user queries and visualizations.

  The user has made the following query: {{{query}}}

  The user has provided the following visualizations:
  {{#each visualizations}}
  {{media url=this}}
  {{/each}}

  Create a PDF report that summarizes the query and visualizations. Return the PDF as a data URI.
  `,
});

const generateDataInsightsReportFlow = ai.defineFlow(
  {
    name: 'generateDataInsightsReportFlow',
    inputSchema: GenerateDataInsightsReportInputSchema,
    outputSchema: GenerateDataInsightsReportOutputSchema,
  },
  async input => {
    // TODO: Implement PDF generation logic here.
    // Currently returning a placeholder.  Replace with actual PDF generation.
    const pdfBase64 = fs.readFileSync('src/ai/flows/placeholder.pdf', {encoding: 'base64'});
    const reportDataUri = `data:application/pdf;base64,${pdfBase64}`;
    return {reportDataUri};
  }
);
