import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Search, MoreHorizontal, ArrowRight, Server } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useArchQueue } from '../hooks/useArchQueue';

export function ArchitectureQueue() {
  const navigate = useNavigate();
  const { archDocs, isLoading } = useArchQueue();

  if (isLoading) {
    return (
      <div className="flex bg-zinc-950 h-full w-full flex-col font-sans items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-zinc-950 font-sans">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 bg-[#131316] px-4 sm:px-8 py-5 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50 tracking-tight">Architecture Team Queue</h1>
          <p className="text-sm text-zinc-400 mt-1">Pending Business Requirements Documents requiring Technical Specifications.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 text-zinc-300 font-medium flex-1 sm:flex-none justify-center">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">System Health</span>
            <span className="sm:hidden">Health</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-zinc-950 p-4 sm:p-8">
        
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input className="pl-9 w-full" placeholder="Search architecture queue..." />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center">
              Filter
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center">
              Sort
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300 min-w-[800px]">
            <thead className="border-b border-zinc-800 bg-zinc-900 text-xs uppercase text-zinc-500 font-semibold tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4">Project BRD</th>
                <th scope="col" className="px-6 py-4">Client</th>
                <th scope="col" className="px-6 py-4">Pages Est.</th>
                <th scope="col" className="px-6 py-4">Target Deadline</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-zinc-900/40">
              {archDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <Database className="h-4 w-4" />
                      </div>
                      {doc.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-300">{doc.clientName}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    {doc.answers?.strategy?.totalPages || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {doc.answers?.logistics?.deadline || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-zinc-400 hover:text-zinc-200 font-medium border-zinc-700/50"
                        onClick={() => navigate('/brd/' + doc.id)}
                      >
                        Review BRD
                      </Button>
                      <Button 
                        variant={doc.frdData ? "outline" : "primary"}
                        size="sm" 
                        className={`h-8 font-medium ${doc.frdData ? 'text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10' : ''}`}
                        onClick={() => navigate(`/arch-queue/${doc.id}/frd`)}
                      >
                        {doc.frdData ? 'Edit FRD' : 'Draft FRD'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {archDocs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="h-16 w-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-6 text-zinc-500 border border-zinc-800">
                <Database className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 mb-2">Queue is Empty</h3>
              <p className="text-sm text-zinc-400 max-w-sm">
                No BRDs have been forwarded to the Architecture team yet. Open a BRD and click "Send to Architecture Team" to forward it here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
