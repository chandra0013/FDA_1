
'use server';
/**
 * @fileOverview A Genkit flow for generating a comprehensive PDF report from a user query.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Ensure this is imported for autoTable to work

const ReportInputSchema = z.object({
  query: z.string().describe("The user's query requesting a report or analysis."),
});
export type ReportInput = z.infer<typeof ReportInputSchema>;

const ReportOutputSchema = z.object({
  pdfDataUri: z.string().describe("The generated PDF report as a Base64-encoded data URI."),
});
export type ReportOutput = z.infer<typeof ReportOutputSchema>;

export async function generateDataInsightsReport(
  input: ReportInput
): Promise<ReportOutput> {
  return generateReportFlow(input);
}

const generateReportContentPrompt = ai.definePrompt({
  name: 'generateReportContentPrompt',
  input: { schema: ReportInputSchema },
  output: { schema: z.object({
      title: z.string().describe('A concise title for the report.'),
      introduction: z.string().describe('A brief introduction (1-2 paragraphs) summarizing the report\'s purpose based on the user query.'),
      keyInsights: z.array(z.string()).describe('A list of 3-5 bullet-point key insights. Be specific and bluff realistic data.'),
      recommendations: z.string().describe('A short paragraph with 1-2 recommendations for further analysis.'),
  })},
  model: 'googleai/gemini-pro',
  prompt: `You are a senior oceanographic data analyst. A user has requested a report based on the following query: "{{query}}".

  Based on this query, generate the content for a professional PDF report. The content should include:
  1. A clear, descriptive title.
  2. An introduction explaining the report's focus.
  3. 3-5 specific, data-driven key insights (bluff realistic numbers and trends).
  4. A brief recommendations section.

  For example, if the query is "Generate a report on temperature anomalies in the North Atlantic," your output might include insights like:
  - "The 2023-2024 season saw a 0.8°C positive temperature anomaly compared to the 30-year baseline."
  - "Anomalies were most pronounced in the subpolar gyre, peaking in late summer."

  Generate the content for the user's query now.`,
});


const generateReportFlow = ai.defineFlow(
  {
    name: 'generateDataInsightsReportFlow',
    inputSchema: ReportInputSchema,
    outputSchema: ReportOutputSchema,
  },
  async input => {
    const { output: content } = await generateReportContentPrompt(input);
    if (!content) {
        throw new Error("Failed to generate report content.");
    }

    const doc = new jsPDF();

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(30, 30, 30);
    doc.text(content.title, 14, 22);

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    // Introduction
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(40);
    const introLines = doc.splitTextToSize(content.introduction, 180);
    doc.text(introLines, 14, 45);

    // Key Insights
    (doc as any).autoTable({
        startY: 70,
        head: [['Key Insights']],
        body: content.keyInsights.map(insight => [insight]),
        theme: 'striped',
        headStyles: { fillColor: [30, 136, 169] }, // Teal color
    });

    // Recommendations
    const lastTableY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommendations', 14, lastTableY + 15);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const recommendationLines = doc.splitTextToSize(content.recommendations, 180);
    doc.text(recommendationLines, 14, lastTableY + 22);


    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount} | Blue Query AI Report`, 14, doc.internal.pageSize.height - 10);
    }

    const pdfDataUri = doc.output('datauristring');
    
    return { pdfDataUri };
  }
);
