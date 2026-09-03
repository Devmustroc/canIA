'use client';

import React, { useState } from 'react';
import { EditorProps } from "../types";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileCode2, Sparkles, Loader2, Zap } from "lucide-react";

interface VectorizeButtonProps {
  editor: EditorProps | undefined;
}

export const VectorizeButton = ({ editor }: VectorizeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const activeObject = editor?.canvas.getActiveObject();
  const isImageSelected = activeObject && activeObject.type === "image";

  if (!isImageSelected) return null;

  const handleVectorize = async (colors: number) => {
    if (!editor) return;
    setIsLoading(true);
    try {
      await editor.vectorizeActiveImage({ numberofcolors: colors });
      toast.success("Image vectorisée avec succès !");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Échec de la vectorisation de l'image.");
    } finally {
      setIsLoading(false);
    }
  };

  const presets = [
    { label: "Logo & Formes simples", colors: 4, desc: "4 couleurs (aplats nets)" },
    { label: "Standard", colors: 16, desc: "16 couleurs (équilibré)" },
    { label: "Haute Définition", colors: 32, desc: "32 couleurs (détails riches)" },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Hint label="Convertir en forme vectorielle SVG" side="bottom" sideOffset={5}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            className="h-8 px-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-400 text-emerald-800 text-xs font-semibold rounded-lg shadow-2xs gap-1.5 transition-all"
          >
            {isLoading ? (
              <Loader2 className="size-3.5 animate-spin text-emerald-600" />
            ) : (
              <FileCode2 className="size-3.5 text-emerald-600" />
            )}
            <span>Vectoriser (SVG)</span>
          </Button>
        </PopoverTrigger>
      </Hint>

      <PopoverContent className="w-[280px] p-3 space-y-3 shadow-lg border-slate-200 rounded-xl z-[60]" align="start">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Zap className="size-4 text-emerald-600" />
            <h4 className="font-semibold text-xs text-slate-800">Vectorisation Image vers SVG</h4>
          </div>
          <p className="text-[11px] text-slate-500">
            Convertit l'image bitmap en calque vectoriel aux couleurs éditables.
          </p>
        </div>

        <div className="space-y-1.5">
          {presets.map((preset) => (
            <button
              key={preset.colors}
              type="button"
              disabled={isLoading}
              onClick={() => handleVectorize(preset.colors)}
              className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-300 transition text-left text-xs text-slate-700 hover:text-emerald-950 group disabled:opacity-50"
            >
              <div>
                <div className="font-medium text-slate-800 group-hover:text-emerald-900">{preset.label}</div>
                <div className="text-[10px] text-slate-400">{preset.desc}</div>
              </div>
              <Sparkles className="size-3.5 text-slate-400 group-hover:text-emerald-600" />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VectorizeButton;
