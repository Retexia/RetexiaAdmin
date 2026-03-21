import React from 'react';
import { Users, FileText, ClipboardList, Banknote, TrendingUp, AlertCircle, CalendarClock, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useDashboardData } from '../hooks/useDashboardData';

export function DashboardHome() {
  const { user } = useAuth();
  const { leadsCount, totalClients, inDiscoveryCount, revenue, recentActivity, isLoading } = useDashboardData();

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Admin';

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto bg-zinc-950 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(revenue);

  return (
    <div className="flex-1 overflow-auto bg-zinc-950 p-4 sm:p-8 md:p-10 font-sans">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Workspace Control</h4>
          <h1 className="text-[40px] font-bold text-zinc-50 tracking-tight leading-tight">Good morning, {firstName}.</h1>
          <h2 className="text-[32px] font-medium text-zinc-400 tracking-tight leading-tight">Here's your workspace at a glance.</h2>
        </div>

        {/* Top 4 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
          <div className="bg-[#1c1c1f] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between h-32 relative">
            <div className="flex justify-between items-start">
              <Users className="h-5 w-5 text-zinc-400" />
              <span className="bg-zinc-800 text-zinc-300 text-[10px] px-2 py-0.5 rounded-full font-bold">LIVE</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-50 mb-1">{leadsCount}</div>
              <div className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">New Leads</div>
            </div>
          </div>

          <div className="bg-[#1c1c1f] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between h-32 relative">
            <div className="flex justify-between items-start">
              <FileText className="h-5 w-5 text-zinc-400" />
              <span className="text-zinc-300 text-[10px] font-bold">ACTIVE</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-50 mb-1">{totalClients}</div>
              <div className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Total Clients</div>
            </div>
          </div>

          <div className="bg-[#1c1c1f] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between h-32 relative">
            <div className="flex justify-between items-start">
              <ClipboardList className="h-5 w-5 text-zinc-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-zinc-50 mb-1">{inDiscoveryCount}</div>
              <div className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">In Discovery</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl p-5 flex flex-col justify-between h-32 relative shadow-lg shadow-blue-900/20">
            <div className="flex justify-between items-start">
              <Banknote className="h-5 w-5 text-blue-100" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">{formattedRevenue}</div>
              <div className="text-[10px] font-black uppercase text-blue-100 tracking-wider">Total Revenue</div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          
          {/* Left Column (Charts & Tasks) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Project Velocity Chart Card */}
            <div className="bg-[#1c1c1f] border border-zinc-800 rounded-xl p-6">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-[15px] font-bold text-zinc-100 tracking-wide mb-1">Project Velocity</h3>
                  <p className="text-xs text-zinc-400 font-medium">BRD generation progress (7 Days)</p>
                </div>
                <div className="flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700/50 px-2.5 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3 text-indigo-400" />
                  <span className="text-[10px] font-bold text-indigo-100 tracking-wide">+18% Efficiency</span>
                </div>
              </div>

              {/* Pseudo Bar Chart */}
              <div className="h-48 flex items-end justify-between gap-2 relative">
                {/* Background grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-b border-zinc-800/50 w-full h-[1px]"></div>
                  <div className="border-b border-zinc-800/50 w-full h-[1px]"></div>
                  <div className="border-b border-zinc-800/50 w-full h-[1px]"></div>
                </div>
                
                {/* Bars */}
                <div className="w-full relative z-10 flex items-end justify-between pb-1 h-full px-2">
                  <div className="w-[12%] bg-zinc-700/80 hover:bg-zinc-600 transition-colors h-[25%] rounded-sm"></div>
                  <div className="w-[12%] bg-zinc-700/80 hover:bg-zinc-600 transition-colors h-[35%] rounded-sm"></div>
                  <div className="w-[12%] bg-zinc-700/80 hover:bg-zinc-600 transition-colors h-[30%] rounded-sm"></div>
                  <div className="w-[12%] bg-zinc-700/80 hover:bg-zinc-600 transition-colors h-[50%] rounded-sm"></div>
                  <div className="w-[12%] bg-zinc-700/80 hover:bg-zinc-600 transition-colors h-[45%] rounded-sm"></div>
                  <div className="w-[12%] bg-[#a5c0ff] hover:bg-blue-300 transition-colors h-[80%] rounded-sm shadow-[0_0_15px_rgba(165,192,255,0.2)]"></div>
                  <div className="w-[12%] bg-zinc-700/80 hover:bg-zinc-600 transition-colors h-[40%] rounded-sm"></div>
                </div>
              </div>
              <div className="flex justify-between mt-3 px-3">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                  <span key={day} className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{day}</span>
                ))}
              </div>
            </div>

            {/* Priority Tasks Card */}
            <div className="bg-[#1c1c1f] border border-zinc-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 flex justify-between items-center border-b border-zinc-800/80 bg-[#1c1c1f]">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <h3 className="text-sm font-bold text-zinc-100 tracking-wide">Priority Tasks</h3>
                </div>
                <button className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors">View All</button>
              </div>
              
              <div className="divide-y divide-zinc-800/60 p-2">
                <div className="px-5 py-4 flex items-start gap-3 hover:bg-zinc-900/50 transition-colors cursor-pointer rounded-lg">
                  <div className="mt-1 h-2 w-2 rounded-full bg-red-400 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-[13px] font-bold text-zinc-100 mb-1 tracking-wide">Review Client A's Design Refs</h4>
                    <p className="text-[11px] text-zinc-400 font-medium">Due in 2 hours &bull; High Priority</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-start gap-3 hover:bg-zinc-900/50 transition-colors cursor-pointer rounded-lg">
                  <div className="mt-1 h-2 w-2 rounded-full bg-indigo-400 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-[13px] font-bold text-zinc-100 mb-1 tracking-wide">Approve Tech Specs for Client B</h4>
                    <p className="text-[11px] text-zinc-400 font-medium">Due Tomorrow &bull; Tech Review</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-start gap-3 hover:bg-zinc-900/50 transition-colors cursor-pointer rounded-lg">
                  <div className="mt-1 h-2 w-2 rounded-full bg-zinc-500 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-[13px] font-bold text-zinc-100 mb-1 tracking-wide">Draft Phase 2 Timeline: Nova</h4>
                    <p className="text-[11px] text-zinc-400 font-medium">Due Oct 24 &bull; Planning</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Recent Activity) */}
          <div className="bg-[#1c1c1f] border border-zinc-800 rounded-xl flex flex-col h-full">
            <div className="px-6 py-5 pb-2">
              <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-widest mb-6">Recent Activity</h3>
              
              <div className="relative pl-[18px]">
                {/* Vertical Timeline Line */}
                <div className="absolute top-2 bottom-6 left-[7px] w-[1px] bg-zinc-800"></div>

                {recentActivity.length === 0 ? (
                  <div className="text-sm text-zinc-500 mt-4 mb-8">No recent activity detected.</div>
                ) : (
                  recentActivity.map((doc: any, i: number) => {
                    const isLast = i === recentActivity.length - 1;
                    const date = new Date(doc.created_at).toLocaleDateString() || 'Recently';
                    const docType = doc.document_type || 'Document';
                    
                    return (
                      <div key={doc.id} className={`relative ${!isLast ? 'mb-7' : ''}`}>
                        <div className="absolute -left-[23px] top-0.5 bg-zinc-800 h-6 w-6 rounded-full flex items-center justify-center border-4 border-[#1c1c1f]">
                          <FileText className="h-2.5 w-2.5 text-zinc-400" />
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold text-zinc-100 leading-snug">{docType} Update</h4>
                          <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">Status: {doc.status || 'Updated'}</p>
                          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mt-2.5">{date}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="mt-auto p-4 border-t border-zinc-800/80">
              <button className="w-full py-2 bg-zinc-800/50 hover:bg-zinc-800 transition-colors text-xs font-bold text-zinc-300 rounded-lg tracking-wide disabled:opacity-50">
                Load More Activity
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
