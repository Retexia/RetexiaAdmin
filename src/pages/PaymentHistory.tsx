import React from 'react';
import { CreditCard } from 'lucide-react';

export function PaymentHistory() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-10 font-sans text-center h-full">
      <div className="h-16 w-16 mb-6 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
        <CreditCard className="h-8 w-8 text-amber-500" />
      </div>
      <h2 className="text-2xl font-bold text-zinc-50 tracking-tight mb-2">Payment History</h2>
      <p className="text-zinc-400 max-w-md">A detailed ledger of all incoming client payments and ongoing subscription balances will be available here.</p>
    </div>
  );
}
