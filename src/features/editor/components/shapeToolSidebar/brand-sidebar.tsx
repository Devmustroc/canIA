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
  Palette, 
  Sparkles, 
  Type, 
  Building2, 
  Check,
  Wand2
} from "lucide-react";

interface BrandSidebarProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const BrandSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: BrandSidebarProps) => {
  const [selectedPalette, setSelectedPalette] = useState<number>(0);

  const brandPalettes = [
    {
      name: "Tech Indigo",
      colors: ["#4F46E5", "#06B6D4", "#0F172A", "#F8FAFC"],
    },
    {
      name: "Luxe Or & Noir",
      colors: ["#D97706", "#F59E0B", "#18181B", "#FAFAFA"],
    },
    {
      name: "Néon Cyber",
      colors: ["#EC4899", "#8B5CF6", "#06B6D4", "#09090B"],
    },
    {
      name: "Pastel Douceur",
      colors: ["#F472B6", "#38BDF8", "#34D399", "#FFFBEB"],
    },
    {
      name: "Forêt Émeraude",
      colors: ["#059669", "#10B981", "#064E3B", "#F0FDF4"],
    },
    {
      name: "Terre Chaude",
      colors: ["#EA580C", "#D97706", "#7C2D12", "#FFF7ED"],
    },
  ];

  const fontPairings = [
    { name: "Moderne Tech", heading: "Arial Black", body: "Arial", desc: "Clarté et sobriété" },
    { name: "Élégant Éditorial", heading: "Georgia", body: "Times New Roman", desc: "Style magazines et presse" },
    { name: "Impact & Titre", heading: "Impact", body: "Trebuchet MS", desc: "Attire l'attention" },
    { name: "Créatif & Style", heading: "Brush Script MT", body: "Palatino", desc: "Touche artistique originale" },
  ];

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const handleApplyPalette = (palette: string[], index: number) => {
    if (!editor) return;
    setSelectedPalette(index);

    const activeObject = editor.canvas.getActiveObject();
    if (activeObject) {
      // Apply primary color to active object
      editor.changeFillColor(palette[0]);
      toast.success("Couleur principale appliquée à la sélection !");
    } else {
      // Apply full palette to entire canvas design
      editor.applyBrandPalette(palette);
      toast.success(`Palette "${brandPalettes[index].name}" appliquée à l'ensemble du design !`);
    }
  };

  const handleApplyFontPairing = (headingFont: string) => {
    if (!editor) return;
    const activeObject = editor.canvas.getActiveObject();

    if (activeObject) {
      editor.changeFontFamily(headingFont);
      toast.success(`Typographie "${headingFont}" appliquée !`);
    } else {
      // Apply to all text objects
      editor.canvas.getObjects().forEach((obj) => {
        if (obj.type === "textbox" || obj.type === "text" || obj.type === "i-text") {
          (obj as fabric.Textbox).set("fontFamily", headingFont);
        }
      });
      editor.canvas.renderAll();
      toast.success(`Police "${headingFont}" appliquée à tous les textes !`);
    }
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col transition-all",
        activeTool === "brand" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Kit de Marque & Harmonisation"
        description="Appliquez des identités visuelles et harmonies de couleurs professionnelles"
      />

      <ScrollArea className="flex-1 p-4 space-y-6">
        {/* Harmonize Action Button */}
        <div className="p-3 bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-pink-500/10 border border-violet-200/80 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-950">
            <Wand2 className="size-4 text-violet-600 animate-spin-slow" />
            <span>Harmonisation Automatique</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Sélectionnez une palette ci-dessous pour recolorer l'ensemble du canvas en 1 clic.
          </p>
          <Button
            onClick={() => handleApplyPalette(brandPalettes[selectedPalette].colors, selectedPalette)}
            className="w-full h-8 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-xl gap-1.5 shadow-2xs"
          >
            <Sparkles className="size-3.5" />
            Harmoniser le canvas
          </Button>
        </div>

        {/* Color Palettes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Palette className="size-3.5 text-violet-600" />
              Palettes de Couleurs de Marque
            </label>
          </div>

          <div className="space-y-2.5">
            {brandPalettes.map((palette, idx) => {
              const isSelected = selectedPalette === idx;
              return (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => handleApplyPalette(palette.colors, idx)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-2xl border transition text-left group",
                    isSelected
                      ? "bg-slate-50 border-violet-500 shadow-2xs"
                      : "bg-white border-slate-200 hover:border-violet-300 hover:bg-slate-50/50"
                  )}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      {palette.name}
                      {isSelected && <Check className="size-3.5 text-violet-600" />}
                    </span>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      {palette.colors.map((c, i) => (
                        <div
                          key={i}
                          className="size-5 rounded-md border border-black/10 shadow-2xs"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Pairings */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Type className="size-3.5 text-indigo-600" />
            Duos Typographiques de Marque
          </label>

          <div className="grid grid-cols-2 gap-2">
            {fontPairings.map((pairing) => (
              <button
                key={pairing.name}
                type="button"
                onClick={() => handleApplyFontPairing(pairing.heading)}
                className="flex flex-col items-start p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/60 hover:border-indigo-300 transition text-left group"
              >
                <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-950">
                  {pairing.name}
                </span>
                <span className="text-[11px] font-bold text-slate-600 mt-1 truncate max-w-full">
                  {pairing.heading}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">{pairing.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default BrandSidebar;
