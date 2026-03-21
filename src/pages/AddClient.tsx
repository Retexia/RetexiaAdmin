import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Building2, User, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabase';

export function AddClient() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name || !formData.contact_name) {
      alert('Company Name and Contact Name are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('clients').insert([{
        company_name: formData.company_name,
        contact_name: formData.contact_name,
        email: formData.email || null,
        phone: formData.phone || null
      }]);

      if (error) throw error;

      alert('Client added successfully!');
      navigate('/crm');
    } catch (error: any) {
      console.error('Failed to add client:', error);
      alert(error.message || 'Failed to add client to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-zinc-950 font-sans overflow-auto custom-scrollbar">
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
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight">Add New Client</h1>
          <p className="text-sm text-zinc-400 mt-2">Manually register a new lead into your CRM pipeline.</p>
        </div>
      </header>

      <div className="flex-1 p-4 sm:p-8 max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-400" />
                Company Name <span className="text-red-500">*</span>
              </label>
              <Input 
                value={formData.company_name}
                onChange={(e) => setFormData(f => ({ ...f, company_name: e.target.value }))}
                placeholder="e.g. Acme Corporation"
                required
                className="bg-zinc-950 border-zinc-800 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-400" />
                Primary Contact Name <span className="text-red-500">*</span>
              </label>
              <Input 
                value={formData.contact_name}
                onChange={(e) => setFormData(f => ({ ...f, contact_name: e.target.value }))}
                placeholder="e.g. Jane Doe"
                required
                className="bg-zinc-950 border-zinc-800 focus:border-indigo-500"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-indigo-400" />
                  Email Address
                </label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                  placeholder="jane@acmecorp.com"
                  className="bg-zinc-950 border-zinc-800 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-indigo-400" />
                  Phone Number
                </label>
                <Input 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                  className="bg-zinc-950 border-zinc-800 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate('/crm')} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="gap-2 px-6" disabled={isSubmitting}>
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Client'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
