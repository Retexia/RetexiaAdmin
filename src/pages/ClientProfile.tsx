import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Calendar, FileText, Sparkles, Mail, Phone, Edit2, Save, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BRDForm } from '../components/forms/BRDForm';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function ClientProfile() {
  const [showForm, setShowForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const client = location.state?.client;

  const [clientData, setClientData] = useState<any>(client?.raw || {});
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    what_happend: client?.raw?.what_happend || '',
    Available_time: client?.raw?.Available_time || ''
  });

  useEffect(() => {
    async function loadFreshClient() {
      if (!client?.id) return;
      const { data } = await supabase.from('clients').select('*').eq('id', client.id).single();
      if (data) {
        setClientData(data);
        setFormData({
          what_happend: data.what_happend || '',
          Available_time: data.Available_time || ''
        });
      }
    }

    if (!client) {
      navigate('/crm', { replace: true });
    } else {
      setClientData(client.raw);
      setFormData({
        what_happend: client.raw.what_happend || '',
        Available_time: client.raw.Available_time || ''
      });
      loadFreshClient();
    }
  }, [client, navigate]);

  if (!client) return null;

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({
          what_happend: formData.what_happend,
          Available_time: formData.Available_time || null
        })
        .eq('id', client.id)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Update blocked by Database permissions. Please add an UPDATE policy for the 'clients' table in your Supabase Auth settings!");
      }
      
      setClientData(data[0]);
      setFormData({
        what_happend: data[0].what_happend || '',
        Available_time: data[0].Available_time || ''
      });
      setIsEditingNotes(false);
    } catch (err: any) {
      console.error('Failed to update notes:', err);
      alert('Failed to update client notes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBrdSubmit = async (data: any) => {
    setIsGenerating(true);
    try {
      // 1. Create a Project for this client
      const { data: projectRow, error: projectError } = await supabase
        .from('projects')
        .insert({
          client_id: client.id,
          project_name: `${client.company} Project`,
          current_stage: 'Discovery'
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // 2. Create the BRD Document linked to this project
      const { error: docError } = await supabase
        .from('project_documents')
        .insert({
          project_id: projectRow.id,
          document_type: 'BRD',
          content: data,
          status: 'Drafted',
          created_by: user?.id
        });

      if (docError) throw docError;

      // 3. Post to n8n webhook
      const webhookPayload = {
        client_name: clientData.name || clientData.contact_name || 'Unknown Contact',
        company_name: clientData.company || clientData.company_name || 'Unknown Company',
        email: clientData.email || null,
        phone: clientData.phone || null,
        project_id: projectRow.id,
        project_name: projectRow.project_name,
        ...data
      };

      try {
        await fetch('https://n8n.isurulakshan.dev/webhook/BRD', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        });
      } catch (webhookErr) {
        console.warn('Failed to dispatch webhook to n8n:', webhookErr);
      }

      alert('BRD generated successfully! Saved to database.');
      navigate('/brd');
    } catch (err: any) {
      console.error('Error generating BRD:', err);
      alert('Failed to generate BRD. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full flex-col relative overflow-hidden bg-zinc-950">
      <header className="flex-shrink-0 border-b border-zinc-800 bg-zinc-950 px-4 sm:px-8 py-6 z-10 transition-all">
        <div className="mb-4">
          <button 
            onClick={() => navigate('/crm')}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg shadow-indigo-900/50 border-2 sm:border-4 border-zinc-900">
              {client.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight">{client.name}</h1>
                <Badge variant="warning">{client.status}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400 font-medium">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Building2 className="h-4 w-4" />
                  {client.company}
                </div>
                <span className="hidden sm:inline">&bull;</span>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Calendar className="h-4 w-4" />
                  Added {client.dateAdded}
                </div>
                {clientData.email && (
                  <>
                    <span className="hidden sm:inline">&bull;</span>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Mail className="h-4 w-4" />
                      {clientData.email}
                    </div>
                  </>
                )}
                {clientData.phone && (
                  <>
                    <span className="hidden sm:inline">&bull;</span>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Phone className="h-4 w-4" />
                      {clientData.phone}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {!showForm && (
            <Button 
              size="lg" 
              className="gap-2 bg-zinc-100 text-zinc-900 hover:bg-white shadow-md shadow-black/20 transform hover:-translate-y-0.5 transition-all w-full md:w-auto text-base font-semibold px-8"
              onClick={() => setShowForm(true)}
            >
              <Sparkles className="h-5 w-5 text-indigo-600 shrink-0" />
              Start Discovery (Generate BRD)
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-zinc-950 relative p-4 sm:p-8">
        {!showForm ? (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in pb-12">
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-400" />
                  Client Notes & Availability
                </h3>
                {!isEditingNotes ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(true)} className="gap-2">
                    <Edit2 className="h-4 w-4" /> Edit Details
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                       setIsEditingNotes(false);
                       setFormData({ what_happend: clientData.what_happend || '', Available_time: clientData.Available_time || '' });
                    }} disabled={isSaving}>
                       <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSaveNotes} disabled={isSaving}>
                       <Save className="h-4 w-4 mr-1" /> {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">What happened there</label>
                  {!isEditingNotes ? (
                    <div className="text-zinc-300 whitespace-pre-wrap bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/80 min-h-[80px]">
                      {clientData.what_happend || 'No notes added yet.'}
                    </div>
                  ) : (
                    <textarea 
                      value={formData.what_happend}
                      onChange={(e) => setFormData(f => ({ ...f, what_happend: e.target.value }))}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[120px]"
                      placeholder="Enter details about the client interaction..."
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Available Time</label>
                  {!isEditingNotes ? (
                    <div className="text-zinc-300 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/80 w-full md:w-1/2">
                      {clientData.Available_time ? new Date(clientData.Available_time).toLocaleString() : 'Not scheduled'}
                    </div>
                  ) : (
                    <input 
                      type="datetime-local" 
                      value={formData.Available_time}
                      onChange={(e) => setFormData(f => ({ ...f, Available_time: e.target.value }))}
                      className="w-full md:w-1/2 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="h-16 w-16 mb-6 rounded-full bg-indigo-500/10 flex items-center justify-center animate-pulse border border-indigo-500/20">
                <Sparkles className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-50 mb-2 tracking-tight">Ready to begin discovery?</h3>
              <p className="text-zinc-400 leading-relaxed mb-8 max-w-lg mx-auto">
                Generate a comprehensive Business Requirements Document (BRD) by completing our structured intake questionnaire.
              </p>
              <Button size="lg" className="shadow-lg shadow-indigo-900/30" onClick={() => setShowForm(true)}>
                Begin Questionnaire
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 pb-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-zinc-50 tracking-tight">Client Intake Questionnaire</h2>
              <p className="text-zinc-400 mt-1">Please fill in all requirements to generate the final Business Requirements Document.</p>
            </div>
            <BRDForm onSubmitSuccess={handleBrdSubmit}/>
          </div>
        )}
      </div>
    </div>
  );
}
