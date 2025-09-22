import { cn } from '@/lib/utils';

export function ShinyText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'relative inline-block',
        'bg-gradient-to-r from-foreground/80 via-foreground to-foreground/80 bg-clip-text text-transparent',
        'animate-shine bg-[length:200%_100%]',
        className
      )}
    >
      {children}
    </span>
  );
}
