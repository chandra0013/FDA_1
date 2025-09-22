'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function BlurText({ text, className, delay = 0 }: BlurTextProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <span className={cn('inline-flex overflow-hidden', className)}>
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          className="animate-blur opacity-0"
          style={{ animationDelay: `${delay + i * 0.1}s` }}
        >
          {word}&nbsp;
        </span>
      ))}
    </span>
  );
}
