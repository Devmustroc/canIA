'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Plus, 
  Instagram, 
  Presentation, 
  Image as ImageIcon, 
  Film, 
  Wand2, 
  LayoutGrid,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useRouter } from "next/navigation";
import CustomSizeModal from "@/app/(dashboard)/_components/custom-size-modal";

const PRESETS = [
  {
    id: "custom",
    label: "Custom size",
    subLabel: "Set dimensions",
    icon: Plus,
    color: "bg-white/20 text-white hover:bg-white/30",
    isCustomModal: true,
  },
  {
    id: "instagram",
    label: "Instagram Post",
    subLabel: "1080 x 1080 px",
    icon: Instagram,
    width: 1080,
    height: 1080,
    color: "bg-pink-500/20 text-white border-pink-300/30 hover:bg-pink-500/30",
  },
  {
    id: "presentation",
    label: "Presentation",
    subLabel: "1920 x 1080 px",
    icon: Presentation,
    width: 1920,
    height: 1080,
    color: "bg-amber-500/20 text-white border-amber-300/30 hover:bg-amber-500/30",
  },
  {
    id: "logo",
    label: "Logo",
    subLabel: "500 x 500 px",
    icon: LayoutGrid,
    width: 500,
    height: 500,
    color: "bg-blue-500/20 text-white border-blue-300/30 hover:bg-blue-500/30",
  },
  {
    id: "story",
    label: "Story / Reel",
    subLabel: "1080 x 1920 px",
    icon: Film,
    width: 1080,
    height: 1920,
    color: "bg-purple-500/20 text-white border-purple-300/30 hover:bg-purple-500/30",
  },
  {
    id: "doc",
    label: "Doc A4",
    subLabel: "1200 x 1600 px",
    icon: FileText,
    width: 1200,
    height: 1600,
    color: "bg-emerald-500/20 text-white border-emerald-300/30 hover:bg-emerald-500/30",
  },
];

import { useAuth } from "@clerk/nextjs";

export const Banner = () => {
  const { userId } = useAuth();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mutation = useCreateProject();
  const router = useRouter();

  const handleOpenCustomModal = () => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    setIsCustomModalOpen(true);
  };

  const handleCreatePreset = (width: number, height: number, label: string) => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    mutation.mutate(
      {
        name: label,
        json: "",
        width,
        height,
      },
      {
        onSuccess: ({ data }: any) => {
          router.push(`/editor/${data.id}`);
        },
      }
    );
  };

  return (
    <>
      <CustomSizeModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
      />

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#00C4CC] via-[#7D2AE8] to-[#6425FE] p-8 md:p-12 text-white shadow-2xl shadow-purple-950/10">
        {/* Decorative background glow circles */}
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-violet-600/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-x-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide">
            <Sparkles className="size-3.5 text-amber-300 fill-amber-300 animate-pulse" />
            <span>Magic Design Workspace</span>
          </div>

          {/* Canva Headline */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Que voulez-vous concevoir aujourd'hui ?
          </h1>
          <p className="text-sm md:text-base text-white/80 max-w-xl">
            Créez des visuels professionnels, des présentations et des posts pour les réseaux sociaux en un instant avec l'IA.
          </p>

          {/* Search bar inside hero */}
          <div className="relative w-full max-w-2xl my-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 size-5 text-slate-400 pointer-events-none" />
              <Input
                id="dashboard-search"
                type="text"
                aria-label="Rechercher des modèles, des formats ou vos projets"
                placeholder="Rechercher des modèles, des formats ou vos projets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-13 pl-12 pr-28 rounded-2xl bg-white text-slate-900 placeholder:text-slate-500 text-sm md:text-base border-0 shadow-lg focus-visible:ring-2 focus-visible:ring-cyan-300"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleOpenCustomModal}
                aria-label="Ouvrir le créateur de dimensions personnalisées"
                className="absolute right-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium shadow"
              >
                <Wand2 className="size-4 mr-1.5" />
                Créer
              </Button>
            </div>
          </div>

          {/* Canva Presets Carousel/Grid */}
          <div className="w-full pt-4">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {PRESETS.map((preset) => {
                const IconComponent = preset.icon;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-label={`Créer un design format ${preset.label} (${preset.subLabel})`}
                    disabled={mutation.isPending}
                    onClick={() => {
                      if (preset.isCustomModal) {
                        handleOpenCustomModal();
                      } else if (preset.width && preset.height) {
                        handleCreatePreset(preset.width, preset.height, preset.label);
                      }
                    }}
                    className={`group relative flex flex-col items-center justify-center p-3.5 min-w-[110px] md:min-w-[128px] rounded-2xl border backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${preset.color}`}
                  >
                    <div className="size-11 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center mb-2 transition">
                      <IconComponent className="size-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-white leading-tight">
                      {preset.label}
                    </span>
                    <span className="text-[10px] text-white/90 mt-0.5 font-mono">
                      {preset.subLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;