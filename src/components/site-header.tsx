
'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AppIcon } from '@/components/app-icon';

const navLinks = [
  { href: '/discover', label: 'Discover' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/learn', label: 'Learn' },
  { href: '/tutorials', label: 'Tutorials' },
  { href: '/community', label: 'Community' },
];

export function SiteHeader() {

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4'
      )}
    >
      <div className="container max-w-5xl">
        <div className="glassmorphism flex h-16 items-center justify-between rounded-full border border-border/20 px-6">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <AppIcon className="h-6 w-6 text-primary" />
              <span className="font-bold sm:inline-block">
                Blue Query
              </span>
            </Link>
            <nav className="hidden items-center gap-4 text-sm lg:gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground/60 transition-colors hover:text-foreground/80"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="hidden items-center justify-end space-x-4 md:flex">
              <Button asChild variant="secondary" className="rounded-full">
                <Link href="/discover">Login / Signup</Link>
              </Button>
            </div>
         </div>
      </div>
    </header>
  );
}
