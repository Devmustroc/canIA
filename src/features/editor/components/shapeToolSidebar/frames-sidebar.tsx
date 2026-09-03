'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { ActiveTool, EditorProps } from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSidebarClose from "./tool-sidebar-close";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Circle, 
  Square, 
  Star, 
  Hexagon, 
  Diamond, 
  Sparkles, 
  ImageIcon, 
  Loader2,
  Check
} from "lucide-react";

interface FramesSidebarProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FramesSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FramesSidebarProps) => {
  const [selectedFrame, setSelectedFrame] = useState<string>("circle");
  const [isLoading, setIsLoading] = useState(false);

  const framePresets = [
    { id: "circle", label: "Cercle", icon: Circle, desc: "Masque circulaire parfait" },
    { id: "rounded_rect", label: "Carte Arrondie", icon: Square, desc: "Coins doux et élégants" },
    { id: "star", label: "Étoile", icon: Star, desc: "Forme dynamique à 5 branches" },
    { id: "hexagon", label: "Hexagone", icon: Hexagon, desc: "Style géométrique moderne" },
    { id: "diamond", label: "Losange", icon: Diamond, desc: "Cadre en diamant raffiné" },
  ];

  const sampleImages = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80",
  ];

  const activeObject = editor?.canvas.getActiveObject();
  const isImageSelected = activeObject && activeObject.type === "image";

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const handleApplyToActiveImage = (frameId: string) => {
    if (!editor) return;
    if (!isImageSelected) {
      toast.info("Sélectionnez une image sur le canvas pour lui appliquer ce cadre, ou cliquez sur une photo ci-dessous.");
      return;
    }

    editor.applyClipPathToActiveImage(frameId);
    toast.success(`Cadre ${framePresets.find(f => f.id === frameId)?.label} appliqué !`);
  };

  const handleAddFramedImage = async (url: string) => {
    if (!editor) return;
    setIsLoading(true);
    try {
      await editor.addFramedImage(selectedFrame, url);
      toast.success("Photo encadrée ajoutée au canvas !");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'ajout de l'image encadrée.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col transition-all",
        activeTool === "frames" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Cadres & Masques de Découpe"
        description="Découpez vos photos dans des formes géométriques stylisées"
      />

      <ScrollArea className="flex-1 p-4 space-y-5">
        {/* Active Selection Banner if image selected */}
        {isImageSelected && (
          <div className="p-3 bg-violet-50 border border-violet-200 rounded-xl flex items-center justify-between text-xs text-violet-900 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-violet-600 shrink-0" />
              <span>Image sélectionnée sur le canvas</span>
            </div>
          </div>
        )}

        {/* Frame Shapes Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Choisissez la Forme du Cadre</label>
          <div className="grid grid-cols-2 gap-2">
            {framePresets.map((preset) => {
              const Icon = preset.icon;
              const isSelected = selectedFrame === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedFrame(preset.id);
                    if (isImageSelected) {
                      handleApplyToActiveImage(preset.id);
                    }
                  }}
                  className={cn(
                    "flex flex-col items-start p-3 rounded-xl border transition text-left relative group",
                    isSelected
                      ? "bg-violet-50/80 border-violet-500 text-violet-950 shadow-2xs"
                      : "bg-slate-50/60 border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-100/60"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className={cn("size-5", isSelected ? "text-violet-600" : "text-slate-500")} />
                    {isSelected && <Check className="size-4 text-violet-600" />}
                  </div>
                  <span className="text-xs font-semibold">{preset.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Action Button for Selected Image */}
        {isImageSelected && (
          <div className="pt-1">
            <Button
              onClick={() => handleApplyToActiveImage(selectedFrame)}
              className="w-full h-9 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-xl gap-2 shadow-2xs"
            >
              <Sparkles className="size-3.5" />
              Appliquer le cadre à l'image
            </Button>
          </div>
        )}

        {/* Sample Photos Gallery to Add Framed */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-700">Insérer une photo encadrée</label>
          <p className="text-[11px] text-slate-400">
            Cliquez sur une photo ci-dessous pour l'ajouter directement découpée selon la forme sélectionnée.
          </p>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {sampleImages.map((src, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isLoading}
                onClick={() => handleAddFramedImage(src)}
                className="group relative h-28 rounded-xl overflow-hidden border border-slate-200 hover:border-violet-400 transition hover:shadow-md bg-slate-100"
              >
                <img
                  src={src}
                  alt={`Exemple ${idx}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium gap-1">
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : <ImageIcon className="size-4" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default FramesSidebar;
