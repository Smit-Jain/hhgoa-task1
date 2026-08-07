"use client";

import React, { useState, useEffect } from "react";
import ImageUploader from "@/components/ImageUploader";
import CanvasRenderer, { FormatType } from "@/components/CanvasRenderer";
import ShareButtons from "@/components/ShareButtons";
import { Zap, Image as ImageIcon, CreditCard } from "lucide-react";

const BUILDER_TITLES = [
  "10X ENGINEER",
  "SHITPOSTER",
  "VIBE CODER",
  "DEGEN BUILDER",
  "FULL STACK HACKER",
  "AI MAXIMALIST",
  "DESIGN ENGINEER",
  "BASED DEV"
];

export default function Home() {
  const [format, setFormat] = useState<FormatType>("A");
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  
  // Format B State
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(BUILDER_TITLES[Math.floor(Math.random() * BUILDER_TITLES.length)]);
  }, []);

  const handleReset = () => {
    setCroppedImage(null);
    setFinalImage(null);
  };

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center my-8 md:my-12">
        <div className="inline-flex items-center justify-center space-x-2 bg-brand-neon text-black brutalist-border px-4 py-1.5 font-bold mb-6 brutalist-shadow uppercase tracking-widest text-sm">
          <Zap className="w-4 h-4" />
          <span>Shortlisting Task</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tight mb-4 text-brand-primary text-shadow-neon uppercase">
          HH GOA 2026
        </h1>
        <p className="text-black font-bold max-w-xl mx-auto text-lg uppercase bg-brand-pink text-white brutalist-border px-4 py-2 brutalist-shadow">
          Generate your personalized Hacker House frame or builder ID card.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
        
        {/* Left Column: Controls & Input */}
        <div className="lg:col-span-5 space-y-8 w-full max-w-md mx-auto lg:mx-0">
          
          {/* Format Selector */}
          <div className="space-y-3 bg-white p-6 brutalist-border brutalist-shadow">
            <label className="text-lg font-black text-black uppercase tracking-wider block mb-4 border-b-4 border-black pb-2">
              1. Choose Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFormat("A")}
                className={`p-4 brutalist-border flex flex-col items-center text-center transition-transform active:translate-y-1 active:translate-x-1 ${
                  format === "A" 
                  ? "bg-brand-primary text-white brutalist-shadow-neon" 
                  : "bg-brand-bg text-black hover:bg-brand-neon"
                }`}
                style={{ boxShadow: format === "A" ? '6px 6px 0px 0px #fee101' : '4px 4px 0px 0px #000' }}
              >
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="font-bold">PFP Frame</span>
              </button>
              
              <button
                onClick={() => setFormat("B")}
                className={`p-4 brutalist-border flex flex-col items-center text-center transition-transform active:translate-y-1 active:translate-x-1 ${
                  format === "B" 
                  ? "bg-brand-primary text-white brutalist-shadow-neon" 
                  : "bg-brand-bg text-black hover:bg-brand-neon"
                }`}
                style={{ boxShadow: format === "B" ? '6px 6px 0px 0px #fee101' : '4px 4px 0px 0px #000' }}
              >
                <CreditCard className="w-8 h-8 mb-2" />
                <span className="font-bold">Builder ID</span>
              </button>
            </div>
          </div>

          {/* Form Inputs (Only for Format B) */}
          {format === "B" && (
            <div className="bg-brand-neon p-6 brutalist-border brutalist-shadow animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="text-lg font-black text-black uppercase tracking-wider block mb-4 border-b-4 border-black pb-2">
                2. Your Details
              </label>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="NAME (E.G. JOHN DOE)"
                    maxLength={20}
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    className="w-full bg-white brutalist-border px-4 py-3 text-black placeholder-gray-500 font-bold focus:outline-none focus:bg-brand-bg"
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    placeholder="ROLE (E.G. FULL STACK HACKER)"
                    maxLength={30}
                    value={stack}
                    onChange={(e) => setStack(e.target.value.toUpperCase())}
                    className="w-full bg-white brutalist-border px-4 py-3 text-black placeholder-gray-500 font-bold focus:outline-none focus:bg-brand-bg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Upload Section */}
          <div className="bg-brand-pink p-6 brutalist-border brutalist-shadow text-white">
            <div className="flex items-center justify-between mb-4 border-b-4 border-black pb-2">
              <label className="text-lg font-black uppercase tracking-wider block text-black">
                {format === "B" ? "3. Upload Photo" : "2. Upload Photo"}
              </label>
              {croppedImage && (
                <button 
                  onClick={handleReset}
                  className="text-xs bg-black text-brand-neon px-2 py-1 brutalist-border font-bold hover:bg-brand-primary"
                >
                  CHANGE PHOTO
                </button>
              )}
            </div>
            
            {!croppedImage ? (
              <ImageUploader onImageCropped={setCroppedImage} />
            ) : (
              <div className="p-4 bg-white text-black brutalist-border flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={croppedImage} alt="Cropped" className="w-16 h-16 object-cover brutalist-border" />
                  <span className="text-lg font-black flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-brand-pink fill-current" /> READY!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Preview & Output */}
        <div className="lg:col-span-7 w-full flex flex-col items-center">
          <div className="bg-white p-6 brutalist-border brutalist-shadow w-full">
            <label className="text-lg font-black text-black uppercase tracking-wider block mb-6 border-b-4 border-black pb-2 text-center lg:text-left">
              Live Preview
            </label>
            
            <div className="w-full flex flex-col items-center">
              {croppedImage ? (
                <>
                  <CanvasRenderer 
                    format={format}
                    imageSrc={croppedImage}
                    name={name}
                    stack={stack}
                    title={title}
                    onRenderComplete={setFinalImage}
                  />
                  <ShareButtons finalImageDataUrl={finalImage} />
                </>
              ) : (
                <div className="w-full max-w-sm aspect-[4/5] bg-brand-bg brutalist-border flex flex-col items-center justify-center text-black p-8 text-center" style={{ boxShadow: 'inset 4px 4px 0px 0px rgba(0,0,0,0.1)' }}>
                  <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                  <p className="font-bold text-xl uppercase">AWAITING UPLOAD...</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </main>
  );
}
