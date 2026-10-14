'use client';

import { useEffect } from 'react';
import { StatusLayout } from '@/components/ui/StatusLayout';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application runtime error:', error);
  }, [error]);

  return (
    <StatusLayout
      codePrefix="5"
      codeSuffix="0"
      title="Oops, something went wrong"
      subtitle="Our server ran into an unexpected hiccup. Don't worry, our team has been notified."
      actionText="Try again"
      onActionClick={() => reset()}
      actionIcon="refresh"
      mood="worried"
    />
  );
}
