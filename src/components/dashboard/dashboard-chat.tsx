
'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Bot, User, Send, X, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useToast } from '@/hooks/use-toast';
import { handleDashboardAiChat } from '@/app/actions';
import { Card, CardContent } from '../ui/card';


type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

interface DashboardChatProps {
    mode: 'descriptive' | 'predictive';
    context?: any;
}

const modeHints = {
    descriptive: "You are in Descriptive Analytics Mode. Ask me to explain or customize any current visualization (e.g., ‘Show me salinity scatter for the last 60 days’).",
    predictive: "You are in Predictive Analytics Mode. Ask about model settings or forecast outputs (e.g., ‘Explain the temperature forecast uncertainty’)."
}

export function DashboardChat({ mode, context }: DashboardChatProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const query = input;
    setInput('');

    startTransition(async () => {
      const result = await handleDashboardAiChat(query, mode, context);
      
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

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg flex items-center justify-center animate-pulse-slow"
          aria-label="Open Chat"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="w-6 h-6 text-primary-foreground" />
        </Button>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
            side="right" 
            className="w-full md:w-[400px] bg-card/80 glassmorphism p-0 flex flex-col"
            onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle>FloatChat Assistant</SheetTitle>
            <SheetDescription>{modeHints[mode]}</SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
            <div className="space-y-4">
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
                    {message.content}
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
              onSubmit={handleSubmit}
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
