import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, Plus, Search, MoreHorizontal, Users, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useClients } from '../hooks/useClients';
import { supabase } from '../lib/supabase';

export function CRMList() {
  const navigate = useNavigate();
  const { clients, isLoading, refresh } = useClients();
  const [isImporting, setIsImporting] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New Lead': return <Badge variant="info">New Lead</Badge>;
      case 'Discovery':
      case 'In Discovery': return <Badge variant="warning">In Discovery</Badge>;
      case 'Needs FRD': return <Badge variant="error">Needs FRD</Badge>;
      case 'Active':
      case 'Active Project': return <Badge variant="success">Active Project</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      // Basic CSV parser
      const rows = text.split(/\r?\n/).filter(row => row.trim().length > 0);
      if (rows.length < 2) throw new Error("File is empty or missing data rows");

      // Parse headers
      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      
      const companyIdx = headers.indexOf('company_name');
      const contactIdx = headers.indexOf('contact_name');
      const emailIdx = headers.indexOf('email');
      const phoneIdx = headers.indexOf('phone');

      if (companyIdx === -1 || contactIdx === -1) {
        throw new Error("CSV highly recommended to contain 'company_name' and 'contact_name' columns. Please check headers exactly matched.");
      }

      const payload = [];
      for (let i = 1; i < rows.length; i++) {
        // regex gracefully handles commas inside quotes: "Acme, Inc", "John"
        const cols = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
        
        const companyVal = cols[companyIdx]?.trim();
        const contactVal = cols[contactIdx]?.trim();

        if (companyVal || contactVal) {
          payload.push({
            company_name: companyVal || 'Unknown Company',
            contact_name: contactVal || 'Unknown Contact',
            email: emailIdx !== -1 ? cols[emailIdx]?.trim() || null : null,
            phone: phoneIdx !== -1 ? cols[phoneIdx]?.trim() || null : null,
          });
        }
      }

      if (payload.length > 0) {
        const { error } = await supabase.from('clients').insert(payload);
        if (error) throw error;
        alert(`Successfully imported ${payload.length} clients!`);
      } else {
        alert('No valid rows found to import.');
      }
    } catch (error: any) {
      console.error("Import failed", error);
      alert(error.message || "Failed to import CSV. Please check formatting.");
    } finally {
      setIsImporting(false);
      event.target.value = ''; // format target
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-zinc-950 font-sans">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950 px-4 sm:px-8 py-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50 tracking-tight">Clients & CRM</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your discovery pipeline and active clients.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isImporting}
              title="Upload CSV"
            />
            <Button variant="outline" className="w-full gap-2 text-zinc-300 font-medium justify-center relative z-0" disabled={isImporting}>
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">{isImporting ? 'Importing...' : 'Bulk Import CSV'}</span>
              <span className="sm:hidden">{isImporting ? '...' : 'Import'}</span>
            </Button>
          </div>
          <Button variant="primary" onClick={() => navigate('/clients/new')} className="gap-2 flex-1 sm:flex-none justify-center">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Client</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-zinc-950 p-4 sm:p-8">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input className="pl-9 w-full" placeholder="Search clients..." />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={refresh} className="flex-1 sm:flex-none justify-center">
              <RefreshCw className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
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
                <th scope="col" className="px-6 py-4">Client Name</th>
                <th scope="col" className="px-6 py-4">Company</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Date Added</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-zinc-900/40">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-semibold text-xs border border-zinc-700">
                        {client.name.charAt(0)}
                      </div>
                      {client.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">{client.company}</td>
                  <td className="px-6 py-4">{getStatusBadge(client.status)}</td>
                  <td className="px-6 py-4 text-zinc-400">{client.dateAdded}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 font-medium"
                        onClick={() => navigate('/clients/' + client.id, { state: { client } })}
                      >
                        Open
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
          {clients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-12 w-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4 text-zinc-500 border border-zinc-800">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-medium text-zinc-100">No clients found</h3>
              <p className="text-sm text-zinc-400 mt-1 max-w-sm">Get started by adding a new client or importing a CSV.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
