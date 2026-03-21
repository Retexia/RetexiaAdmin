import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

interface FormData {
  strategy: {
    primaryGoal: string;
    targetAudience: string;
    totalPages: string;
  };
  design: {
    brandAssets: string;
    lovedLink1: string;
    lovedLink2: string;
    lovedLink3: string;
    hatedLink: string;
  };
  content: {
    copyStatus: string;
    mediaStatus: string;
  };
  technical: {
    specificFeatures: string;
    futureFeatures: string;
    customAdmin: string;
    externalIntegrations: string;
  };
  logistics: {
    domainInfo: string;
    deadline: string;
    approvalContact: string;
    legalDocs: string;
    regulations: string;
  };
}

export function BRDForm({ onSubmitSuccess }: { onSubmitSuccess?: (data: FormData) => Promise<void> | void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log("BRD Form Submitted (17 Questions Template):", JSON.stringify(data, null, 2));
    if (onSubmitSuccess) await onSubmitSuccess(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      
      {/* 1. Project Strategy */}
      <section className="bg-zinc-900 p-5 sm:p-8 rounded-2xl border border-zinc-800 shadow-md shadow-black/20">
        <h2 className="text-xl font-semibold text-zinc-50 mb-6">1. Project Strategy</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              What is the primary goal of the website? <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-zinc-500 mb-3">(e.g., generating leads for a real estate business, selling products, booking appointments, or just a portfolio?)</p>
            <Textarea
              placeholder="Primary goal..."
              {...register('strategy.primaryGoal', { required: 'Primary goal is required' })}
              error={errors.strategy?.primaryGoal?.message}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Who is your target audience? How will you measure the success of this project? <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Target audience & success metrics..."
              {...register('strategy.targetAudience', { required: 'Target audience is required' })}
              error={errors.strategy?.targetAudience?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              How many total pages do you estimate needing?
            </label>
            <p className="text-xs text-zinc-500 mb-3">(e.g., Home, About, Services, Contact, Blog).</p>
            <Input placeholder="e.g., 5-7 pages" {...register('strategy.totalPages')} />
          </div>
        </div>
      </section>

      {/* 2. Design & Brand */}
      <section className="bg-zinc-900 p-5 sm:p-8 rounded-2xl border border-zinc-800 shadow-md shadow-black/20">
        <h2 className="text-xl font-semibold text-zinc-50 mb-6">2. Design & Brand</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Do you have existing brand assets?
            </label>
            <p className="text-xs text-zinc-500 mb-3">(Ask for high-resolution logos, specific color codes, and brand fonts).</p>
            <Textarea placeholder="Current brand assets status..." {...register('design.brandAssets')} />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Can you provide 3 links to websites you love?
            </label>
            <p className="text-xs text-zinc-500 mb-3">Ask them to explain exactly what they like about them (e.g., "I like the smooth scrolling on this one," or "I like the clean navigation here").</p>
            <Input placeholder="Link 1 & what you like about it" {...register('design.lovedLink1')} />
            <Input placeholder="Link 2 & what you like about it" {...register('design.lovedLink2')} />
            <Input placeholder="Link 3 & what you like about it" {...register('design.lovedLink3')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Can you provide 1 link to a website you hate?
            </label>
            <p className="text-xs text-zinc-500 mb-3">(Knowing what they want to avoid is just as important).</p>
            <Input placeholder="Link to a site you dislike..." {...register('design.hatedLink')} />
          </div>
        </div>
      </section>

      {/* 3. Content & Assets */}
      <section className="bg-zinc-900 p-5 sm:p-8 rounded-2xl border border-zinc-800 shadow-md shadow-black/20">
        <h2 className="text-xl font-semibold text-zinc-50 mb-6">3. Content & Assets</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Do you have the website copy (text) ready?
            </label>
            <p className="text-xs text-zinc-500 mb-3">If not, who is writing it, and when will it be done?</p>
            <Textarea placeholder="Copy status..." {...register('content.copyStatus')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Do you have high-quality photos and videos?
            </label>
            <p className="text-xs text-zinc-500 mb-3">Or do you need us to source stock imagery?</p>
            <Textarea placeholder="Media assets status..." {...register('content.mediaStatus')} />
          </div>
        </div>
      </section>

      {/* 4. Technical Requirements */}
      <section className="bg-zinc-900 p-5 sm:p-8 rounded-2xl border border-zinc-800 shadow-md shadow-black/20">
        <h2 className="text-xl font-semibold text-zinc-50 mb-6">4. Technical Requirements</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              What specific features must the site have?
            </label>
            <p className="text-xs text-zinc-500 mb-3">(e.g., user login portals, advanced search filters, shopping carts, contact forms, or live chat).</p>
            <Textarea placeholder="Required features..." {...register('technical.specificFeatures')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Will you need a custom admin dashboard to manage data?
            </label>
            <p className="text-xs text-zinc-500 mb-3">(e.g., an easy way for them to upload new property listings or blog posts themselves).</p>
            <Textarea placeholder="Dashboard requirements..." {...register('technical.customAdmin')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Do we need to integrate with any external tools?
            </label>
            <p className="text-xs text-zinc-500 mb-3">(e.g., Stripe for payments, Mailchimp for emails, or a CRM).</p>
            <Input placeholder="Required integrations..." {...register('technical.externalIntegrations')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Are there any features you might want to add later, even if they aren't in this initial build?
            </label>
            <p className="text-xs text-zinc-500 mb-3">(This helps you build the architecture correctly from day one so you don't have to tear it down later).</p>
            <Textarea placeholder="Phase 2 / Future features..." {...register('technical.futureFeatures')} />
          </div>
        </div>
      </section>

      {/* 5. Logistics & Legal */}
      <section className="bg-zinc-900 p-5 sm:p-8 rounded-2xl border border-zinc-800 shadow-md shadow-black/20">
        <h2 className="text-xl font-semibold text-zinc-50 mb-6">5. Logistics & Legal</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Do you already own a domain name (URL)?
            </label>
            <p className="text-xs text-zinc-500 mb-3">If yes, where is it registered?</p>
            <Input placeholder="Domain & Registrar info..." {...register('logistics.domainInfo')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Do you have a hard, non-negotiable deadline? <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-zinc-500 mb-3">If so, what is driving that date (like a product launch or an event)?</p>
            <Input 
              placeholder="Deadline date & reason..." 
              {...register('logistics.deadline', { required: 'Deadline is required' })}
              error={errors.logistics?.deadline?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Who is the single point of contact for approvals?
            </label>
            <p className="text-xs text-zinc-500 mb-3">(You only want to take feedback from one person, not their entire company).</p>
            <Input placeholder="Point of contact name/email..." {...register('logistics.approvalContact')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Will you be providing the Privacy Policy and Terms of Service, or do you need us to generate standard templates?
            </label>
            <Input placeholder="Legal documents status..." {...register('logistics.legalDocs')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Are there any specific industry regulations the site needs to comply with?
            </label>
            <p className="text-xs text-zinc-500 mb-3">(e.g., HIPAA for healthcare, or specific e-commerce data laws).</p>
            <Input placeholder="Compliance requirements..." {...register('logistics.regulations')} />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-950 py-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.2)] px-4 sm:px-8 -mx-4 sm:-mx-8 z-20">
        <Button type="button" variant="ghost">Save Draft</Button>
        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Generating...' : 'Complete BRD Generation'}
        </Button>
      </div>
    </form>
  );
}
