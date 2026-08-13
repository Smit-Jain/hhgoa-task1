import React from "react";
import { FormatType } from "./CanvasRenderer";

interface BuilderFormProps {
  format: FormatType;
  name: string;
  setName: (v: string) => void;
  stack: string;
  setStack: (v: string) => void;
  github: string;
  setGithub: (v: string) => void;
  twitter: string;
  setTwitter: (v: string) => void;
}

export default function BuilderForm({
  format,
  name,
  setName,
  stack,
  setStack,
  github,
  setGithub,
  twitter,
  setTwitter
}: BuilderFormProps) {
  if (format !== "B") return null;

  return (
    <div className="bg-brand-neon p-6 brutalist-border brutalist-shadow animate-in fade-in slide-in-from-top-4 duration-300">
      <label className="text-lg font-black text-black uppercase tracking-wider block mb-4 border-b-4 border-black pb-2">
        2. Your Details
      </label>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <input
            type="text"
            placeholder="NAME (E.G. JOHN DOE)"
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            required
            className="w-full bg-brand-bg brutalist-border px-4 py-3 text-black placeholder-gray-500 font-bold focus:outline-none mb-4"
          />
        </fieldset>

        <fieldset>
          <input
            type="text"
            placeholder="ROLE (E.G. FULL STACK HACKER)"
            maxLength={30}
            value={stack}
            onChange={(e) => setStack(e.target.value.toUpperCase())}
            required
            className="w-full bg-brand-bg brutalist-border px-4 py-3 text-black placeholder-gray-500 font-bold focus:outline-none mb-4"
          />
        </fieldset>

        <fieldset className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="GITHUB HANDLE"
            maxLength={20}
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            className="w-full bg-brand-bg brutalist-border px-4 py-3 text-black placeholder-gray-500 font-bold focus:outline-none"
          />
          <input
            type="text"
            placeholder="X/TWITTER HANDLE"
            maxLength={20}
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className="w-full bg-brand-bg brutalist-border px-4 py-3 text-black placeholder-gray-500 font-bold focus:outline-none"
          />
        </fieldset>
      </form>
    </div>
  );
}
