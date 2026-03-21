import React from 'react';
import { Receipt } from 'lucide-react';

export function Invoices() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-10 font-sans text-center h-full">
      <div className="h-16 w-16 mb-6 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
        <Receipt className="h-8 w-8 text-blue-400" />
      </div>
      <h2 className="text-2xl font-bold text-zinc-50 tracking-tight mb-2">Invoices</h2>
      <p className="text-zinc-400 max-w-md">Manage outgoing invoices, create new billing statements, and track overdue client accounts.</p>
    </div>
  );
}
