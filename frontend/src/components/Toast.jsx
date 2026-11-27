import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Sparkles, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast.visible) return null;

  return (
    <div className="fixed top-20 right-6 z-50 max-w-sm w-full transition-all duration-300 transform translate-y-0 opacity-100">
      <div className="bg-white/95 backdrop-blur-md border border-[#C8A2E8] shadow-lg shadow-[#9B72CF]/15 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#F3ECFA] text-[#7041A6] flex items-center justify-center shrink-0">
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-500" />
          ) : (
            <Sparkles className="w-5 h-5 text-[#9B72CF]" />
          )}
        </div>
        <div className="flex-1 pr-2">
          <p className="text-sm font-medium text-[#40334F] leading-snug">
            {toast.message}
          </p>
        </div>
      </div>
    </div>
  );
}
