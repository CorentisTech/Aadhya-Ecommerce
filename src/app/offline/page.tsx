'use client';

import { StatusLayout } from '@/components/ui/StatusLayout';

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <StatusLayout
      codePrefix="N"
      codeSuffix="T"
      title="You Appear to Be Offline"
      subtitle="We can't connect to the internet right now. Check your Wi-Fi or mobile data and try again."
      actionText="Retry Connection"
      onActionClick={handleRetry}
      actionIcon="refresh"
      mood="offline"
    />
  );
}
