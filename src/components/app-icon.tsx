import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export function AppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 12c-3.33-1.5-4-4-2-6 2 2 4.67 2.5 6 1" />
      <path d="M12 12c-3.33 1.5-4 4-2 6 2-2 4.67-2.5 6-1" />
      <path d="M6 12c-3.33 1.5-4 4-2 6 2-2 4.67-2.5 6-1" />
      <path d="M6 12c-3.33-1.5-4-4-2-6 2 2 4.67 2.5 6 1" />
      <path d="M18 12c3.33-1.5 4-4 2-6-2 2-4.67 2.5-6 1" />
      <path d="M18 12c3.33 1.5 4 4 2 6-2-2-4.67-2.5-6-1" />
    </svg>
  );
}
