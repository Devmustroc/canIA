'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { ActiveTool, EditorProps } from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSidebarClose from "./tool-sidebar-close";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  CircleDot, 
  Plus, 
  Trash2,
  Sparkles,
  Palette
} from "lucide-react";

interface ChartsSidebarProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

type ChartType = "bar" | "pie" | "donut" | "line";

export const ChartsSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ChartsSidebarProps) => {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [chartTitle, setChartTitle] = useState("Rapport de Ventes");
  const [dataPoints, setDataPoints] = useState<Array<{ label: string; value: number }>>([
    { label: "Jan", value: 45 },
    { label: "Fév", value: 75 },
    { label: "Mar", value: 55 },
    { label: "Avr", value: 90 },
    { label: "Mai", value: 65 },
  ]);

  const colorThemes = [
    ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EC4899"],
    ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"],
    ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#D1FAE5"],
    ["#F59E0B", "#FBBF24", "#FCD34D", "#FDE68A", "#FEF3C7"],
    ["#EC4899", "#F472B6", "#FBCFE8", "#FCE7F3", "#FFF1F2"],
  ];
  const [selectedThemeIdx, setSelectedThemeIdx] = useState(0);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const handleAddPoint = () => {
    if (dataPoints.length >= 8) {
      toast.error("Maximum 8 points de données par graphique.");
      return;
    }
    setDataPoints([...dataPoints, { label: `Point ${dataPoints.length + 1}`, value: 50 }]);
  };

  const handleRemovePoint = (index: number) => {
    if (dataPoints.length <= 2) {
      toast.error("Au moins 2 points de données sont requis.");
      return;
    }
    setDataPoints(dataPoints.filter((_, i) => i !== index));
  };

  const handleUpdatePoint = (index: number, field: "label" | "value", val: string | number) => {
    const updated = [...dataPoints];
    if (field === "label") {
      updated[index].label = String(val);
    } else {
      updated[index].value = Number(val) || 0;
    }
    setDataPoints(updated);
  };

  const handleInsertChart = () => {
    if (!editor) return;

    const labels = dataPoints.map((d) => d.label);
    const data = dataPoints.map((d) => d.value);

    editor.addChart(chartType, {
      title: chartTitle,
      labels,
      data,
      colors: colorThemes[selectedThemeIdx],
    });

    toast.success("Graphique inséré sur le canvas !");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col transition-all",
        activeTool === "charts" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Graphiques & Visualisation"
        description="Créez et insérez des diagrammes statistiques interactifs sur votre canvas"
      />

      <ScrollArea className="flex-1 p-4 space-y-6">
        {/* Chart Type Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Type de Graphique</label>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100/80 rounded-2xl">
            <button
              type="button"
              onClick={() => setChartType("bar")}
              className={cn(
                "flex flex-col items-center justify-center p-2.5 rounded-xl transition text-[11px] font-medium gap-1",
                chartType === "bar"
                  ? "bg-white text-violet-700 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <BarChart3 className="size-4" />
              <span>Bâtons</span>
            </button>

            <button
              type="button"
              onClick={() => setChartType("pie")}
              className={cn(
                "flex flex-col items-center justify-center p-2.5 rounded-xl transition text-[11px] font-medium gap-1",
                chartType === "pie"
                  ? "bg-white text-violet-700 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <PieChart className="size-4" />
              <span>Secteurs</span>
            </button>

            <button
              type="button"
              onClick={() => setChartType("donut")}
              className={cn(
                "flex flex-col items-center justify-center p-2.5 rounded-xl transition text-[11px] font-medium gap-1",
                chartType === "donut"
                  ? "bg-white text-violet-700 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <CircleDot className="size-4" />
              <span>Anneau</span>
            </button>

            <button
              type="button"
              onClick={() => setChartType("line")}
              className={cn(
                "flex flex-col items-center justify-center p-2.5 rounded-xl transition text-[11px] font-medium gap-1",
                chartType === "line"
                  ? "bg-white text-violet-700 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <TrendingUp className="size-4" />
              <span>Courbe</span>
            </button>
          </div>
        </div>

        {/* Chart Title */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Titre du Graphique</label>
          <Input
            value={chartTitle}
            onChange={(e) => setChartTitle(e.target.value)}
            placeholder="Ex: Ventes du trimestre"
            className="h-9 rounded-xl text-xs"
          />
        </div>

        {/* Data Points Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Données & Valeurs</label>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAddPoint}
              className="text-xs h-7 px-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg gap-1"
            >
              <Plus className="size-3" />
              <span>Ajouter</span>
            </Button>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {dataPoints.map((pt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={pt.label}
                  onChange={(e) => handleUpdatePoint(idx, "label", e.target.value)}
                  placeholder="Libellé"
                  className="h-8 rounded-lg text-xs flex-1"
                />
                <Input
                  type="number"
                  value={pt.value}
                  onChange={(e) => handleUpdatePoint(idx, "value", e.target.value)}
                  placeholder="Valeur"
                  className="h-8 rounded-lg text-xs w-20 text-right font-semibold"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemovePoint(idx)}
                  className="size-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Color Theme Selector */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Palette className="size-3.5 text-violet-600" />
            Thème de Couleurs
          </label>

          <div className="grid grid-cols-5 gap-2">
            {colorThemes.map((theme, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedThemeIdx(idx)}
                className={cn(
                  "flex items-center gap-0.5 p-1.5 rounded-xl border transition",
                  selectedThemeIdx === idx ? "border-violet-600 bg-violet-50/50 shadow-2xs" : "border-slate-200 hover:border-violet-300"
                )}
              >
                {theme.slice(0, 3).map((c, i) => (
                  <div key={i} className="size-3.5 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </button>
            ))}
          </div>
        </div>

        {/* Insert Action Button */}
        <Button
          onClick={handleInsertChart}
          className="w-full h-10 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl gap-2 shadow-sm"
        >
          <Sparkles className="size-4" />
          Insérer le graphique
        </Button>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default ChartsSidebar;
