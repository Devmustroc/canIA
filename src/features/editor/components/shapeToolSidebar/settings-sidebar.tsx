'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { cn } from "@/lib/utils";
import { ActiveTool, EditorProps } from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSidebarClose from "./tool-sidebar-close";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ColorPicker from "@/features/editor/components/shapeToolSidebar/color-picker";
import { 
  Sparkles, 
  Instagram, 
  Presentation, 
  Film, 
  Youtube, 
  FileText, 
  Check, 
  Sliders,
  Palette
} from "lucide-react";
import { toast } from 'sonner';

interface SettingsProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const MAGIC_PRESETS = [
  {
    name: "Post Instagram",
    width: 1080,
    height: 1080,
    icon: Instagram,
    ratio: "1:1 Carré",
  },
  {
    name: "Story / Reel / TikTok",
    width: 1080,
    height: 1920,
    icon: Film,
    ratio: "9:16 Vertical",
  },
  {
    name: "Miniature YouTube",
    width: 1280,
    height: 720,
    icon: Youtube,
    ratio: "16:9 Paysage",
  },
  {
    name: "Présentation 16:9",
    width: 1920,
    height: 1080,
    icon: Presentation,
    ratio: "16:9 Full HD",
  },
  {
    name: "Affiche / Doc A4",
    width: 1200,
    height: 1600,
    icon: FileText,
    ratio: "Portrait A4",
  },
];

const SettingsSideBar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: SettingsProps) => {
  const workspace = editor?.getWorkSpace();

  const initialWidth = useMemo(() => `${workspace?.width ?? 0}`, [workspace]);
  const initialHeight = useMemo(() => `${workspace?.height ?? 0}`, [workspace]);
  const initialBackground = useMemo(
    () => workspace?.backgroundColor ?? "#FFFFFF",
    [workspace]
  );

  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [background, setBackground] = useState(initialBackground);

  useEffect(() => {
    setWidth(initialWidth);
    setHeight(initialHeight);
    setBackground(initialBackground);
  }, [initialWidth, initialHeight, initialBackground]);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const changeBackground = (value: string) => {
    setBackground(value);
    editor?.changeBackground(value);
  };

  const handleApplyPreset = (preset: typeof MAGIC_PRESETS[0]) => {
    setWidth(String(preset.width));
    setHeight(String(preset.height));

    editor?.changeSize({
      width: preset.width,
      height: preset.height,
    });

    toast.success(`Design redimensionné en "${preset.name}" (${preset.width}x${preset.height} px)`);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const w = parseInt(width, 10);
    const h = parseInt(height, 10);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      toast.error("Veuillez saisir des dimensions valides.");
      return;
    }

    editor?.changeSize({
      width: w,
      height: h,
    });
    toast.success(`Dimensions mises à jour : ${w} x ${h} px`);
  };

  return (
    <aside
      className={cn(
        `bg-white relative border-r z-[40] w-[360px] h-full flex flex-col transition-all`,
        activeTool === "settings" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Réglages & Magic Resize"
        description="Redimensionnez instantanément pour n'importe quel réseau ou ajustez le fond"
      />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Magic Resize Presets */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Sparkles className="size-3.5 text-amber-500" />
              <span>Magic Resize en 1 clic</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {MAGIC_PRESETS.map((preset, idx) => {
                const Icon = preset.icon;
                const isCurrent =
                  Number(width) === preset.width && Number(height) === preset.height;

                return (
                  <button
                    key={idx}
                    onClick={() => handleApplyPreset(preset)}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                      isCurrent
                        ? "bg-violet-50/80 border-violet-500 text-violet-950 shadow-2xs"
                        : "bg-slate-50/60 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300 text-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "size-8 rounded-lg flex items-center justify-center shrink-0",
                          isCurrent ? "bg-violet-600 text-white" : "bg-white text-slate-600 border border-slate-200"
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold leading-snug">{preset.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {preset.width} × {preset.height} px • {preset.ratio}
                        </p>
                      </div>
                    </div>

                    {isCurrent && (
                      <div className="size-5 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                        <Check className="size-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Sliders className="size-3.5 text-violet-600" />
              <span>Dimensions Personnalisées</span>
            </div>

            {/* Custom Dimensions Form */}
            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-slate-500">Largeur (px)</Label>
                  <Input
                    placeholder="1080"
                    value={width}
                    type="number"
                    onChange={(e) => setWidth(e.target.value)}
                    className="h-9 text-xs rounded-xl border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-slate-500">Hauteur (px)</Label>
                  <Input
                    placeholder="1080"
                    value={height}
                    type="number"
                    onChange={(e) => setHeight(e.target.value)}
                    className="h-9 text-xs rounded-xl border-slate-200"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-9 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium"
              >
                Appliquer les dimensions
              </Button>
            </form>
          </div>

          {/* Canvas Background Color */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Palette className="size-3.5 text-indigo-600" />
              <span>Arrière-plan du Design</span>
            </div>
            <ColorPicker value={background} onChange={changeBackground} />
          </div>
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default SettingsSideBar;