import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useBRDs() {
  const [brds, setBrds] = useState<any[]>([]);
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
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const formatted = data?.map(doc => {
          const project = doc.projects as any;
          const client = project?.clients as any;
          
          return {
            id: doc.id,
            title: project?.project_name || 'Untitled Document',
            clientName: client?.company_name || 'Unknown Client',
            status: doc.status || 'Draft',
            dateCreated: doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            answers: doc.content
          };
        }) || [];

        setBrds(formatted);
      } catch (err) {
        console.error('Error fetching BRDs', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDocs();

    const channel = supabase.channel('brd_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_documents' }, fetchDocs)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { brds, isLoading };
}
