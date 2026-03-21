import React from 'react';
import { Video } from 'lucide-react';

export function MeetingNotes() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-10 font-sans text-center h-full">
      <div className="h-16 w-16 mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
        <Video className="h-8 w-8 text-emerald-400" />
      </div>
      <h2 className="text-2xl font-bold text-zinc-50 tracking-tight mb-2">Meeting Notes</h2>
      <p className="text-zinc-400 max-w-md">Access AI-generated transcripts, summaries, and action items from client discovery sessions here.</p>
    </div>
  );
}
