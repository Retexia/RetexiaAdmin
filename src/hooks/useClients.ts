import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          projects (
            id,
            project_name,
            current_stage,
            created_at
          )
        `);

      if (error) throw error;
      
      const formattedClients = data?.map(client => {
        const activeProject = client.projects && client.projects.length > 0 
          ? client.projects[0] 
          : null;
        
        return {
          id: client.id,
          name: client.contact_name || 'Unknown Contact',
          company: client.company_name || 'Unknown Company',
          status: activeProject?.current_stage || 'New Lead',
          dateAdded: activeProject?.created_at 
            ? new Date(activeProject.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
            : 'N/A',
          raw: client 
        };
      }) || [];

      setClients(formattedClients);
    } catch (error) {
      console.error('Error fetching CRM clients:', error);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(true);
    
    const channel = supabase.channel('crm_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => fetchClients())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => fetchClients())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { clients, isLoading, refresh: () => fetchClients(true) };
}
