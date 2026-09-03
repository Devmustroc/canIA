'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ActiveTool, EditorProps } from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-sidebar-close";
import { Sparkles, Plus, BookmarkCheck } from "lucide-react";
import { getStoredBrandKit } from "@/features/brand-kit/use-brand-kit";
import { toast } from "sonner";

interface TextProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TextSideBar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TextProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const handleAddBrandKitText = () => {
    const brandKit = getStoredBrandKit();
    if (!editor) return;

    editor.addText(brandKit.name || "Titre de Marque", {
      fontSize: 54,
      fontWeight: 800,
      fontFamily: brandKit.fonts.heading || "Inter",
      fill: brandKit.colors.primary || "#6366f1",
    });
    toast.success(`Typographie Brand Kit "${brandKit.name}" ajoutée !`);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col shadow-sm",
        activeTool === "text" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Texte & Typographie"
        description="Titres percutants, paragraphes et styles combinés"
      />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Main Add Text CTA */}
          <Button
            onClick={() => editor?.addText("Votre texte ici")}
            className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold flex items-center justify-center gap-x-2 shadow"
          >
            <Plus className="size-4.5" />
            <span>Ajouter une zone de texte</span>
          </Button>

          {/* Quick Brand Kit button if defined */}
          <button
            type="button"
            onClick={handleAddBrandKitText}
            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/60 text-indigo-900 transition text-left"
          >
            <div className="flex items-center gap-x-2">
              <BookmarkCheck className="size-4 text-indigo-600 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-semibold leading-tight">Style de votre Brand Kit</p>
                <p className="text-[10px] text-indigo-600/80">Insérer votre police & couleur de marque</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-indigo-700 font-mono shrink-0">1-Clic</span>
          </button>

          {/* Core Hierarchy */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-700">Hiérarchie de texte</span>

            {/* Grand Titre */}
            <button
              type="button"
              onClick={() =>
                editor?.addText("GRAND TITRE", {
                  fontSize: 64,
                  fontWeight: 800,
                  fill: "#18181b",
                })
              }
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-violet-50/60 hover:border-violet-300 transition text-left group"
            >
              <span className="text-xl font-black text-slate-900 group-hover:text-violet-900 leading-tight block truncate">
                Ajouter un grand titre
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Bold • 64px</span>
            </button>

            {/* Sous-titre */}
            <button
              type="button"
              onClick={() =>
                editor?.addText("Sous-titre descriptif", {
                  fontSize: 36,
                  fontWeight: 600,
                  fill: "#3f3f46",
                })
              }
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-violet-50/60 hover:border-violet-300 transition text-left group"
            >
              <span className="text-base font-semibold text-slate-700 group-hover:text-violet-800 leading-tight block truncate">
                Ajouter un sous-titre
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Medium • 36px</span>
            </button>

            {/* Corps de texte */}
            <button
              type="button"
              onClick={() =>
                editor?.addText("Votre paragraphe de description ou d'explication ici.", {
                  fontSize: 22,
                  fontWeight: 400,
                  fill: "#71717a",
                })
              }
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-violet-50/60 hover:border-violet-300 transition text-left group"
            >
              <span className="text-xs font-normal text-slate-600 group-hover:text-violet-700 leading-normal block">
                Ajouter un corps de texte
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Regular • 22px</span>
            </button>
          </div>

          {/* Creative Styles & Combinations */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-x-1.5">
              <Sparkles className="size-3.5 text-amber-500" />
              <span>Combinaisons de styles prêtes</span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  editor?.addText("SOLDES -50%", {
                    fontSize: 42,
                    fontWeight: 900,
                    fill: "#ef4444",
                  })
                }
                className="p-3 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/70 text-rose-700 font-black text-xs text-center transition"
              >
                🔥 PROMO FLASH
              </button>

              <button
                type="button"
                onClick={() =>
                  editor?.addText("« Citation Inspirante »", {
                    fontSize: 28,
                    fontStyle: "italic",
                    fill: "#8b5cf6",
                  })
                }
                className="p-3 rounded-xl border border-violet-200 bg-violet-50/60 hover:bg-violet-100/70 text-violet-700 font-semibold text-xs text-center italic transition"
              >
                ✨ CITATION
              </button>

              <button
                type="button"
                onClick={() =>
                  editor?.addText("NOUVELLE COLLECTION", {
                    fontSize: 24,
                    fontWeight: 700,
                    fill: "#0f172a",
                  })
                }
                className="p-3 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-[11px] text-center tracking-widest uppercase transition"
              >
                ÉDITION LIMITÉE
              </button>

              <button
                type="button"
                onClick={() =>
                  editor?.addText("EN SAVOIR PLUS →", {
                    fontSize: 20,
                    fontWeight: 700,
                    fill: "#2563eb",
                  })
                }
                className="p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-blue-700 font-bold text-xs text-center transition"
              >
                LIEN CTA →
              </button>
            </div>
          </div>
        </div>
      </ScrollArea>

      <ToolSidebarClose closeSidebar={onClose} />
    </aside>
  );
};

export default TextSideBar;