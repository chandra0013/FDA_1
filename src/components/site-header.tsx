
'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AppIcon } from '@/components/app-icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Globe } from 'lucide-react';


const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/globe', label: 'Globe' },
  { href: '/learn', label: 'Learn' },
  { href: '/discover/pricing', label: 'Pricing' },
  { href: '/community', label: 'Community' },
];

const discoverLinks = [
    { href: '/discover', label: 'FloatChat' },
    { href: '/discover/lida', label: 'Lida (Voice & Visualize)' },
    { href: '/discover/datasets', label: 'Datasets' },
    { href: '/discover/how-it-works', label: 'How It Works' },
    { href: '/discover/product-tour', label: 'Product Tour' },
    { href: '/discover/developer', label: 'Developers' },
    { href: '/discover/resources', label: 'Resources' },
]

export function SiteHeader() {

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 py-4'
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
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 text-foreground/60 transition-colors hover:text-foreground/80 focus:outline-none">
                        Discover <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {discoverLinks.slice(0, 3).map((link) => (
                             <DropdownMenuItem key={link.href} asChild>
                                <Link href={link.href}>{link.label}</Link>
                            </DropdownMenuItem>
                        ))}
                         <DropdownMenuSeparator />
                         {discoverLinks.slice(3).map((link) => (
                             <DropdownMenuItem key={link.href} asChild>
                                <Link href={link.href}>{link.label}</Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
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
