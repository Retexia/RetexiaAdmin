import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MoreHorizontal, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useBRDs } from '../hooks/useBRDs';

export function BRDDrafting() {
  const navigate = useNavigate();
  const { brds, isLoading } = useBRDs();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft': return <Badge variant="info">Draft</Badge>;
      case 'Review Required': return <Badge variant="warning">Review Required</Badge>;
      case 'Final': return <Badge variant="success">Final</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex h-full flex-col bg-zinc-950 font-sans">
      <header className="flex items-center justify-between border-b border-zinc-800 bg-[#131316] px-4 sm:px-8 py-5 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50 tracking-tight">BRD Drafting & Records</h1>
          <p className="text-sm text-zinc-400 mt-1">A unified repository of all generated Business Requirements Documents.</p>
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-zinc-950 p-4 sm:p-8">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300 min-w-[700px]">
            <thead className="border-b border-zinc-800 bg-zinc-900 text-xs uppercase text-zinc-500 font-semibold tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4">Document Title</th>
                <th scope="col" className="px-6 py-4">Client</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Date Generated</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-zinc-900/40">
              {brds.map((doc) => (
                <tr key={doc.id} className="hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <FileText className="h-4 w-4" />
                      </div>
                      {doc.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-300">{doc.clientName}</td>
                  <td className="px-6 py-4">{getStatusBadge(doc.status)}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                      {doc.dateCreated}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 font-medium"
                        onClick={() => navigate('/brd/' + doc.id)}
                      >
                        Open Document
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
          
          {brds.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-6 text-zinc-500 border border-zinc-800">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 mb-2">No BRDs Generated Yet</h3>
              <p className="text-sm text-zinc-400 max-w-sm">
                When you or a client completes the 17-question intake form via their Client Profile, the finalized document will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
