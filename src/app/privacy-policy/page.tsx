import { queryDb } from '@/utils/db';
import { PolicyPage } from '@/components/ui/PolicyPage';

// Opt out of static rendering so changes in admin CMS update immediately
export const dynamic = 'force-dynamic';

export default async function PrivacyPolicyPage({ searchParams }: { searchParams: Promise<{ site?: string }> }) {
  let content = '';
  const params = await searchParams;
  const siteId = params?.site === 'coins' ? 'coins' : 'fashion';

  try {
    const rows = await queryDb('SELECT privacy_policy FROM website_settings WHERE id = $1', [siteId]);
    content = rows && rows.length > 0 ? rows[0].privacy_policy : '';
  } catch (error) {
    console.error('Failed to load Privacy Policy:', error);
  }

  if (!content) {
    content = '<p class="text-gray-500 italic text-center py-10">Content is currently unavailable.</p>';
  }

  return (
    <PolicyPage 
      title="Privacy Policy"
      subtitle="Data Protection & User Privacy"
      content={content}
    />
  );
}
