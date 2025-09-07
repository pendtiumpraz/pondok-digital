// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

import TanyaUstadzClient from './TanyaUstadzClient';

export default function TanyaUstadzPage() {
  return <TanyaUstadzClient />;
}