import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Network, Box, Database, Shield, Link2, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../lib/supabase';

interface FRDFormData {
  lucidchartUrl: string;
  businessRules: string;
  databaseSchema: string;
  apiEndpoints: string;
}

export function FRDBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FRDFormData>({
    defaultValues: {
      lucidchartUrl: '',
      businessRules: '',
      databaseSchema: '',
      apiEndpoints: ''
    }
  });

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
        
        if (data?.content?.frd) {
          reset(data.content.frd);
        }
      } catch (err) {
        console.error('Failed to load doc for FRD', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDoc();
  }, [id, reset]);

  if (isLoading) {
    return (
      <div className="flex bg-zinc-950 h-full w-full flex-col font-sans items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-950 font-sans flex-col gap-4 text-center">
        <h2 className="text-xl font-bold text-zinc-100">Document Not Found</h2>
        <Button onClick={() => navigate('/arch-queue')}>Back to Queue</Button>
      </div>
    );
  }

  const project = doc.projects as any;
  const clientName = project?.clients?.company_name || 'Unknown Client';
  const title = project?.project_name || 'Document';

  const onSubmit = async (data: FRDFormData) => {
    if (!id) return;
    try {
      const updatedContent = {
        ...doc.content,
        frd: data
      };

      const { error } = await supabase
        .from('project_documents')
        .update({
          content: updatedContent,
          status: 'FRD Completed'
        })
        .eq('id', id);

      if (error) throw error;
      
      alert('FRD generation saved successfully!');
      navigate('/arch-queue');
    } catch (err) {
      console.error('Failed to save FRD:', err);
      alert('Failed to save functional requirements. Please try again.');
    }
  };

  return (
    <div className="flex h-full flex-col font-sans bg-zinc-950 relative">
      <header className="flex-shrink-0 border-b border-zinc-800 bg-[#1c1c1f] px-4 sm:px-8 py-5 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={() => navigate('/arch-queue')}
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Badge variant="info">Functional Spec</Badge>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest hidden sm:inline">{doc.clientName}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-zinc-50">{doc.title} (FRD)</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-zinc-950 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-zinc-50 tracking-tight mb-2">Functional Requirements Document</h2>
            <p className="text-zinc-400 text-lg">Translate the Business Requirements into Concrete Technical Specs.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative">
            
            {/* User Flow / Lucidchart */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
              <div className="border-b border-zinc-800 bg-zinc-900/50 p-5 px-6 flex items-center gap-3">
                <Network className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-zinc-100">User Flow Diagrams</h3>
              </div>
              <div className="p-6">
                <label className="block text-sm font-semibold text-zinc-300 mb-2">
                  Lucidchart / Figma Prototype URL 
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input 
                    type="url" 
                    placeholder="https://lucid.app/lucidchart/..." 
                    className="pl-10 w-full"
                    {...register("lucidchartUrl")}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">Paste the absolute URL to your verified user flow diagram. Must be accessible to developers.</p>
              </div>
            </div>

            {/* Business Rules Logic */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
              <div className="border-b border-zinc-800 bg-zinc-900/50 p-5 px-6 flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-zinc-100">Business Rules & Logic</h3>
              </div>
              <div className="p-6">
                <label className="block text-sm font-semibold text-zinc-300 mb-2">
                  Core Application Rules
                </label>
                <Textarea 
                  placeholder="e.g. 1. Users must verify email before uploading listings. 2. Payments utilize Stripe Connect custom flows..." 
                  className="w-full min-h-[150px]"
                  {...register("businessRules", { required: true })}
                />
              </div>
            </div>

            {/* Database & Schema Overviews */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
              <div className="border-b border-zinc-800 bg-zinc-900/50 p-5 px-6 flex items-center gap-3">
                <Database className="h-5 w-5 text-orange-400" />
                <h3 className="text-lg font-bold text-zinc-100">Database Schema (High-level)</h3>
              </div>
              <div className="p-6">
                <label className="block text-sm font-semibold text-zinc-300 mb-2">
                  Entities and Relationships
                </label>
                <Textarea 
                  placeholder="List major models (e.g. User, Property, Transaction) and their key constraints mapping back to the BRD requirements." 
                  className="w-full min-h-[150px]"
                  {...register("databaseSchema")}
                />
              </div>
            </div>

            {/* API Endpoints */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
              <div className="border-b border-zinc-800 bg-zinc-900/50 p-5 px-6 flex items-center gap-3">
                <Box className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-bold text-zinc-100">API Documentation Map</h3>
              </div>
              <div className="p-6">
                <label className="block text-sm font-semibold text-zinc-300 mb-2">
                  Required Integration Endpoints
                </label>
                <Textarea 
                  placeholder="Detail any necessary third-party API configurations or specific internal REST/GraphQL signatures required." 
                  className="w-full min-h-[150px]"
                  {...register("apiEndpoints")}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-950 py-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.2)] px-4 sm:px-8 -mx-4 sm:-mx-8 z-20 mt-8">
              <Button type="button" variant="outline" onClick={() => navigate('/arch-queue')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="gap-2 px-8" disabled={isSubmitting}>
                <CheckCircle2 className="h-5 w-5" />
                {isSubmitting ? 'Saving...' : 'Save & Complete FRD'}
              </Button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
