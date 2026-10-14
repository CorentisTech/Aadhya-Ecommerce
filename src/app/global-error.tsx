'use client';

import { useEffect } from 'react';
import { StatusLayout } from '@/components/ui/StatusLayout';
import './globals.css';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Fatal application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased m-0 p-0 font-sans">
        <StatusLayout
          codePrefix="5"
          codeSuffix="0"
          title="System Crash Encountered"
          subtitle="A critical error occurred while rendering the page. Click below to recover the session."
          actionText="Recover Session"
          onActionClick={() => reset()}
          actionIcon="refresh"
          mood="worried"
        />
      </body>
    </html>
  );
}
