'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSidebarHeader from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-sidebar-close";
import { ActiveTool, EditorProps } from "../../types";
import { AlertTriangle, Crown, Loader2, Sparkles } from "lucide-react";
import Image from 'next/image';
import { ResponderType, useGetTemplates } from "@/features/projects/api/use-get-template";
import useConfirm from "@/hooks/use-confirm";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface TemplateSideBarProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const TemplateSideBar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TemplateSideBarProps) => {
  const { userId } = useAuth();
  const router = useRouter();
  const subscription = usePaywall();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remplacer le design actuel ?",
    "L'application de ce modèle va remplacer les éléments existants sur votre canvas."
  );
  const { data, isLoading, isError } = useGetTemplates({
    page: "1",
    limit: "30",
  });

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onClick = async (template: ResponderType['data'][0]) => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    if (subscription.shouldBeBlock && template.isPro) {
      subscription.triggerPaywall();
      return;
    }
    const ok = await confirm();
    if (ok) {
      editor?.loadJson(template.json);
    }
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col shadow-sm",
        activeTool === "templates" ? "visible" : "hidden"
      )}
    >
      <ConfirmDialog />
      <ToolSidebarHeader
        title="Modèles & Design"
        description="Modèles professionnels prêts à l'emploi"
      />

      {isLoading && (
        <div className="flex flex-col items-center justify-center flex-1 p-6 text-slate-400 gap-y-2">
          <Loader2 className="animate-spin size-6 text-violet-600" />
          <span className="text-xs">Chargement des modèles...</span>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center flex-1 p-6 text-center text-slate-500 gap-y-2">
          <AlertTriangle className="size-6 text-amber-500" />
          <p className="text-xs">Impossible de charger les modèles.</p>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-3.5">
          <div className="grid grid-cols-2 gap-2.5">
            {data &&
              data.map((template) => {
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => onClick(template)}
                    aria-label={`Charger le modèle : ${template.name}`}
                    className="group relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 transition-all hover:scale-[1.02] hover:shadow-md hover:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none cursor-pointer"
                  >
                    <Image
                      fill
                      src={template.thumbnail || ""}
                      alt={template.name || "Modèle"}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 360px) 50vw, 180px"
                    />

                    {/* Pro Crown Badge */}
                    {template.isPro && (
                      <div className="absolute top-2 right-2 size-6 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center shadow-xs">
                        <Crown className="size-3.5 fill-amber-400 text-amber-400" />
                      </div>
                    )}

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-left opacity-90 group-hover:opacity-100 transition-opacity">
                      <p className="text-[11px] font-semibold leading-tight truncate">
                        {template.name}
                      </p>
                      <p className="text-[9px] text-white/75 font-mono">
                        {template.width} × {template.height}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </ScrollArea>

      <ToolSidebarClose closeSidebar={onClose} />
    </aside>
  );
};

export default TemplateSideBar;