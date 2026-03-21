import React, { useState } from 'react';
import { Settings, CheckSquare, Banknote, AlertTriangle } from 'lucide-react';

export function Notifications() {
  const [priorityMode, setPriorityMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  return (
    <div className="flex h-full flex-col bg-[#131316] overflow-auto font-sans">
      <div className="max-w-[900px] w-full mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">
        
        {/* Top Header Actions */}
        <div className="flex justify-end">
          <button className="text-[13px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            Mark all as read
          </button>
        </div>

        {/* Filters & Priority Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center bg-[#1c1c1f] rounded-lg p-1 border border-zinc-800 self-start">
            <button 
              className={`px-4 py-1.5 text-[13px] font-bold rounded-md transition-colors ${activeTab === 'all' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`px-4 py-1.5 text-[13px] font-bold rounded-md transition-colors ${activeTab === 'unread' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
              onClick={() => setActiveTab('unread')}
            >
              Unread
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold tracking-[0.1em] text-zinc-400 uppercase">Priority Mode</span>
            <button 
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none transition-colors duration-200 ease-in-out ${priorityMode ? 'bg-indigo-500/20' : 'bg-zinc-800'}`}
              onClick={() => setPriorityMode(!priorityMode)}
            >
              <span className={`h-3.5 w-3.5 rounded-full bg-indigo-500 shadow ring-0 transition duration-200 ease-in-out ${priorityMode ? 'translate-x-[7px]' : '-translate-x-[7px] bg-zinc-500'}`} />
            </button>
          </div>
        </div>

        {/* Notifications List - TODAY */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mt-8 mb-2">Today</h3>
          
          {/* Notification 1 */}
          <div className="bg-[#1c1c1f] hover:bg-zinc-800/50 transition-colors border border-zinc-800/80 rounded-xl p-5 flex gap-5 cursor-pointer group">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-orange-500/10 border border-orange-500/20 flex flex-col items-center justify-center text-orange-400">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div className="flex-1 mt-0.5">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[14px] font-bold text-zinc-100 tracking-wide">New Task Assigned</h4>
                <span className="text-[11px] font-bold text-zinc-500 group-hover:text-zinc-400 transition-colors">2m ago</span>
              </div>
              <p className="text-[13px] text-zinc-400 font-medium leading-relaxed">
                You have been assigned to "Q4 Infrastructure Audit". High priority tag added by System Administrator.
              </p>
            </div>
          </div>

          {/* Notification 2 */}
          <div className="bg-[#1c1c1f] hover:bg-zinc-800/50 transition-colors border border-zinc-800/80 rounded-xl p-5 flex gap-5 cursor-pointer group">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-emerald-400">
              <Banknote className="h-5 w-5" />
            </div>
            <div className="flex-1 mt-0.5">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[14px] font-bold text-zinc-100 tracking-wide">Payment Received</h4>
                <span className="text-[11px] font-bold text-zinc-500 group-hover:text-zinc-400 transition-colors">45m ago</span>
              </div>
              <p className="text-[13px] text-zinc-400 font-medium leading-relaxed">
                Invoice #8842-TX for "Monolith Creative" has been paid. Total: $12,400.00 USD.
              </p>
            </div>
          </div>

          {/* Notification 3 */}
          <div className="bg-[#1c1c1f] hover:bg-zinc-800/50 transition-colors border border-zinc-800/80 rounded-xl p-5 flex gap-5 cursor-pointer group">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center text-indigo-400">
              <Settings className="h-5 w-5" />
            </div>
            <div className="flex-1 mt-0.5">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[14px] font-bold text-zinc-100 tracking-wide">System Update Complete</h4>
                <span className="text-[11px] font-bold text-zinc-500 group-hover:text-zinc-400 transition-colors">2h ago</span>
              </div>
              <p className="text-[13px] text-zinc-400 font-medium leading-relaxed">
                Retexia Engine v2.4.0 is now live. All kinetic components have been optimized for high-performance rendering.
              </p>
            </div>
          </div>
        </div>

        {/* Notifications List - YESTERDAY */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mt-10 mb-2">Yesterday</h3>
          
          {/* Notification 4 */}
          <div className="bg-[#1c1c1f] hover:bg-zinc-800/50 transition-colors border border-zinc-800/80 rounded-xl p-5 flex gap-5 cursor-pointer group">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center text-amber-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1 mt-0.5">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[14px] font-bold text-zinc-100 tracking-wide">Task Overdue</h4>
                <span className="text-[11px] font-bold text-zinc-500 group-hover:text-zinc-400 transition-colors">1d ago</span>
              </div>
              <p className="text-[13px] text-zinc-400 font-medium leading-relaxed">
                "Client Onboarding Flow" was due 4 hours ago. Please update the status to prevent escalation.
              </p>
            </div>
          </div>

          {/* Notification 5 (Maintenance Card) */}
          <div className="bg-gradient-to-br from-[#202024] to-[#1c1c1f] border border-zinc-800/80 rounded-xl p-7 flex flex-col gap-4 shadow-lg shadow-black/20 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80"></div>
            
            <div className="flex items-center gap-3">
              <span className="bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
                Maintenance
              </span>
              <span className="text-[13px] font-semibold text-zinc-300">
                Scheduled for Oct 24
              </span>
            </div>

            <div>
              <h4 className="text-lg font-bold text-zinc-50 mb-2">Primary Node Synchronization</h4>
              <p className="text-[14px] text-zinc-400 font-medium leading-relaxed max-w-[500px]">
                We'll be performing a core infrastructure sync. Expect 2-3 minutes of read-only mode during the window.
              </p>
            </div>

            <div className="mt-2">
              <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 transition-colors text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-md border border-zinc-700/50">
                View Calendar
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
