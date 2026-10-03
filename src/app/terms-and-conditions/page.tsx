import { queryDb } from '@/utils/db';
import { PolicyPage } from '@/components/ui/PolicyPage';

export const dynamic = 'force-dynamic';

export default async function TermsAndConditionsPage() {
  let content = '';

  try {
    const rows = await queryDb('SELECT terms_conditions FROM website_settings LIMIT 1');
    content = rows && rows.length > 0 ? rows[0].terms_conditions : '';
  } catch (error) {
    console.error('Failed to load Terms & Conditions:', error);
  }

  if (!content) {
    content = '<p class="text-gray-500 italic text-center py-10">Content is currently unavailable.</p>';
  }

  return (
    <PolicyPage 
      title="Terms & Conditions"
      subtitle="Purchase Agreements & Legal Protection"
      content={content}
    />
  );
}
