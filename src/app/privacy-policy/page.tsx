import { queryDb } from '@/utils/db';
import { PolicyPage } from '@/components/ui/PolicyPage';

// Opt out of static rendering so changes in admin CMS update immediately
export const dynamic = 'force-dynamic';

export default async function PrivacyPolicyPage() {
  const rows = await queryDb('SELECT privacy_policy FROM website_settings LIMIT 1');
  const content = rows && rows.length > 0 ? rows[0].privacy_policy : '';

  return (
    <PolicyPage 
      title="Privacy Policy"
      subtitle="Data Protection & User Privacy"
      content={content}
    />
  );
}
