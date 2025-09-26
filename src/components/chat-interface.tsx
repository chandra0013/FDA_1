
'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import {
  Bot,
  User,
  Send,
  Mic,
  Loader2,
  Download,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { handleAiChat } from '@/app/actions';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reportDataUri?: string;
};

const sampleQueries = [
  'What is an Argo float?',
  'Compare BGC parameters in Arabian Sea',
  'Find nearest ARGO floats to 15°N, 90°E',
  'Generate a report on temperature anomalies in the North Atlantic',
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition({
    onSpeechEnd: (finalTranscript) => {
        const query = (input + (finalTranscript ? (input ? ' ' : '') + finalTranscript : '')).trim();
        setInput(query);
        if (query) {
            handleSubmit(query);
        }
    }
  });
  
  useEffect(() => {
    if (isListening) {
      setInput(transcript);
    }
  }, [transcript, isListening]);

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

    startTransition(async () => {
      const result = await handleAiChat({ query, history: messages.slice(-5) });

      if (result.error) {
        toast({ title: 'AI Error', description: result.error, variant: 'destructive' });
      } else if (result.response) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: result.response,
          reportDataUri: result.reportDataUri,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    });
  };

  const handleVoiceClick = () => {
    if (isListening) stopListening();
    else startListening();
  };

  return (
    <Card className="h-full flex flex-col bg-card/80 glassmorphism">
      <CardHeader className="text-center">
        <div className="mx-auto bg-background p-3 rounded-full mb-2 w-fit">
            <Bot className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold">Welcome to Argonaut</CardTitle>
        <CardDescription>Ask me about ocean data or try a sample query</CardDescription>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="grid grid-cols-2 gap-2">
              {sampleQueries.map((query) => (
                <Button
                  key={query}
                  variant="outline"
                  className="text-xs h-auto py-2 whitespace-normal"
                  onClick={() => handleSubmit(query)}
                >
                  {query}
                </Button>
              ))}
            </div>
          )}

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
                  message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'
                )}
              >
                <ReactMarkdown className="prose prose-sm prose-invert max-w-none">
                  {message.content}
                </ReactMarkdown>
                {message.reportDataUri && (
                    <Button asChild variant="secondary" className="mt-2">
                        <a href={message.reportDataUri} download="report.pdf">
                            <Download className="mr-2" /> Download Report
                        </a>
                    </Button>
                )}
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
              <Card className="bg-background"><CardContent className="p-3"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></CardContent></Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
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
            placeholder={isListening ? "Listening..." : 'Ask about ocean data...'}
            className="flex-1"
            disabled={isPending}
          />
          <Button
            type="button"
            size="icon"
            variant={isListening ? 'destructive' : 'outline'}
            onClick={handleVoiceClick}
            disabled={isPending}
          >
            <Mic className={cn(isListening && 'text-accent animate-pulse')} />
          </Button>
          <Button type="submit" size="icon" disabled={!input.trim() || isPending}>
            <Send />
          </Button>
        </form>
      </div>
    </Card>
  );
}
