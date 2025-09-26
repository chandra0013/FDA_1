
'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import {
  Bot,
  User,
  Send,
  MessageSquare,
  Loader2,
  X,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { handleDashboardAiChat } from '@/app/actions';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

interface DashboardChatProps {
    mode: 'descriptive' | 'predictive';
    context?: string;
}

const predictiveCannedQueries = [
    {
        question: "Explain this forecast dashboard",
        answer: "This dashboard shows AI-generated forecasts for key ocean variables. The main charts show the predicted values over the selected horizon, along with a confidence band. The 'Glance View' provides a summary of trends, confidence levels, and potential anomalies."
    },
    {
        question: "What is the confidence band?",
        answer: "The shaded area around the forecast line is the **95% confidence interval**. It represents the range within which the model expects the true value to fall. A wider band indicates higher uncertainty, often due to a shorter training period or high data variability."
    },
    {
        question: "What is an anomaly?",
        answer: "An **anomaly** is a data point that deviates significantly from what is expected. The Anomaly Detection panel uses a machine learning model to flag measurements that are statistical outliers. This can help identify potential sensor malfunctions or unusual environmental events."
    },
    {
        question: "How can I improve forecast confidence?",
        answer: "Generally, forecast confidence increases with more historical data. You can try reconfiguring the model with a **longer training period** (e.g., 100 days instead of 20). This allows the model to better learn the underlying seasonal patterns."
    }
];

export function DashboardChat({ mode, context = "No specific context provided." }: DashboardChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = (query: string) => {
    if (!query.trim() || isPending) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    // For predictive mode, check for canned response first
    if (mode === 'predictive') {
        const canned = predictiveCannedQueries.find(q => q.question === query);
        if (canned) {
            startTransition(async () => {
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate loading
                const assistantMessage: Message = {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: canned.answer,
                };
                setMessages((prev) => [...prev, assistantMessage]);
            });
            return;
        }
    }

    // Fallback to live AI for descriptive or non-canned predictive queries
    startTransition(async () => {
      const result = await handleDashboardAiChat(query, mode, context);

      if (result.error) {
        toast({ title: 'AI Error', description: result.error, variant: 'destructive' });
      } else if (result.response) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: result.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    });
  };

  const renderSuggestions = () => {
      if (mode !== 'predictive') return null;
      return (
          <div className="grid grid-cols-2 gap-2 p-4">
              {predictiveCannedQueries.map(q => (
                  <Button 
                    key={q.question}
                    variant="outline"
                    className="text-xs h-auto whitespace-normal"
                    onClick={() => handleSubmit(q.question)}
                    disabled={isPending}
                  >
                      {q.question}
                  </Button>
              ))}
          </div>
      );
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg z-50"
      >
        <MessageSquare />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex flex-col p-0">
          <SheetHeader className="p-6">
            <SheetTitle>Argonaut Assistant</SheetTitle>
            <SheetDescription>
              Ask questions about the {mode} dashboard.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1" ref={scrollAreaRef as any}>
            <div className="space-y-6 p-4">
               {messages.length === 0 && renderSuggestions()}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] rounded-lg p-3 text-sm',
                      message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    )}
                  >
                    <ReactMarkdown className="prose prose-sm prose-invert max-w-none">
                      {message.content}
                    </ReactMarkdown>
                     {message.role === 'assistant' && messages[messages.length - 1].id === message.id && renderSuggestions()}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        <User size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isPending && (
                <div className="flex items-start gap-3 justify-start">
                  <Avatar className="w-8 h-8"><AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback></Avatar>
                  <div className="rounded-lg p-3 bg-secondary"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(input);
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this dashboard..."
                className="flex-1"
                disabled={isPending}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isPending}>
                <Send />
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
