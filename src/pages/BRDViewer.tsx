import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Printer, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../lib/supabase';

export function BRDViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [doc, setDoc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function fetchDoc() {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('project_documents')
          .select(`
            *,
            projects (
              project_name,
              clients (
                company_name
              )
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setDoc(data);
      } catch (err) {
        console.error('Failed to load BRD', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDoc();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-950 font-sans">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-950 font-sans flex-col gap-4 text-center">
        <h2 className="text-xl font-bold text-zinc-100">Document Not Found</h2>
        <p className="text-zinc-400">The requested BRD document does not exist or has been removed.</p>
        <Button onClick={() => navigate('/brd')}>Back to BRD List</Button>
      </div>
    );
  }

  const answers = doc.content || {};
  const project = doc.projects as any;
  const clientName = project?.clients?.company_name || 'Unknown Client';
  const title = project?.project_name || 'Business Requirements Document';
  const dateCreated = new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const isSentToArch = doc.status === 'Sent to Arch' || doc.status === 'FRD Completed' || doc.status === 'FRD Drafted';

  const handleSendToArch = async () => {
    setIsSending(true);
    try {
      const { error } = await supabase
        .from('project_documents')
        .update({ status: 'Sent to Arch' })
        .eq('id', id);

      if (error) throw error;
      navigate('/arch-queue');
    } catch (err) {
      console.error('Failed to send to arch', err);
      alert('Failed to forward to Architecture Team.');
      setIsSending(false);
    }
  };

  const renderSection = (title: string, answersObj: Record<string, string>, labelsMapping: Record<string, string>) => {
    return (
      <section className="mb-12 break-inside-avoid">
        <h2 className="text-2xl font-bold text-zinc-100 mb-6 pb-2 border-b border-zinc-800">{title}</h2>
        <div className="space-y-6">
          {Object.entries(labelsMapping).map(([key, label]) => {
            const answer = answersObj?.[key];
            if (!answer) return null;
            return (
              <div key={key} className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/80">
                <h3 className="text-[13px] font-bold text-zinc-400 mb-2 uppercase tracking-wide">{label}</h3>
                <p className="text-[15px] text-zinc-200 leading-relaxed whitespace-pre-wrap">{answer}</p>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="flex h-full flex-col font-sans bg-zinc-950">
      
      {/* Top Header */}
      <header className="flex-shrink-0 border-b border-zinc-800 bg-[#1c1c1f] px-4 sm:px-8 py-5 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={() => navigate('/brd')}
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Badge variant={doc.status === 'Drafted' ? 'info' : doc.status === 'Sent to Arch' ? 'warning' : 'success'}>
                {doc.status}
              </Badge>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest hidden sm:inline">{clientName}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-zinc-50">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 font-medium">
          <Button variant="outline" className="gap-2 flex-shrink-0 flex-1 sm:flex-none justify-center">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button variant="outline" className="gap-2 flex-shrink-0 flex-1 sm:flex-none justify-center">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button variant="primary" className="gap-2 flex-shrink-0 flex-1 sm:flex-none justify-center">
            <Download className="h-4 w-4" />
            Export<span className="hidden sm:inline"> PDF</span>
          </Button>
        </div>
      </header>

      {/* Main Document Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 md:p-12 custom-scrollbar bg-zinc-950">
        <div className="max-w-[850px] mx-auto min-h-full bg-[#131316] border border-zinc-800 shadow-2xl rounded-2xl p-6 sm:p-12">
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-8 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-zinc-50 tracking-tight mb-3">Business Requirements Document</h1>
              <p className="text-lg text-zinc-400">{clientName} Intake Specifications</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-indigo-400 mb-1">Generated via AI Intake</div>
              <div className="text-xs text-zinc-500">{dateCreated}</div>
            </div>
          </div>

          <div className="space-y-2">
            {renderSection("1. Project Strategy", answers?.strategy || {}, {
              primaryGoal: "Primary Goal",
              targetAudience: "Target Audience & Success Metrics",
              totalPages: "Estimated Total Pages"
            })}

            {renderSection("2. Design & Brand", answers?.design || {}, {
              brandAssets: "Existing Brand Assets",
              lovedLink1: "Loved Link 1",
              lovedLink2: "Loved Link 2",
              lovedLink3: "Loved Link 3",
              hatedLink: "Hated Link"
            })}

            {renderSection("3. Content & Assets", answers?.content || {}, {
              copyStatus: "Website Copy Readiness",
              mediaStatus: "Photos & Videos Readiness"
            })}

            {renderSection("4. Technical Requirements", answers?.technical || {}, {
              specificFeatures: "Specific Required Features",
              customAdmin: "Custom Admin Dashboard Needs",
              externalIntegrations: "External Integrations",
              futureFeatures: "Phase 2 / Future Features"
            })}

            {renderSection("5. Logistics & Compliance", answers?.logistics || {}, {
              domainInfo: "Domain Info & Registration",
              deadline: "Hard Deadline & Drivers",
              approvalContact: "Single Point of Contact for Approvals",
              legalDocs: "Legal Documents (TOS / Privacy)",
              regulations: "Industry Regulations"
            })}
          </div>

          <div className="mt-16 pt-8 border-t border-zinc-900 flex items-center justify-center">
             <Button 
               variant="outline" 
               className="gap-2 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
               onClick={handleSendToArch}
               disabled={isSentToArch || isSending}
             >
              <Send className="h-4 w-4" />
              {isSending ? 'Sending...' : isSentToArch ? 'Forwarded to Architecture' : 'Send to Architecture Team'}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
