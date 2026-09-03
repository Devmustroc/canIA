'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { ActiveTool, EditorProps } from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSidebarClose from "./tool-sidebar-close";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  PlayCircle, 
  Sparkles, 
  Slash, 
  Eye, 
  MoveRight, 
  Maximize2 
} from "lucide-react";

interface AnimationSidebarProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const AnimationSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: AnimationSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const animations = [
    {
      id: "none",
      title: "Aucune",
      description: "Élément fixe sans animation",
      icon: Slash,
      color: "bg-slate-100 text-slate-700",
    },
    {
      id: "fade",
      title: "Fondu (Fade In)",
      description: "Apparition progressive et douce",
      icon: Eye,
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
    },
    {
      id: "slide",
      title: "Glissement (Slide In)",
      description: "Entrée fluide depuis le côté",
      icon: MoveRight,
      color: "bg-violet-500/10 text-violet-600 border-violet-200",
    },
    {
      id: "pop",
      title: "Pop & Rebond (Scale Pop)",
      description: "Apparition dynamique avec effet de zoom",
      icon: Maximize2,
      color: "bg-pink-500/10 text-pink-600 border-pink-200",
    },
  ];

  const handleApplyAnimation = (animId: string) => {
    if (!editor) return;
    const selected = editor.canvas.getActiveObject();

    if (!selected) {
      toast.error("Veuillez d'abord sélectionner un élément sur le canvas.");
      return;
    }

    editor.applyAnimation(animId as any);
    toast.success(`Animation "${animId}" appliquée à la sélection !`);
  };

  const handlePlayAll = () => {
    if (!editor) return;
    editor.playAllAnimations();
    toast.success("Lecture de la séquence d'animation !");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col transition-all",
        activeTool === "animation" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Animations & Mouvements"
        description="Animez les éléments de votre création et prévisualisez la séquence"
      />

      <ScrollArea className="flex-1 p-4 space-y-6">
        {/* Play All Master Button */}
        <div className="p-3 bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-pink-600/10 border border-violet-200 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-950">
            <PlayCircle className="size-4 text-violet-600" />
            <span>Aperçu de la Séquence</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Jouez l'ensemble des animations configurées sur le canvas en temps réel.
          </p>
          <Button
            onClick={handlePlayAll}
            className="w-full h-8 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl gap-1.5 shadow-2xs"
          >
            <Sparkles className="size-3.5" />
            Jouer toute la séquence
          </Button>
        </div>

        {/* Animation Motion Cards */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700">Styles d'Animation d'Entrée</label>

          <div className="space-y-2.5">
            {animations.map((anim) => {
              const Icon = anim.icon;
              return (
                <button
                  key={anim.id}
                  type="button"
                  onClick={() => handleApplyAnimation(anim.id)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/80 hover:border-violet-300 transition text-left group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-9 rounded-xl flex items-center justify-center border ${anim.color}`}>
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 group-hover:text-violet-950">
                        {anim.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">{anim.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default AnimationSidebar;
