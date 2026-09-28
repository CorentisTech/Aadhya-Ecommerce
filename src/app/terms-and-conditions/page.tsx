import { queryDb } from '@/utils/db';
import { PolicyPage } from '@/components/ui/PolicyPage';

export const dynamic = 'force-dynamic';

export default async function TermsAndConditionsPage() {
  const rows = await queryDb('SELECT terms_conditions FROM website_settings LIMIT 1');
  const content = rows && rows.length > 0 ? rows[0].terms_conditions : '';

  return (
    <PolicyPage 
      title="Terms & Conditions"
      subtitle="Purchase Agreements & Legal Protection"
      content={content}
    />
  );
}
