'use client';

import { Button } from '@/components/ui/button';
import {
  Bot,
  ChevronDown,
  Database,
  Settings,
  Unplug,
  Link,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function CustomSelector({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button variant="outline" size="sm" className={cn('h-8', className)}>
          <Settings className="h-4 w-4" />
          Admin
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push('/sources')}>
          <Link className="h-4 w-4" />
          Sources
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bot className="h-4 w-4" />
          Agent
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Unplug className="h-4 w-4" />
          MCP
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
