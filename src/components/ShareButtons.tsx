"use client";

import React from "react";
import { Download, Share2 } from "lucide-react";

interface ShareButtonsProps {
  finalImageDataUrl: string | null;
}

export default function ShareButtons({ finalImageDataUrl }: ShareButtonsProps) {
  if (!finalImageDataUrl) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = finalImageDataUrl;
    link.download = `hh-goa-2026-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareToX = () => {
    const text = encodeURIComponent(
      "I'm going to Hacker House Goa 2026! Can't wait to build. 🌴🚀\n\n#FrameInGoa"
    );
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 mt-12 w-full max-w-md mx-auto">
      <button
        onClick={handleDownload}
        className="flex-1 flex items-center justify-center gap-2 bg-brand-neon text-black font-black uppercase tracking-wider py-4 px-6 brutalist-border hover:bg-brand-primary hover:text-white transition-colors w-full active:translate-y-1 active:translate-x-1"
        style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
      >
        <Download className="w-5 h-5" />
        DOWNLOAD
      </button>

      <button
        onClick={() => {
          handleDownload(); 
          setTimeout(handleShareToX, 500); 
        }}
        className="flex-1 flex items-center justify-center gap-2 bg-black text-white font-black uppercase tracking-wider py-4 px-6 brutalist-border hover:bg-brand-pink transition-colors w-full active:translate-y-1 active:translate-x-1"
        style={{ boxShadow: '4px 4px 0px 0px var(--color-brand-neon)' }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
        SHARE TO X
      </button>
    </div>
  );
}
