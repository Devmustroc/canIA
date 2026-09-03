'use client';

import React, { useState } from 'react';
import { ResponderType, useGetTemplates } from "@/features/projects/api/use-get-template";
import { AlertTriangle, Loader2, Sparkles, LayoutGrid } from "lucide-react";
import TemplateCard from "@/app/(dashboard)/_components/template-card";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useRouter } from "next/navigation";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

import { useAuth } from "@clerk/nextjs";

const CATEGORIES = [
  { id: "all", label: "Pour vous" },
  { id: "social", label: "Réseaux sociaux" },
  { id: "presentations", label: "Présentations" },
  { id: "logos", label: "Logos" },
  { id: "ai", label: "Générés par IA" },
];

export const TemplatesSection = () => {
  const { userId } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const paywall = usePaywall();
  const mutation = useCreateProject();
  const { data, isLoading, isError } = useGetTemplates({
    page: "1",
    limit: "8"
  });
  const router = useRouter();

  const onClick = (template: ResponderType['data'][0]) => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    if (template.isPro && paywall.shouldBeBlock) {
      paywall.triggerPaywall();
      return;
    }

    mutation.mutate(
      {
        name: `${template.name} - Copie`,
        json: template.json,
        width: template.width,
        height: template.height
      },
      {
        onSuccess: ({ data }: any) => {
          router.push(`/editor/${data.id}`);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-48 space-y-3">
        <Loader2 size="32" className="animate-spin text-violet-600" />
        <p className="text-xs text-slate-400">Chargement des modèles Canva...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-2">
        <AlertTriangle size="32" className="text-amber-500" />
        <p className="text-sm font-medium text-slate-600">Impossible de charger les modèles</p>
      </div>
    );
  }

  return (
    <div id="templates" className="space-y-6 pt-4">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-x-2">
          <div className="size-8 rounded-xl bg-violet-100 flex items-center justify-center">
            <LayoutGrid className="size-4 text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Commencer avec un modèle
            </h2>
            <p className="text-xs text-slate-500">
              Sélectionnez un modèle prêt à l'emploi pour démarrer rapidement.
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data?.map((template: any, idx: number) => (
          <TemplateCard
            key={template.id}
            title={template.name}
            imageSrc={template.thumbnail || ""}
            onClick={() => onClick(template)}
            disabled={mutation.isPending}
            isPremium={template.isPro || false}
            width={template.width}
            height={template.height}
            priority={idx < 4}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplatesSection;