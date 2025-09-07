// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

import PPDBPageClient from './PPDBPageClient';

export default function PPDBPage() {
  return <PPDBPageClient />;
}