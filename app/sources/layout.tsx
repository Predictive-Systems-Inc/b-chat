'use client';

import { SessionProvider } from 'next-auth/react';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function SourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
    </SessionProvider>
  );
}
