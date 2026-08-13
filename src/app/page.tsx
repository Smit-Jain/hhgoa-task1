"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ImageUploader from "@/components/ImageUploader";
import CanvasRenderer, { FormatType } from "@/components/CanvasRenderer";
import BuilderForm from "@/components/BuilderForm";
import ShareButtons from "@/components/ShareButtons";
import { Zap, Image as ImageIcon, CreditCard, Download, Share2, RefreshCcw } from "lucide-react";
import logoImg from "../../public/247pm-studio.png";
import sunLogoImg from "../../public/sun-logo.png";
import PaperAnimation from "@/components/PaperAnimation";

let audioCtx: AudioContext | null = null;

const playClickSound = () => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // A crisp, tiny "t" tick sound (like a modern UI pop)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.02);

    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.02);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.02);
  } catch (e) {
    console.error("Audio error:", e);
  }
};

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
  const [iBuild, setIBuild] = useState("");
  const [appState, setAppState] = useState<"editing" | "animating" | "done">("editing");

  useEffect(() => {
    setTitle(BUILDER_TITLES[Math.floor(Math.random() * BUILDER_TITLES.length)]);

    // Global click listener for button sounds
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button')) {
        playClickSound();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleReset = () => {
    setCroppedImage(null);
    setFinalImage(null);
    setAppState("editing");
  };

  return (
    <>
      {/* HERO SECTION — Full viewport, just the title over the scenic background */}
      <section className="relative min-h-screen flex flex-col items-center justify-end pb-[62px] px-4 overflow-hidden">

        {/* 2:47PM Studio Logo */}
        <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10 w-20 md:w-28 drop-shadow-md">
          <Image src={logoImg} alt="2:47PM Studio" className="w-full h-auto object-contain" />
        </div>

        {/* Scroll Down Button (Top Right) */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 z-10">
          <button
            onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-brand-neon text-black brutalist-border px-6 py-2 font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-colors brutalist-shadow active:translate-y-1 active:translate-x-1"
            style={{ boxShadow: '4px 4px 0px 0px #000' }}
          >
            CREATE
          </button>
        </div>

        {/* Text split into two sections matching the canvas 56%/44% boundary */}
        <div className="absolute inset-0 z-20 flex flex-col pointer-events-none" style={{ height: '100vh' }}>
          
          {/* Sea section (top 56%) — HACKER sits at the bottom */}
          <div className="flex items-end justify-center" style={{ height: '56%' }}>
            <h1 
              className="font-display font-semibold tracking-tight text-[#fee101] uppercase scale-x-150 inline-block pointer-events-auto"
              style={{ fontSize: 'clamp(5rem, 21vh, 15rem)', lineHeight: 1, textShadow: '4px 4px 0px #0b6839' }}
            >
              HACKER
            </h1>
          </div>

          {/* Sand section (bottom 44%) — HOUSE, boxes sit at the top */}
          <div className="flex flex-col items-center" style={{ height: '44%' }}>
            
            {/* HOUSE text */}
            <h1 
              className="font-display font-semibold tracking-tight text-[#0b6839] uppercase scale-x-150 inline-block pointer-events-auto"
              style={{ fontSize: 'clamp(5rem, 21vh, 15rem)', lineHeight: 1, textShadow: '4px 4px 0px #fee101' }}
            >
              HOUSE
            </h1>

            <p className="mt-3 text-center text-black font-bold max-w-xl mx-auto text-base md:text-lg uppercase bg-brand-pink text-white brutalist-border px-4 py-2 brutalist-shadow pointer-events-auto">
              Generate your personalized Hacker House frame or builder ID card.
            </p>

            <div className="mt-5 inline-flex items-center justify-center space-x-2 bg-brand-neon text-black brutalist-border px-4 py-1.5 font-bold brutalist-shadow uppercase tracking-widest text-sm pointer-events-auto">
              <Zap className="w-4 h-4" />
              <span>Shortlist Task</span>
            </div>
          </div>

          {/* Goa logo floating at the boundary */}
          <div className="absolute left-1/2 z-30 w-14 md:w-24" style={{ top: '56%', transform: 'translate(-50%, -50%)' }}>
            <div className="animate-slam drop-shadow-lg" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}>
              <div className="animate-float-delayed pointer-events-auto transition-all duration-300 hover:scale-125 hover:-rotate-3 cursor-pointer">
                <Image src={sunLogoImg} alt="Sun Logo" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>

        </div>

        {/* Date and Location (Bottom Right) */}
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-20 pointer-events-none text-right">
          <p className="font-mono text-[#0b6839] font-bold text-sm md:text-base tracking-[0.2em] uppercase leading-tight mb-1">
            GOA, INDIA
          </p>
          <p className="font-mono text-[#0b6839] font-bold text-sm md:text-base tracking-[0.2em] uppercase leading-tight">
            28 - 31 OCT 2026
          </p>
        </div>
      </section>

      {/* MAIN CONTENT — Below the fold, on the sand/cream area */}
      <main id="generator" className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">

        {/* Off-screen canvas to continuously generate the final image */}
        {croppedImage && (
          <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', visibility: 'hidden', pointerEvents: 'none' }}>
            <CanvasRenderer
              format={format}
              imageSrc={croppedImage}
              name={name}
              stack={stack}
              title={title}
              iBuild={iBuild}
              onRenderComplete={setFinalImage}
            />
          </div>
        )}

        {appState === "editing" && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
            {/* Format Selector */}
            <div className="w-full max-w-2xl mb-12">
              <div className="space-y-3 bg-brand-bg p-6 brutalist-border brutalist-shadow">
                <label className="text-lg font-black text-black uppercase tracking-wider block mb-4 border-b-4 border-black pb-2">
                  1. Choose Format
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormat("A")}
                    className={`p-4 brutalist-border flex flex-col items-center text-center transition-transform active:translate-y-1 active:translate-x-1 ${format === "A"
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
                    className={`p-4 brutalist-border flex flex-col items-center text-center transition-transform active:translate-y-1 active:translate-x-1 ${format === "B"
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
            </div>

            {/* Inputs & Generate */}
            <div className="w-full max-w-2xl space-y-8">
              <BuilderForm
                format={format}
                name={name}
                setName={setName}
                stack={stack}
                setStack={setStack}
                title={title}
                setTitle={setTitle}
                iBuild={iBuild}
                setIBuild={setIBuild}
              />

              <div className="bg-brand-pink p-6 brutalist-border brutalist-shadow text-white">
                <div className="flex items-center justify-between mb-4 border-b-4 border-black pb-2">
                  <label className="text-lg font-black uppercase tracking-wider block text-black">
                    {format === "B" ? "3. Upload Photo" : "2. Upload Photo"}
                  </label>
                  {croppedImage && (
                    <button
                      onClick={() => setCroppedImage(null)}
                      className="text-xs bg-black text-brand-neon px-2 py-1 brutalist-border font-bold hover:bg-brand-primary"
                    >
                      CHANGE PHOTO
                    </button>
                  )}
                </div>

                {!croppedImage ? (
                  <ImageUploader 
                    onImageCropped={setCroppedImage} 
                    aspectRatio={format === "A" ? 1 : format === "B" ? 313/376 : 16/9} 
                  />
                ) : (
                  <div className="p-4 bg-brand-bg text-black brutalist-border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={croppedImage} alt="Cropped" className="w-16 h-16 object-cover brutalist-border" />
                      <span className="text-lg font-black flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-brand-pink fill-current" /> READY!
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              {croppedImage && (
                <button
                  onClick={() => {
                    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setAppState("animating");
                  }}
                  className="w-full mt-8 bg-brand-neon text-black p-4 brutalist-border text-xl font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all brutalist-shadow active:translate-y-1 active:translate-x-1"
                  style={{ boxShadow: '4px 4px 0px 0px #000' }}
                >
                  Create Image
                </button>
              )}
            </div>
          </div>
        )}

        {appState === "animating" && finalImage && (
          <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-500">
            <PaperAnimation 
              textureUrl={finalImage} 
              aspectRatio={format === "A" ? 1 : 1536/1024}
              onAnimationComplete={() => setAppState("done")} 
            />
          </div>
        )}

        {appState === "done" && finalImage && (
          <div className="w-full max-w-2xl flex flex-col items-center animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div className="w-full bg-white p-6 brutalist-border brutalist-shadow">
              <label className="text-lg font-black text-black uppercase tracking-wider block mb-6 border-b-4 border-black pb-2 text-center">
                Your Masterpiece
              </label>
              <img src={finalImage} alt="Final" className="w-full h-auto brutalist-border brutalist-shadow" />
              
              <div className="mt-8 flex flex-col md:flex-row gap-4">
                <a
                  href={finalImage}
                  download={format === "A" ? "hhgoa-pfp.png" : "hhgoa-builder-id.png"}
                  className="flex-1 flex items-center justify-center space-x-2 bg-brand-neon text-black px-6 py-4 brutalist-border font-bold hover:bg-brand-primary hover:text-white transition-colors brutalist-shadow active:translate-y-1 active:translate-x-1"
                  style={{ boxShadow: '4px 4px 0px 0px #000' }}
                >
                  <Download className="w-5 h-5" />
                  <span>DOWNLOAD</span>
                </a>
                <button
                  onClick={() => {
                    const tweetText = encodeURIComponent("I'm heading to HH Goa 2026! 🌴 Check out my Builder ID. Join us at https://hh-goa.example.com #HHGoa #Builders");
                    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 bg-black text-white px-6 py-4 brutalist-border font-bold hover:bg-brand-pink transition-colors brutalist-shadow active:translate-y-1 active:translate-x-1"
                  style={{ boxShadow: '4px 4px 0px 0px #000' }}
                >
                  <Share2 className="w-5 h-5" />
                  <span>SHARE ON X</span>
                </button>
              </div>
              <button
                onClick={handleReset}
                className="w-full mt-4 flex items-center justify-center space-x-2 bg-brand-bg text-black px-6 py-4 brutalist-border font-bold hover:bg-black hover:text-brand-neon transition-colors brutalist-shadow active:translate-y-1 active:translate-x-1"
                style={{ boxShadow: '4px 4px 0px 0px #000' }}
              >
                <RefreshCcw className="w-5 h-5" />
                <span>CREATE ANOTHER</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
