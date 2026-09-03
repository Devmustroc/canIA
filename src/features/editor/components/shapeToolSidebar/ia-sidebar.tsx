'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { ActiveTool, EditorProps } from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSidebarClose from "./tool-sidebar-close";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useGenerateImage } from "@/features/ia/api/use-generate-image";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { useSelectedModel } from "@/features/ai-models/use-selected-model";
import { Sparkles, Wand2, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface IAProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const AiSideBar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: IAProps) => {
  const subscription = usePaywall();
  const [value, setValue] = useState("");
  const { imageModelId, selectImageModel, imageModels, currentImageModel } = useSelectedModel();

  const mutation = useGenerateImage();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (subscription.shouldBeBlock) {
      subscription.triggerPaywall();
      return;
    }

    mutation.mutate(
      { prompt: value, model: imageModelId },
      {
        onSuccess: ({ data }) => {
          if (data) {
            editor?.addImage(data);
            toast.success("Image générée et ajoutée au canvas !");
          }
        },
        onError: (err) => {
          toast.error(err.message || "Échec de la génération de l'image");
        },
      }
    );
  };

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col shadow-sm",
        activeTool === "ai" ? "block" : "hidden"
      )}
    >
      <ToolSidebarHeader 
        title="Génération IA" 
        description="Créez des images uniques avec les meilleurs modèles d'IA" 
      />
      
      <ScrollArea className="flex-1">
        <form onSubmit={onSubmit} className="p-4 space-y-5">
          {/* Model Selector Cards */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Moteur de Génération</span>
              <span className="text-[10px] text-violet-600 font-mono">OpenRouter Ready</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {imageModels.map((m) => {
                const isSelected = imageModelId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => selectImageModel(m.id)}
                    className={cn(
                      "flex items-start justify-between p-2.5 rounded-xl border text-left transition-all duration-200",
                      isSelected
                        ? "border-violet-600 bg-violet-50/70 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-x-1.5">
                        <span className="text-xs font-bold text-slate-800">{m.name}</span>
                        {m.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-violet-100 text-violet-700 font-medium">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10.5px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
                        {m.description}
                      </span>
                    </div>
                    {isSelected && <Zap className="size-3.5 text-violet-600 shrink-0 mt-0.5 fill-violet-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Description de l'image (Prompt)
            </label>
            <Textarea
              disabled={mutation.isPending}
              value={value}
              placeholder="Ex: Une illustration néon futuriste cyberpunk d'une ville nocturne avec des reflets dorés..."
              cols={30}
              rows={5}
              required={true}
              minLength={3}
              onChange={(e) => setValue(e.target.value)}
              className="resize-none text-xs rounded-xl border-slate-200 focus-visible:ring-violet-500"
            />
          </div>

          {/* Quick inspiration chips */}
          <div className="space-y-1.5">
            <p className="text-[11px] text-slate-500 font-medium">Idées rapides :</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Minimalist geometric logo",
                "Pastel abstract 3D shapes",
                "Retro sunset vaporwave",
                "Studio product photo",
              ].map((idea, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setValue(idea)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          <Button
            disabled={mutation.isPending || !value.trim()}
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow font-medium"
          >
            {mutation.isPending ? (
              <span className="flex items-center gap-x-2">
                <Sparkles className="size-4 animate-spin" />
                Génération en cours avec {currentImageModel.name}...
              </span>
            ) : (
              <span className="flex items-center gap-x-1.5">
                <Wand2 className="size-4" />
                Générer l'image
              </span>
            )}
          </Button>
        </form>
      </ScrollArea>
      <ToolSidebarClose closeSidebar={onClose} />
    </aside>
  );
};

export default AiSideBar;