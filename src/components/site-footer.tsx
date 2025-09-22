import Link from 'next/link';
import { AppIcon } from './app-icon';

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-8">
      <div className="container flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start">
          <Link href="/" className="flex items-center space-x-2">
            <AppIcon className="h-6 w-6 text-primary" />
            <span className="font-bold">
              Blue Query
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Blue Query. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/discover" className="text-sm text-muted-foreground hover:text-foreground">
            Discover
          </Link>
          <Link href="/learn" className="text-sm text-muted-foreground hover:text-foreground">
            Learn
          </Link>
        </div>
      </div>
    </footer>
  );
}
