"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ImageUploader from "@/components/ImageUploader";
import CanvasRenderer, { FormatType } from "@/components/CanvasRenderer";
import BuilderForm from "@/components/BuilderForm";
import TeamForm from "@/components/TeamForm";
import { TeamMember } from "@/components/CanvasRenderer";
import ShareButtons from "@/components/ShareButtons";
import { Zap, Image as ImageIcon, CreditCard, Users } from "lucide-react";
import logoImg from "../../public/247pm-studio.png";
import sunLogoImg from "../../public/sun-logo.png";

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
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [title, setTitle] = useState("");

  // Format C (Team ID) State
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

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

        <div className="text-center flex flex-col items-center relative z-20 translate-y-[52px] md:translate-y-[68px]">
          
          <div className="relative inline-flex flex-col items-center leading-none mt-8 md:mt-12 mb-2 translate-y-[10px]">
             <h1 className="text-6xl md:text-8xl lg:text-[9.5rem] font-display font-semibold tracking-tight text-[#fee101] uppercase scale-x-150 inline-block" style={{ textShadow: "4px 4px 0px #0b6839" }}>
               HACKER
             </h1>
             
             {/* The image overlapping between HACKER and HOUSE */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-[5px] z-30 w-14 md:w-24 pointer-events-none">
                <div className="animate-slam drop-shadow-lg" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}>
                   <div className="animate-float-delayed pointer-events-auto transition-all duration-300 hover:scale-125 hover:-rotate-3 cursor-pointer">
                      <Image src={sunLogoImg} alt="Sun Logo" className="w-full h-auto object-contain" />
                   </div>
                </div>
             </div>

             <h1 className="text-6xl md:text-8xl lg:text-[9.5rem] font-display font-semibold tracking-tight text-[#0b6839] uppercase scale-x-150 inline-block" style={{ textShadow: "4px 4px 0px #fee101" }}>
               HOUSE
             </h1>
          </div>

          <p className="mt-2 text-black font-bold max-w-xl mx-auto text-base md:text-lg uppercase bg-brand-pink text-white brutalist-border px-4 py-2 brutalist-shadow relative z-20">
            Generate your personalized Hacker House frame or builder ID card.
          </p>

          <div className="mt-5 inline-flex items-center justify-center space-x-2 bg-brand-neon text-black brutalist-border px-4 py-1.5 font-bold brutalist-shadow uppercase tracking-widest text-sm relative z-20 mb-8">
            <Zap className="w-4 h-4" />
            <span>Shortlist Task</span>
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

        {/* Format Selector */}
        <div className="w-full max-w-2xl mb-12">
          <div className="space-y-3 bg-brand-bg p-6 brutalist-border brutalist-shadow">
            <label className="text-lg font-black text-black uppercase tracking-wider block mb-4 border-b-4 border-black pb-2">
              1. Choose Format
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <button
                onClick={() => setFormat("C")}
                className={`p-4 brutalist-border flex flex-col items-center text-center transition-transform active:translate-y-1 active:translate-x-1 ${format === "C"
                  ? "bg-brand-primary text-white brutalist-shadow-neon"
                  : "bg-brand-bg text-black hover:bg-brand-neon"
                  }`}
                style={{ boxShadow: format === "C" ? '6px 6px 0px 0px #fee101' : '4px 4px 0px 0px #000' }}
              >
                <Users className="w-8 h-8 mb-2" />
                <span className="font-bold">Team ID</span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-8 w-full max-w-md mx-auto lg:mx-0">

            <BuilderForm
              format={format}
              name={name}
              setName={setName}
              stack={stack}
              setStack={setStack}
              github={github}
              setGithub={setGithub}
              twitter={twitter}
              setTwitter={setTwitter}
            />

            <TeamForm
              format={format}
              teamName={teamName}
              setTeamName={setTeamName}
              teamMembers={teamMembers}
              setTeamMembers={setTeamMembers}
            />

            {/* Upload Section */}
            <div className="bg-brand-pink p-6 brutalist-border brutalist-shadow text-white">
              <div className="flex items-center justify-between mb-4 border-b-4 border-black pb-2">
                <label className="text-lg font-black uppercase tracking-wider block text-black">
                  {format === "B" ? "3. Upload Photo" : format === "C" ? "3. Upload Team Photo" : "2. Upload Photo"}
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
                      github={github}
                      twitter={twitter}
                      teamName={teamName}
                      teamMembers={teamMembers}
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
    </>
  );
}
