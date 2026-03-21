import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useDashboardData() {
  const [data, setData] = useState({
    leadsCount: 0,
    totalClients: 0,
    inDiscoveryCount: 0,
    revenue: 0,
    recentActivity: [] as any[],
    isLoading: true
  });

  useEffect(() => {
    async function fetchDashboardMetrics() {
      try {
        // 1. Fetch total clients
        const { count: clientCount } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true });

        // 2. Fetch projects in discovery
        const { count: discoveryCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('current_stage', 'Discovery');

        // 3. Fetch leads count (mocked aggregation of lead tables for simplicity, since we only have types for web_leads in DB)
        // Since we don't have the exact schema for leads, we will default to 0 and fail gracefully
        let leadsCount = 0;
        try {
          const { count } = await supabase.from('web_leads').select('*', { count: 'exact', head: true });
          leadsCount += count || 0;
        } catch (e) { /* ignore if table missing */ }

        // 4. Fetch revenue (sum of team_payments)
        const { data: payments } = await supabase
          .from('team_payments')
          .select('amount');
        const revenue = payments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;

        // 5. Fetch recent project documents for activity feed
        const { data: docs } = await supabase
          .from('project_documents')
          .select(`
            id,
            document_type,
            status,
            created_at,
            projects ( project_name )
          `)
          .order('created_at', { ascending: false })
          .limit(4);

        setData({
          leadsCount,
          totalClients: clientCount || 0,
          inDiscoveryCount: discoveryCount || 0,
          revenue: revenue,
          recentActivity: docs || [],
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        setData(prev => ({ ...prev, isLoading: false }));
      }
    }

    fetchDashboardMetrics();
    
    // Set up realtime channel for dashboard
    const channel = supabase.channel('dashboard_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, fetchDashboardMetrics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchDashboardMetrics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_documents' }, fetchDashboardMetrics)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return data;
}
