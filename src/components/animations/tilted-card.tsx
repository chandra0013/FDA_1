'use client';

import { cn } from '@/lib/utils';
import React, { useRef } from 'react';

interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltedCard({ children, className }: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;

    const rotateX = (y / height) * -15;
    const rotateY = (x / width) * 15;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const onMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn('transition-transform duration-300 ease-out will-change-transform', className)}
    >
      {children}
    </div>
  );
}
