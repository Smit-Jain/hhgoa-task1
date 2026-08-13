import React from "react";
import { FormatType } from "./CanvasRenderer";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  github: string;
  twitter: string;
}

interface TeamFormProps {
  format: FormatType;
  teamName: string;
  setTeamName: (v: string) => void;
  teamMembers: TeamMember[];
  setTeamMembers: (v: TeamMember[]) => void;
}

export default function TeamForm({
  format,
  teamName,
  setTeamName,
  teamMembers,
  setTeamMembers,
}: TeamFormProps) {
  if (format !== "C") return null;

  const handleAddMember = () => {
    if (teamMembers.length >= 3) return;
    setTeamMembers([
      ...teamMembers,
      {
        id: crypto.randomUUID(),
        name: "",
        role: "",
        github: "",
        twitter: "",
      },
    ]);
  };

  const handleRemoveMember = (idToRemove: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== idToRemove));
  };

  const handleUpdateMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(
      teamMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  return (
    <div className="bg-brand-neon p-6 brutalist-border brutalist-shadow animate-in fade-in slide-in-from-top-4 duration-300">
      <label className="text-lg font-black text-black uppercase tracking-wider block mb-4 border-b-4 border-black pb-2">
        2. Team Details
      </label>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <input
            type="text"
            placeholder="TEAM / PROJECT NAME"
            maxLength={30}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value.toUpperCase())}
            required
            className="w-full bg-brand-bg brutalist-border px-4 py-3 text-black placeholder-gray-500 font-bold focus:outline-none mb-4"
          />
        </fieldset>

        <div className="space-y-6">
          {teamMembers.map((member, index) => (
            <div key={member.id} className="p-4 bg-brand-bg brutalist-border relative">
              <div className="flex justify-between items-center mb-3 border-b-2 border-black pb-2">
                <span className="font-bold uppercase tracking-wider text-sm">
                  Member {index + 1}
                </span>
                {teamMembers.length > 1 && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-xs bg-brand-pink text-white px-2 py-1 brutalist-border font-bold hover:bg-black transition-colors"
                  >
                    REMOVE
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="NAME (E.G. JANE DOE)"
                  maxLength={20}
                  value={member.name}
                  onChange={(e) => handleUpdateMember(member.id, "name", e.target.value.toUpperCase())}
                  required
                  className="w-full bg-white brutalist-border px-3 py-2 text-black placeholder-gray-500 font-bold focus:outline-none text-sm"
                />
                <input
                  type="text"
                  placeholder="ROLE (E.G. FRONTEND)"
                  maxLength={30}
                  value={member.role}
                  onChange={(e) => handleUpdateMember(member.id, "role", e.target.value.toUpperCase())}
                  required
                  className="w-full bg-white brutalist-border px-3 py-2 text-black placeholder-gray-500 font-bold focus:outline-none text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="GITHUB"
                    maxLength={20}
                    value={member.github}
                    onChange={(e) => handleUpdateMember(member.id, "github", e.target.value)}
                    className="w-full bg-white brutalist-border px-3 py-2 text-black placeholder-gray-500 font-bold focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="X/TWITTER"
                    maxLength={20}
                    value={member.twitter}
                    onChange={(e) => handleUpdateMember(member.id, "twitter", e.target.value)}
                    className="w-full bg-white brutalist-border px-3 py-2 text-black placeholder-gray-500 font-bold focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {teamMembers.length < 3 && (
          <button
            onClick={handleAddMember}
            className="w-full bg-black text-brand-neon brutalist-border px-4 py-3 font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-colors brutalist-shadow"
            style={{ boxShadow: '4px 4px 0px 0px #0b6839' }}
          >
            + ADD MEMBER (MAX 3)
          </button>
        )}
      </form>
    </div>
  );
}
