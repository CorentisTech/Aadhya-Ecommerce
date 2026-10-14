import type { Metadata } from 'next';
import { StatusLayout } from '@/components/ui/StatusLayout';

export const metadata: Metadata = {
  title: 'Site Under Maintenance | Aadhya',
  description: 'AADHYA is currently undergoing scheduled maintenance. We will be back shortly.',
};

export default function MaintenancePage() {
  return (
    <StatusLayout
      codePrefix="5"
      codeSuffix="3"
      title="Scheduled System Maintenance"
      subtitle="We're currently tuning and upgrading our storefront systems. We will be back shortly!"
      actionText="Back to home"
      actionHref="/"
      actionIcon="home"
      mood="fixing"
    />
  );
}
