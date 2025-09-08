'use client';

import { Card } from '@/components/ui/card';
import { BanknotesIcon } from '@heroicons/react/24/outline';

export default function RevenuePage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
        <p className="text-gray-600 mt-2">Track revenue and financial metrics</p>
      </div>

      <Card className="p-12">
        <div className="text-center">
          <BanknotesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Revenue Analytics</h2>
          <p className="text-gray-500">This page is under development</p>
        </div>
      </Card>
    </div>
  );
}