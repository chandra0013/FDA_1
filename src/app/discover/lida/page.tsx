'use client';

import { LidaInterface } from '@/components/lida-interface';

export default function LidaPage() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center pt-20 bg-background">
        <div className="w-full max-w-4xl mx-auto">
            <LidaInterface />
        </div>
    </div>
  );
}
