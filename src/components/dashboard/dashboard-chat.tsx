
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
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
            <div className="space-y-6">
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
