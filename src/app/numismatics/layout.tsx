import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Happy Collectables — Invest in history. Invest in future.',
  description: 'Happy Collectables: Authentic historic coins, ancient Indian dynasties, British India coinage, and rare currency notes.',
};

export default function NumismaticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
