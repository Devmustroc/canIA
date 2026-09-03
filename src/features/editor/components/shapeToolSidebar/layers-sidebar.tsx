'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { ActiveTool, EditorProps } from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSidebarClose from "./tool-sidebar-close";
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Type, 
  Square, 
  Circle, 
  Triangle, 
  Image as ImageIcon, 
  Pencil,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayersProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const LayersSideBar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: LayersProps) => {
  const [objects, setObjects] = useState<fabric.Object[]>([]);
  const [, setTick] = useState(0);

  const refreshLayers = useCallback(() => {
    if (!editor?.canvas) {
      setObjects([]);
      return;
    }
    const allObjects = editor.canvas.getObjects();
    // Exclude the canvas workspace/clip rect
    const canvasLayers = allObjects.filter((obj) => obj.name !== "clip");
    // Top-most layer should be at the top of the UI list
    setObjects([...canvasLayers].reverse());
    setTick((t) => t + 1);
  }, [editor]);

  useEffect(() => {
    if (!editor?.canvas) return;

    refreshLayers();

    const canvas = editor.canvas;
    canvas.on("object:added", refreshLayers);
    canvas.on("object:removed", refreshLayers);
    canvas.on("object:modified", refreshLayers);
    canvas.on("selection:created", refreshLayers);
    canvas.on("selection:updated", refreshLayers);
    canvas.on("selection:cleared", refreshLayers);

    return () => {
      canvas.off("object:added", refreshLayers);
      canvas.off("object:removed", refreshLayers);
      canvas.off("object:modified", refreshLayers);
      canvas.off("selection:created", refreshLayers);
      canvas.off("selection:updated", refreshLayers);
      canvas.off("selection:cleared", refreshLayers);
    };
  }, [editor, refreshLayers]);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const handleSelectObject = (obj: fabric.Object) => {
    if (!editor?.canvas || !obj.selectable) return;
    editor.canvas.setActiveObject(obj);
    editor.canvas.renderAll();
    refreshLayers();
  };

  const handleToggleVisibility = (obj: fabric.Object, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editor?.canvas) return;
    const isVisible = obj.visible !== false;
    obj.set("visible", !isVisible);
    if (!isVisible) {
      editor.canvas.setActiveObject(obj);
    } else {
      editor.canvas.discardActiveObject();
    }
    editor.canvas.renderAll();
    refreshLayers();
  };

  const handleToggleLock = (obj: fabric.Object, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editor?.canvas) return;
    const isLocked = Boolean(obj.lockMovementX);
    obj.set({
      lockMovementX: !isLocked,
      lockMovementY: !isLocked,
      lockRotation: !isLocked,
      lockScalingX: !isLocked,
      lockScalingY: !isLocked,
      hasControls: isLocked,
    });
    editor.canvas.renderAll();
    refreshLayers();
  };

  const handleBringForward = (obj: fabric.Object, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editor?.canvas) return;
    editor.canvas.bringForward(obj);
    editor.canvas.renderAll();
    refreshLayers();
  };

  const handleSendBackward = (obj: fabric.Object, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editor?.canvas) return;
    const allObjects = editor.canvas.getObjects();
    const index = allObjects.indexOf(obj);
    // Keep clip workspace at index 0
    if (index > 1) {
      editor.canvas.sendBackwards(obj);
      editor.canvas.renderAll();
      refreshLayers();
    }
  };

  const handleDeleteObject = (obj: fabric.Object, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editor?.canvas) return;
    editor.canvas.remove(obj);
    editor.canvas.discardActiveObject();
    editor.canvas.renderAll();
    refreshLayers();
  };

  const getLayerIcon = (obj: fabric.Object) => {
    const type = obj.type;
    if (type === "textbox" || type === "text" || type === "i-text") {
      return <Type className="size-4 text-violet-600" />;
    }
    if (type === "rect") {
      return <Square className="size-4 text-blue-600" />;
    }
    if (type === "circle") {
      return <Circle className="size-4 text-amber-600" />;
    }
    if (type === "triangle" || type === "polygon") {
      return <Triangle className="size-4 text-emerald-600" />;
    }
    if (type === "image") {
      return <ImageIcon className="size-4 text-rose-600" />;
    }
    if (type === "path") {
      return <Pencil className="size-4 text-indigo-600" />;
    }
    return <Sparkles className="size-4 text-slate-500" />;
  };

  const getLayerLabel = (obj: fabric.Object) => {
    // @ts-ignore
    if (obj.text) {
      // @ts-ignore
      const text = obj.text as string;
      return text.length > 18 ? `${text.slice(0, 18)}...` : text;
    }
    if (obj.name) return obj.name;
    const type = obj.type || "élément";
    const typeMap: Record<string, string> = {
      rect: "Rectangle",
      circle: "Cercle",
      triangle: "Triangle",
      polygon: "Polygone",
      image: "Image",
      path: "Tracé pinceau",
      textbox: "Texte",
    };
    return typeMap[type] || type;
  };

  const isSelected = (obj: fabric.Object) => {
    const active = editor?.canvas?.getActiveObject();
    return active === obj;
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col transition-all",
        activeTool === "layers" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Gestion des Calques"
        description="Organisez, verrouillez et ordonnez les éléments de votre design"
      />

      <ScrollArea className="flex-1 p-4">
        {objects.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[260px] text-center space-y-3 p-4">
            <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <Layers className="size-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-700">Aucun élément sur le canvas</p>
              <p className="text-[11px] text-slate-400 max-w-[200px]">
                Ajoutez des textes, formes ou images pour les gérer ici.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-1 uppercase tracking-wider mb-2">
              <span>{objects.length} calque{objects.length > 1 ? "s" : ""}</span>
              <span>Ordre d'empilement</span>
            </div>

            {objects.map((obj, index) => {
              const selected = isSelected(obj);
              const isVisible = obj.visible !== false;
              const isLocked = Boolean(obj.lockMovementX);

              return (
                <div
                  key={index}
                  onClick={() => handleSelectObject(obj)}
                  className={cn(
                    "group flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none",
                    selected
                      ? "bg-violet-50/80 border-violet-400 shadow-sm"
                      : "bg-white border-slate-200/80 hover:border-violet-200 hover:bg-slate-50/60",
                    !isVisible && "opacity-50 bg-slate-50"
                  )}
                >
                  {/* Left: Icon & Label */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                    <div className="size-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      {getLayerIcon(obj)}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium truncate",
                        selected ? "text-violet-900 font-semibold" : "text-slate-700"
                      )}
                    >
                      {getLayerLabel(obj)}
                    </span>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Reorder Up */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => handleBringForward(obj, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Monter le calque"
                      aria-label="Monter le calque"
                    >
                      <ChevronUp className="size-3.5" />
                    </button>

                    {/* Reorder Down */}
                    <button
                      type="button"
                      disabled={index === objects.length - 1}
                      onClick={(e) => handleSendBackward(obj, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Descendre le calque"
                      aria-label="Descendre le calque"
                    >
                      <ChevronDown className="size-3.5" />
                    </button>

                    {/* Visibility */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleVisibility(obj, e)}
                      className={cn(
                        "p-1 rounded-md transition",
                        !isVisible
                          ? "text-rose-500 bg-rose-50"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                      )}
                      title={isVisible ? "Masquer le calque" : "Afficher le calque"}
                      aria-label={isVisible ? "Masquer le calque" : "Afficher le calque"}
                    >
                      {isVisible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    </button>

                    {/* Lock */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleLock(obj, e)}
                      className={cn(
                        "p-1 rounded-md transition",
                        isLocked
                          ? "text-amber-500 bg-amber-50"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                      )}
                      title={isLocked ? "Déverrouiller le calque" : "Verrouiller le calque"}
                      aria-label={isLocked ? "Déverrouiller le calque" : "Verrouiller le calque"}
                    >
                      {isLocked ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteObject(obj, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Supprimer le calque"
                      aria-label="Supprimer le calque"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default LayersSideBar;
