
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
import { cannedResponses, type CannedResponse } from '@/lib/canned-chat-data';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reportDataUri?: string;
};

// Helper function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};


export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isCannedResponseLoading, setIsCannedResponseLoading] = useState(false);

  // State for managing suggested questions
  const [remainingQuestions, setRemainingQuestions] = useState<CannedResponse[]>(() => shuffleArray(cannedResponses));
  const [currentSuggestions, setCurrentSuggestions] = useState<CannedResponse[]>([]);

  // Function to get the next 4 suggestions
  const getNextSuggestions = () => {
    const availableQuestions = remainingQuestions.length < 4 ? shuffleArray(cannedResponses) : remainingQuestions;
    const nextFour = availableQuestions.slice(0, 4);
    setRemainingQuestions(availableQuestions.slice(4));
    setCurrentSuggestions(nextFour);
  };
  
  // Set initial suggestions
  useEffect(() => {
    getNextSuggestions();
  }, []);


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
  }, [messages, isCannedResponseLoading]);

  const handleCannedSubmit = (question: CannedResponse) => {
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: question.question };
    setMessages((prev) => [...prev, userMessage]);
    
    setIsCannedResponseLoading(true);
    
    setTimeout(() => {
        const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: question.answer,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsCannedResponseLoading(false);
        getNextSuggestions(); // Show new suggestions
    }, 2000); // 2-second loading simulation
  };

  const handleSubmit = (query: string) => {
    if (!query.trim() || isPending || isCannedResponseLoading) return;

    // Check if the query is one of our canned questions first
    const cannedMatch = cannedResponses.find(q => q.question.toLowerCase() === query.toLowerCase());
    if (cannedMatch) {
      handleCannedSubmit(cannedMatch);
      setInput('');
      return;
    }

    // If not a canned question, proceed with AI chat
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      const result = await handleAiChat({ query, history: messages.slice(-5).map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content })) });

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
       getNextSuggestions(); // Show new suggestions
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
              {currentSuggestions.map((query) => (
                <Button
                  key={query.question}
                  variant="outline"
                  className="text-xs h-auto py-2 whitespace-normal"
                  onClick={() => handleCannedSubmit(query)}
                  disabled={isCannedResponseLoading}
                >
                  {query.question}
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
                 {message.role === 'assistant' && messages[messages.length - 1].id === message.id && (
                   <div className="grid grid-cols-2 gap-2 pt-4">
                      {currentSuggestions.map((query) => (
                        <Button
                          key={query.question}
                          variant="outline"
                          className="text-xs h-auto py-2 whitespace-normal"
                          onClick={() => handleCannedSubmit(query)}
                           disabled={isCannedResponseLoading}
                        >
                          {query.question}
                        </Button>
                      ))}
                    </div>
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
          {(isPending || isCannedResponseLoading) && (
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
            disabled={isPending || isCannedResponseLoading}
          />
          <Button
            type="button"
            size="icon"
            variant={isListening ? 'destructive' : 'outline'}
            onClick={handleVoiceClick}
            disabled={isPending || isCannedResponseLoading}
          >
            <Mic className={cn(isListening && 'text-accent animate-pulse')} />
          </Button>
          <Button type="submit" size="icon" disabled={!input.trim() || isPending || isCannedResponseLoading}>
            <Send />
          </Button>
        </form>
      </div>
    </Card>
  );
}
