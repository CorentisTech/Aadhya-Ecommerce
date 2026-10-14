import { StatusLayout } from '@/components/ui/StatusLayout';

export default function NotFound() {
  return (
    <StatusLayout
      codePrefix="4"
      codeSuffix="4"
      title="Oops, i think we're lost"
      subtitle="Let's get you back somewhere familiar..."
      actionText="Back to home"
      actionHref="/"
      actionIcon="home"
      mood="confused"
    />
  );
}
