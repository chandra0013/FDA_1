'use server';
/**
 * @fileOverview A Genkit flow for recommending visualizations based on a user's natural language query.
 * This flow, inspired by Microsoft LIDA, suggests relevant charts and customization options.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input Schema
const LidaQueryInputSchema = z.object({
  query: z.string().describe("The user's natural language query about data they want to visualize."),
});
export type LidaQueryInput = z.infer<typeof LidaQueryInputSchema>;

// Output Schema
const CustomizationOptionSchema = z.object({
    type: z.enum(['slider', 'checkbox', 'select']).describe("The type of UI control for this option."),
    label: z.string().describe("The user-facing label for the control."),
    defaultValue: z.union([z.string(), z.number(), z.boolean()]).describe("The default value for the control."),
    min: z.number().optional().describe("Minimum value for a slider."),
    max: z.number().optional().describe("Maximum value for a slider."),
    step: z.number().optional().describe("Step value for a slider."),
    options: z.array(z.string()).optional().describe("Options for a select dropdown."),
});

const SuggestedChartSchema = z.object({
  chartType: z.string().describe("A descriptive name for the chart, e.g., 'Salinity vs. Depth Profile'."),
  chartComponent: z.string().describe("The name of the React component to render, e.g., 'FloatSalinityPressureScatter'."),
  reason: z.string().describe("A brief explanation of why this chart is recommended for the user's query."),
});

const LidaQueryResponseSchema = z.object({
  summary: z.string().describe("A concise, one-sentence summary of the AI's understanding of the user's request."),
  suggestedCharts: z.array(SuggestedChartSchema).describe("A list of 3-5 recommended chart types relevant to the query."),
  defaultChart: z.string().describe("The chartComponent name of the best default chart to display first."),
  customizationOptions: z.array(CustomizationOptionSchema).describe("A list of relevant customization options for the default chart."),
  caption: z.string().describe("An AI-generated, data-driven caption for the default chart, providing a key insight."),
});
export type LidaQueryResponse = z.infer<typeof LidaQueryResponseSchema>;


// Prompt
const generateVisualizationSuggestionPrompt = ai.definePrompt({
  name: 'generateVisualizationSuggestionPrompt',
  input: { schema: LidaQueryInputSchema },
  output: { schema: LidaQueryResponseSchema },
  model: 'gemini-1.5-flash',
  prompt: `You are an expert data visualization AI assistant. Your task is to analyze a user's natural language query and recommend the most effective visualizations.

You must act as a LIDA (Language-based Interface for Data Analysis) model.

**User Query:** "{{query}}"

**Available Chart Components:**
- KpiBars
- MonthlyTrendArea
- OceanHealthScatter
- ProfileCrossSection
- FloatSalinityPressureScatter

**Based on the user's query, you MUST perform the following steps:**

1.  **Summarize the Goal:** Create a concise, one-sentence summary of what the user wants to visualize.
2.  **Recommend Charts:** Suggest 3 to 5 relevant chart types from the "Available Chart Components" list. For each, provide a descriptive \`chartType\` name (e.g., "Salinity vs. Depth Profile") and a brief \`reason\`.
3.  **Select a Default:** Choose the single best chart component (\`defaultChart\`) from your recommendations that directly answers the user's primary question.
4.  **Suggest Customizations:** For the selected default chart, propose 2-3 relevant \`customizationOptions\`. Be specific. For a time-series chart, suggest a "Date Range" slider. For a depth profile, suggest a "Depth Range" slider. For scatter plots with quality flags, suggest a "QC Flag Filter" checkbox.
5.  **Generate a Caption:** Write a short, insightful, and data-driven \`caption\` for the default chart. Bluff realistic numbers. For example: "Median salinity at 50m is 35.2 PSU, with variability of ±0.3 PSU."

**Example for query "show salinity profiles":**
{
  "summary": "Visualizing salinity variation against ocean depth.",
  "suggestedCharts": [
    { "chartType": "Salinity vs. Pressure Profile", "chartComponent": "FloatSalinityPressureScatter", "reason": "Directly plots salinity against pressure (depth)." },
    { "chartType": "Regional Salinity KPIs", "chartComponent": "KpiBars", "reason": "Compares average salinity across different regions." }
  ],
  "defaultChart": "FloatSalinityPressureScatter",
  "customizationOptions": [
    { "type": "slider", "label": "Depth Range (dbar)", "defaultValue": 2000, "min": 0, "max": 2000, "step": 100 },
    { "type": "checkbox", "label": "Include Questionable Data", "defaultValue": false }
  ],
  "caption": "This profile shows salinity is relatively stable below 500 dbar, averaging 35.4 PSU."
}

Now, process the user's query and generate the full JSON response.`,
});

// Flow
const generateVisualizationSuggestionFlow = ai.defineFlow(
  {
    name: 'generateVisualizationSuggestionFlow',
    inputSchema: LidaQueryInputSchema,
    outputSchema: LidaQueryResponseSchema,
  },
  async (input) => {
    const { output } = await generateVisualizationSuggestionPrompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid visualization suggestion.");
    }
    return output;
  }
);

// Exported function
export async function generateVisualizationSuggestion(input: LidaQueryInput): Promise<LidaQueryResponse> {
  return generateVisualizationSuggestionFlow(input);
}
