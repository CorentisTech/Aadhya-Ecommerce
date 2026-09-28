import { queryDb } from '@/utils/db';
import { PolicyPage } from '@/components/ui/PolicyPage';

export const dynamic = 'force-dynamic';

export default async function CancellationAndRefundPage() {
  const rows = await queryDb('SELECT refund_policy FROM website_settings LIMIT 1');
  const content = rows && rows.length > 0 ? rows[0].refund_policy : '';

  return (
    <PolicyPage 
      title="Cancellation & Refund"
      subtitle="Hassle-Free Return Policy"
      content={content}
    />
  );
}
