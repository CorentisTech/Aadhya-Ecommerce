import { queryDb } from '@/utils/db';
import { PolicyPage } from '@/components/ui/PolicyPage';

export const dynamic = 'force-dynamic';

export default async function CancellationAndRefundPage({ searchParams }: { searchParams: Promise<{ site?: string }> }) {
  let content = '';
  const params = await searchParams;
  const siteId = params?.site === 'coins' ? 'coins' : 'fashion';

  try {
    const rows = await queryDb('SELECT refund_policy FROM website_settings WHERE id = $1', [siteId]);
    content = rows && rows.length > 0 ? rows[0].refund_policy : '';
  } catch (error) {
    console.error('Failed to load Refund Policy:', error);
  }

  if (!content) {
    content = '<p class="text-gray-500 italic text-center py-10">Content is currently unavailable.</p>';
  }

  return (
    <PolicyPage 
      title="Cancellation & Refund"
      subtitle="Hassle-Free Return Policy"
      content={content}
    />
  );
}
