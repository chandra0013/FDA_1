import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import React from 'react';

interface StarBorderProps extends ButtonProps {
  children: React.ReactNode;
}

export const StarBorder = React.forwardRef<HTMLButtonElement, StarBorderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'relative p-[2px] overflow-hidden rounded-lg',
          'bg-background hover:bg-background/90',
          className
        )}
        {...props}
      >
        <div className="absolute inset-[-1000%] animate-border-spin bg-[conic-gradient(from_90deg_at_50%_50%,#4DB6AC_0%,#FFB74D_50%,#4DB6AC_100%)]" />
        <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-background px-8 py-2 text-sm font-medium text-foreground backdrop-blur-3xl">
          {children}
        </div>
      </Button>
    );
  }
);
StarBorder.displayName = 'StarBorder';
