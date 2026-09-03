'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FaCircle,
  FaSquare,
  FaSquareFull,
} from "react-icons/fa";
import { IoTriangle } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";
import { ActiveTool, EditorProps } from "../types";
import ToolSidebarHeader from "./shapeToolSidebar/tool-sidebar-header";
import ToolSidebarClose from "./shapeToolSidebar/tool-sidebar-close";
import { Sparkles, Shapes, ArrowRight } from "lucide-react";

interface ShapeSidebarProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

interface ShapeItem {
  id: string;
  name: string;
  action: () => void;
  icon: React.ElementType;
  className?: string;
  iconClassName?: string;
}

const ShapeSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ShapeSidebarProps) => {
  const onCloseShapeSidebar = () => {
    onChangeActiveTool("select");
  };

  const BASIC_SHAPES: ShapeItem[] = [
    {
      id: "circle",
      name: "Cercle",
      action: () => editor?.addCircle(),
      icon: FaCircle,
      className: "hover:border-violet-400 text-violet-600",
    },
    {
      id: "soft-rect",
      name: "Rectangle doux",
      action: () => editor?.addSoftRectangle(),
      icon: FaSquare,
      className: "hover:border-indigo-400 text-indigo-600",
    },
    {
      id: "square",
      name: "Carré / Bloc",
      action: () => editor?.addRectangle(),
      icon: FaSquareFull,
      className: "hover:border-blue-400 text-blue-600",
    },
    {
      id: "triangle",
      name: "Triangle",
      action: () => editor?.addTriangle(),
      icon: IoTriangle,
      className: "hover:border-emerald-400 text-emerald-600",
    },
    {
      id: "inv-triangle",
      name: "Triangle inversé",
      action: () => editor?.addInverseTriangle(),
      icon: IoTriangle,
      iconClassName: "rotate-180",
      className: "hover:border-amber-400 text-amber-600",
    },
    {
      id: "diamond",
      name: "Losange",
      action: () => editor?.addDiamond(),
      icon: FaDiamond,
      className: "hover:border-rose-400 text-rose-600",
    },
  ];

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col shadow-sm",
        activeTool === "shapes" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Formes & Éléments"
        description="Formes géométriques, badges et conteneurs visuels"
      />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Basic Shapes Grid */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Formes géométriques</span>
              <span className="text-[10px] text-slate-400 font-mono">Vectoriel</span>
            </span>

            <div className="grid grid-cols-3 gap-3">
              {BASIC_SHAPES.map((shape) => {
                const IconComponent = shape.icon;
                return (
                  <button
                    key={shape.id}
                    type="button"
                    onClick={shape.action}
                    className={cn(
                      "group flex flex-col items-center justify-center p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-violet-50/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs cursor-pointer",
                      shape.className
                    )}
                  >
                    <div className="size-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-2xs">
                      <IconComponent className={cn("size-5", shape.iconClassName)} />
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 group-hover:text-slate-900 line-clamp-1 text-center">
                      {shape.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Layout Presets / Badges */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-x-1.5">
              <Sparkles className="size-3.5 text-amber-500" />
              <span>Conteneurs & Encarts</span>
            </span>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  editor?.addSoftRectangle();
                  editor?.changeFillColor("#f1f5f9");
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-violet-50/50 hover:border-violet-300 transition text-left group"
              >
                <div className="flex items-center gap-x-2.5">
                  <div className="size-8 rounded-lg bg-slate-200 border flex items-center justify-center text-[10px] font-bold text-slate-600">
                    Card
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Encart de contenu clair</p>
                    <p className="text-[10px] text-slate-400">Fond doux neutre pour structurer vos textes</p>
                  </div>
                </div>
                <ArrowRight className="size-3.5 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  editor?.addSoftRectangle();
                  editor?.changeFillColor("#8b5cf6");
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-violet-50/50 hover:border-violet-300 transition text-left group"
              >
                <div className="flex items-center gap-x-2.5">
                  <div className="size-8 rounded-lg bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                    CTA
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Bouton d&apos;appel à l&apos;action</p>
                    <p className="text-[10px] text-slate-400">Bouton d&apos;accent prêt pour vos bannières</p>
                  </div>
                </div>
                <ArrowRight className="size-3.5 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </ScrollArea>

      <ToolSidebarClose closeSidebar={onCloseShapeSidebar} />
    </aside>
  );
};

export default ShapeSidebar;