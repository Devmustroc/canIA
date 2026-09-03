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
  History, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Sparkles 
} from "lucide-react";

interface HistorySidebarProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const HistorySidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: HistorySidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const historyCount = editor?.getHistoryCount() || 0;

  const handleRestore = (index: number) => {
    if (!editor) return;
    editor.restoreVersion(index);
    toast.success(`Projet restauré à la Révision #${index + 1} !`);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col transition-all",
        activeTool === "history" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Historique des Versions"
        description="Consultez les révisions enregistrées et restaurez des états passés"
      />

      <ScrollArea className="flex-1 p-4 space-y-6">
        {/* Info Banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
          <Clock className="size-4 text-violet-600 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-600 space-y-0.5">
            <p className="font-semibold text-slate-800">Sauvegarde Automatique</p>
            <p className="text-[11px]">Chaque modification de votre canvas enregistre un point de restauration.</p>
          </div>
        </div>

        {/* History Revisions List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Révisions Enregistrées</label>
            <span className="text-[11px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
              {historyCount} version{historyCount > 1 ? "s" : ""}
            </span>
          </div>

          {historyCount > 0 ? (
            <div className="space-y-2.5">
              {Array.from({ length: historyCount }).map((_, idx) => {
                const isCurrent = idx === historyCount - 1;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "p-3 rounded-2xl border transition flex items-center justify-between gap-2 shadow-2xs",
                      isCurrent
                        ? "bg-violet-50/60 border-violet-300"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">Révision #{idx + 1}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <CheckCircle2 className="size-2.5" />
                            Actuelle
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">Point de restauration de l'éditeur</p>
                    </div>

                    {!isCurrent && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRestore(idx)}
                        className="h-8 text-xs font-medium text-violet-700 hover:bg-violet-100/80 px-2.5 rounded-xl gap-1"
                      >
                        <RotateCcw className="size-3" />
                        <span>Restaurer</span>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 space-y-2 text-slate-400">
              <History className="size-8 mx-auto stroke-1" />
              <p className="text-xs">Aucune révision enregistrée pour le moment.</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default HistorySidebar;
