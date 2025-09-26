
'use server';

import { generateFloatDashboardInsights } from '@/ai/flows/generate-float-dashboard-insights';
import { generateVisualizationSuggestion, type LidaQueryResponse } from '@/ai/flows/generate-visualization-suggestion';
import { generateChatResponse, type ArgoChatOutput, type ArgoChatInput } from '@/ai/flows/generate-chat-response';
import { generateDataInsightsReport, type ReportOutput } from '@/ai/flows/generate-data-insights-report';
import { providePersonalizedLearningSummary, type LearningSummaryOutput } from '@/ai/flows/provide-personalized-learning-summary';


interface DashboardInsightsResult {
    insights?: string[];
    error?: string;
}

interface ChatResult {
    response?: string;
    reportDataUri?: string;
    error?: string;
}

const DEEPER_RESEARCH_URL = "https://maxim-unimmured-zada.ngrok-free.dev/query";

/**
 * Handles chat for "Deeper Research" mode by querying an external backend.
 */
async function handleDeeperResearchChat(query: string): Promise<ChatResult> {
    try {
        const response = await fetch(DEEPER_RESEARCH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // The backend seems to have different possible response structures
        const resultText = data.result?.raw || data.answer || data.message || "No coherent response from backend.";

        return { response: resultText };
    } catch (e: any) {
        console.error("Deeper research handler error:", e);
        return { error: e.message || 'An unknown error occurred with the Deeper Research service.' };
    }
}


/**
 * Handles chat for "Normal Search" mode using Genkit flows.
 */
async function handleGenkitAiChat(input: ArgoChatInput): Promise<ChatResult> {
  const query = input.query.toLowerCase();
  // Intent detection for special commands
  if (query.includes('report') || query.includes('analysis') || query.includes('overview')) {
    const reportResult: ReportOutput = await generateDataInsightsReport({ query: input.query });
    return {
      response: "I've generated a PDF report for you based on your request. Click the button below to download it.",
      reportDataUri: reportResult.pdfDataUri,
    };
  }
  
  if (query.includes('summary') || query.includes('learning')) {
     // Generate personalized learning summary
    const summaryResult: LearningSummaryOutput = await providePersonalizedLearningSummary({
      interactionData: `User asked: "${query}"`,
    });
    return { response: summaryResult.summary };
  }

  // Default chat response
  const result: ArgoChatOutput = await generateChatResponse(input);
  return { response: result.response };
}


export async function handleFloatDashboardInsights(floatId: string, summary: string): Promise<DashboardInsightsResult> {
    try {
        const result = await generateFloatDashboardInsights({
            floatId: floatId,
            floatDataSummary: summary,
        });
        return { insights: result.insights };
    } catch (e: any) {
        console.error("Float dashboard insights error:", e);
        return { error: e.message || 'An unknown error occurred generating insights.' };
    }
}

export async function handleLidaQuery(query: string): Promise<LidaQueryResponse> {
    try {
        return await generateVisualizationSuggestion({ query });
    } catch (e: any) {
        console.error("Lida query handler error:", e);
        throw new Error(e.message || 'An unknown error occurred with the Lida service.');
    }
}

export async function handleAiChat(input: ArgoChatInput & { mode: 'normal' | 'deeper' }): Promise<ChatResult> {
  try {
    if (input.mode === 'deeper') {
        return await handleDeeperResearchChat(input.query);
    }
    // Normal mode uses Genkit
    return await handleGenkitAiChat(input);
  } catch (e: any) {
    console.error('AI Chat Error:', e);
    return {
      error: 'Sorry, I encountered an error. Please check my configuration or try again later.',
    };
  }
}

export async function handleDashboardAiChat(query: string, mode: 'descriptive' | 'predictive', context: string): Promise<ChatResult> {
    try {
        let fullQuery = `Dashboard Mode: ${mode}. User Query: "${query}"; Context: ${context}`;

        const response = await fetch(DEEPER_RESEARCH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: fullQuery }),
        });
        
        if (!response.ok) {
            throw new Error(`Backend error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const resultText = data.answer || data.result?.raw || "No response from backend.";

        return { response: resultText };

    } catch (e: any)        {
        console.error('Dashboard AI Chat Error:', e);
        return {
            error: 'Sorry, I encountered an error processing your dashboard query.'
        }
    }
}
