import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useArchQueue() {
  const [archDocs, setArchDocs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
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
          .eq('document_type', 'BRD')
          .in('status', ['Sent to Arch', 'FRD Drafted', 'FRD Completed'])
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const formatted = data?.map(doc => {
          const project = doc.projects as any;
          const client = project?.clients as any;
          
          return {
            id: doc.id,
            title: project?.project_name || 'Untitled Project',
            clientName: client?.company_name || 'Unknown Client',
            status: doc.status || 'Sent to Arch',
            dateCreated: doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            isSentToArch: true,
            frdData: null // We'll manage FRD separate documents later or update the BRD directly
          };
        }) || [];

        setArchDocs(formatted);
      } catch (err) {
        console.error('Error fetching Arch Docs', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDocs();

    const channel = supabase.channel('arch_queue_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_documents' }, fetchDocs)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { archDocs, isLoading };
}
