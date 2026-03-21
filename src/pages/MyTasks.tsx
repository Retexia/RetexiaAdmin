import React from 'react';
import { TrendingUp, BarChart2, Calendar, Clock, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface Task {
  id: string;
  title: string;
  project: string;
  priority: 'HIGH PRIORITY' | 'MEDIUM' | 'LOW';
  date?: string;
  isOverdue?: boolean;
  assignee?: string;
  status: 'IN PROGRESS' | 'REVIEW REQUIRED' | 'DONE';
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Draft BRD for Nova Ventures',
    project: 'Nova Ventures Ltd.',
    priority: 'HIGH PRIORITY',
    date: 'Oct 24, 2026',
    assignee: 'JD',
    status: 'IN PROGRESS'
  },
  {
    id: '2',
    title: 'Competitor Analysis Q4',
    project: 'Stellar Fintech',
    priority: 'MEDIUM',
    date: 'Oct 28, 2026',
    status: 'IN PROGRESS'
  },
  {
    id: '3',
    title: 'UX Flow Optimization',
    project: 'Aether Systems',
    priority: 'HIGH PRIORITY',
    isOverdue: true,
    status: 'REVIEW REQUIRED'
  },
  {
    id: '4',
    title: 'Quarterly Financial Sync',
    project: 'Internal Operations',
    priority: 'LOW',
    status: 'DONE'
  }
];

export function MyTasks() {
  const getPriorityClasses = (priority: Task['priority']) => {
    switch (priority) {
      case 'HIGH PRIORITY': return 'bg-indigo-500/10 text-indigo-400';
      case 'MEDIUM': return 'bg-zinc-800 text-zinc-300';
      case 'LOW': return 'bg-zinc-800/80 text-zinc-400';
    }
  };

  const renderKanbanColumn = (title: string, count: string, dotColor: string, status: Task['status']) => {
    const columnTasks = mockTasks.filter(t => t.status === status);
    
    return (
      <div className="flex-1 min-w-[300px]">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-zinc-100 uppercase">
            <div className={`h-2 w-2 rounded-full ${dotColor}`}></div>
            {title}
          </div>
          <div className="bg-[#27272a] text-zinc-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
            {count}
          </div>
        </div>
        
        <div className="space-y-3">
          {columnTasks.map((task) => (
            <div key={task.id} className="bg-[#1c1c1f] hover:bg-zinc-800/50 transition-colors border border-zinc-800/60 rounded-xl p-5 group cursor-pointer relative">
              
              {status === 'DONE' && (
                <div className="absolute top-5 right-5 text-zinc-600 group-hover:text-zinc-500">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}

              <div className="mb-3">
                <span className={`text-[9px] font-bold px-2 py-1 rounded-sm tracking-wider ${getPriorityClasses(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              
              <h4 className="text-[14px] font-bold text-zinc-100 mb-1 leading-tight tracking-wide pr-6">{task.title}</h4>
              <p className="text-xs text-zinc-400 font-medium mb-6">{task.project}</p>
              
              <div className="flex items-center justify-between mt-auto">
                {task.isOverdue ? (
                  <div className="flex items-center gap-1.5 text-red-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-bold tracking-wide">Overdue</span>
                  </div>
                ) : task.date ? (
                  <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-medium tracking-wide">{task.date}</span>
                  </div>
                ) : (
                  <div></div>
                )}

                {task.assignee && (
                  <div className="h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[9px] font-bold text-zinc-300">
                    {task.assignee}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-[#131316] relative font-sans">
      
      <div className="flex-1 overflow-auto p-4 sm:p-8 lg:p-10">
        <div className="max-w-[1400px] mx-auto space-y-8 sm:space-y-10">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#1c1c1f] border border-zinc-800/80 rounded-xl p-6 relative">
              <div className="absolute top-6 right-6 p-2 bg-zinc-900 rounded-lg">
                <BarChart2 className="h-6 w-6 text-zinc-600" />
              </div>
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] mb-2">Total Tasks</h3>
              <div className="text-[40px] font-bold text-zinc-50 leading-none tracking-tight mb-3">42</div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs font-semibold text-blue-400">+12% from last week</span>
              </div>
            </div>

            <div className="bg-[#1c1c1f] border border-zinc-800/80 rounded-xl p-6">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] mb-2">Completed</h3>
              <div className="text-[40px] font-bold text-zinc-50 leading-none tracking-tight mb-5">28</div>
              <div className="h-1.5 w-full bg-[#27272a] rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full w-[65%] shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div>
              </div>
            </div>

            <div className="bg-[#1c1c1f] border border-zinc-800/80 rounded-xl p-6">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] mb-2">Overdue</h3>
              <div className="text-[40px] font-bold text-red-400 leading-none tracking-tight mb-3">04</div>
              <div className="text-xs font-medium text-zinc-400">Requires immediate attention</div>
            </div>
          </div>

          {/* Active Backlog & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col xl:flex-row xl:items-center gap-4 xl:gap-6">
              <h2 className="text-xl font-bold text-zinc-50 tracking-wide">Active Backlog</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 snap-x" style={{ scrollbarWidth: 'none' }}>
                <button className="whitespace-nowrap flex-shrink-0 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors text-xs font-bold text-white tracking-wide shadow-lg shadow-blue-900/40">
                  All Tasks
                </button>
                <button className="whitespace-nowrap flex-shrink-0 px-5 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-bold text-zinc-300 tracking-wide">
                  Strategy
                </button>
                <button className="whitespace-nowrap flex-shrink-0 px-5 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-bold text-zinc-300 tracking-wide">
                  Design
                </button>
                <button className="whitespace-nowrap flex-shrink-0 px-5 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-bold text-zinc-300 tracking-wide">
                  Tech Specs
                </button>
                <button className="whitespace-nowrap flex-shrink-0 px-5 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-bold text-zinc-300 tracking-wide">
                  Client Ops
                </button>
              </div>
            </div>
            <div className="text-[11px] font-medium text-zinc-400 flex-shrink-0">
              Last updated 2m ago
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
            {renderKanbanColumn('In Progress', '03', 'bg-blue-500', 'IN PROGRESS')}
            {renderKanbanColumn('Review Required', '02', 'bg-zinc-400', 'REVIEW REQUIRED')}
            {renderKanbanColumn('Done', '12', 'bg-indigo-500', 'DONE')}
          </div>

        </div>
      </div>

      {/* Floating Action Button */}
      <button className="absolute bottom-8 right-8 h-14 w-14 bg-blue-600 hover:bg-blue-500 transition-transform hover:scale-105 rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgba(37,99,235,0.4)] z-50">
        <Plus className="h-6 w-6 text-white" />
      </button>
      
    </div>
  );
}
