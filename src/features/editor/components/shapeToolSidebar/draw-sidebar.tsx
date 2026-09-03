'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { ActiveTool, EditorProps, STROKE_COLOR, STROKE_WIDTH } from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ColorPicker from "./color-picker";
import ToolSidebarClose from "./tool-sidebar-close";
import { Slider } from "@/components/ui/slider";
import { Paintbrush, PenTool, Highlighter, Pencil, Palette } from "lucide-react";

interface DrawSideBarProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const BRUSH_PRESETS = [
  {
    id: "pencil",
    name: "Crayon fin",
    width: 3,
    icon: Pencil,
    description: "Tracés nets & fins",
  },
  {
    id: "pen",
    name: "Feutre standard",
    width: 8,
    icon: PenTool,
    description: "Écriture manuscrite",
  },
  {
    id: "brush",
    name: "Pinceau large",
    width: 20,
    icon: Paintbrush,
    description: "Coloriage & remplissage",
  },
  {
    id: "highlighter",
    name: "Surligneur",
    width: 36,
    icon: Highlighter,
    description: "Accents translucides",
  },
];

const QUICK_COLORS = [
  "#18181b", // Black
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#ef4444", // Red
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#06b6d4", // Cyan
  "#ffffff", // White
];

const DrawSideBar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: DrawSideBarProps) => {
  const colorValue = editor?.getActiveStrokeColor() || STROKE_COLOR;
  const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;

  const onClose = () => {
    editor?.disabledDrawingMode();
    onChangeActiveTool("select");
  };

  const onChangeStrokeWidth = (width: number) => {
    editor?.changeStrokeWidth(width);
  };

  const onChangeColor = (color: string) => {
    editor?.changeStrokeColor(color);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col shadow-sm",
        activeTool === "draw" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Dessin Libre"
        description="Esquisses, annotations et pinceaux artistiques"
      />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Brush Type Presets */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700">Type de pinceau</span>
            <div className="grid grid-cols-2 gap-2">
              {BRUSH_PRESETS.map((b) => {
                const IconComponent = b.icon;
                const isSelected = Math.abs(widthValue - b.width) < 3;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onChangeStrokeWidth(b.width)}
                    className={cn(
                      "flex items-center gap-x-2.5 p-2.5 rounded-xl border text-left transition-all",
                      isSelected
                        ? "border-violet-600 bg-violet-50 text-violet-900 font-semibold ring-1 ring-violet-500 shadow-2xs"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <div
                      className={cn(
                        "size-7 rounded-lg flex items-center justify-center shrink-0",
                        isSelected ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"
                      )}
                    >
                      <IconComponent className="size-3.5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs leading-tight truncate">{b.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{b.width}px</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stroke Width Slider & Realtime Preview */}
          <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Épaisseur du trait</span>
              <span className="text-xs font-mono font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-md">
                {widthValue} px
              </span>
            </div>

            <Slider
              value={[widthValue]}
              onValueChange={(values) => onChangeStrokeWidth(values[0])}
              min={1}
              max={60}
              step={1}
              className="w-full"
            />

            {/* Stroke Preview Line */}
            <div className="h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center px-4 overflow-hidden">
              <div
                className="w-full rounded-full transition-all duration-150"
                style={{
                  height: `${Math.min(widthValue, 32)}px`,
                  backgroundColor: colorValue,
                }}
              />
            </div>
          </div>

          {/* Quick Palette Swatches */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-x-1.5">
              <Palette className="size-3.5 text-violet-600" />
              <span>Couleur du pinceau</span>
            </span>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {QUICK_COLORS.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChangeColor(c)}
                  className={cn(
                    "size-7 rounded-full border border-black/10 shrink-0 transition-transform hover:scale-110 shadow-2xs",
                    colorValue.toLowerCase() === c.toLowerCase() && "ring-2 ring-violet-600 ring-offset-2 scale-110"
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Choisir couleur ${c}`}
                />
              ))}
            </div>

            <div className="pt-2">
              <ColorPicker value={colorValue} onChange={onChangeColor} />
            </div>
          </div>
        </div>
      </ScrollArea>

      <ToolSidebarClose closeSidebar={onClose} />
    </aside>
  );
};

export default DrawSideBar;