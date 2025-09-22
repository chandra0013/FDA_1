
'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Bot, User, Send, Mic, Download, Loader2, ChevronsRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { handleAiChat } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isDownloading?: boolean;
};

const sampleQueries = [
  'What is an Argo float?',
  'Compare BGC parameters in Arabian Sea',
  'Find nearest ARGO floats to 15°N, 90°E',
  'Generate a report on temperature anomalies in the North Atlantic.',
];

const MarkdownComponents: object = {
  h3: ({ node, ...props }: any) => <h3 className="mt-4 mb-2 text-lg font-semibold" {...props} />,
  ul: ({ node, ...props }: any) => <ul className="list-none space-y-2" {...props} />,
  li: ({ node, ...props }: any) => (
    <li className="flex items-start">
      <ChevronsRight className="h-4 w-4 mr-2 mt-1 text-primary flex-shrink-0" />
      <span {...props} />
    </li>
  ),
  blockquote: ({ node, ...props }: any) => (
    <blockquote className="mt-2 border-l-2 border-primary pl-4 italic text-muted-foreground" {...props} />
  ),
  p: ({ node, ...props }: any) => <p className="mb-2" {...props} />,
};


export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onSpeechEnd: (finalTranscript) => {
      setInput(prev => prev + (finalTranscript ? (prev ? ' ' : '') + finalTranscript : ''));
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
  
  const handleSampleQuery = (query: string) => {
    setInput(query);
    handleSubmit(query);
  }

  const handleDownload = async (messageId: string, query: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? {...m, isDownloading: true} : m));

    startTransition(async () => {
      try {
        const result = await handleAiChat(query, true);
        if (result.reportDataUri) {
          const link = document.createElement('a');
          link.href = result.reportDataUri;
          link.download = 'blue_query_report.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          toast({
            title: 'Download Failed',
            description: result.error || 'Could not generate the report.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred during download.',
          variant: 'destructive',
        });
      } finally {
        setMessages(prev => prev.map(m => m.id === messageId ? {...m, isDownloading: false} : m));
      }
    });
  }

  const handleSubmit = (query: string) => {
    if (!query.trim() || isPending) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      const result = await handleAiChat(query);
      if (result.error) {
        toast({
          title: 'AI Error',
          description: result.error,
          variant: 'destructive',
        });
         const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: "I'm sorry, I encountered an error. Please try again.",
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: result.response || "I don't have a response for that.",
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    });
  };

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="text-center p-8">
               <Bot className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold">Welcome to Argonaut</h3>
              <p className="text-muted-foreground text-sm">
                Ask me about ocean data or try a sample query.
              </p>
               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {sampleQueries.slice(0, 4).map((query) => (
                    <Button key={query} variant="outline" size="sm" className="h-auto text-left whitespace-normal" onClick={() => handleSampleQuery(query)}>
                        {query}
                    </Button>
                ))}
            </div>
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
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background'
                )}
              >
                 {message.role === 'assistant' ? (
                  <ReactMarkdown components={MarkdownComponents}>
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p>{message.content}</p>
                )}
                {message.content.includes("report is ready") && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-2 w-full"
                    onClick={() => handleDownload(message.id, messages[messages.indexOf(message) - 1]?.content || '')}
                    disabled={message.isDownloading}
                  >
                    {message.isDownloading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Download Report
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
               <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot size={20} />
                  </AvatarFallback>
                </Avatar>
              <Card className="bg-background">
                <CardContent className="p-3">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </CardContent>
              </Card>
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
            placeholder={isListening ? 'Listening...' : 'Ask about ocean data...'}
            className="flex-1"
            disabled={isPending}
          />
          <Button type="button" size="icon" variant={isListening ? 'destructive' : 'outline'} onClick={handleVoiceClick} disabled={isPending}>
            <Mic className={cn(isListening && 'text-accent animate-pulse')} />
          </Button>
          <Button type="submit" size="icon" disabled={!input.trim() || isPending}>
            <Send />
          </Button>
        </form>
      </div>
    </div>
  );
}
