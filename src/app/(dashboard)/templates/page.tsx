'use client';

import React, { useState, useMemo } from 'react';
import { ResponderType, useGetTemplates } from "@/features/projects/api/use-get-template";
import { 
  LayoutTemplate, 
  Search, 
  Sparkles, 
  Loader2, 
  AlertTriangle, 
  SlidersHorizontal,
  Crown,
  Layers,
  ArrowRight
} from "lucide-react";
import TemplateCard from "@/app/(dashboard)/_components/template-card";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useRouter } from "next/navigation";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TEMPLATE_CATEGORIES = [
  { id: "all", label: "Tous les modèles" },
  { id: "social", label: "Réseaux Sociaux", keywords: ["instagram", "post", "story", "facebook", "tiktok"] },
  { id: "presentations", label: "Présentations", keywords: ["presentation", "slide", "pitch", "deck"] },
  { id: "logos", label: "Logos & Identité", keywords: ["logo", "brand", "identity"] },
  { id: "marketing", label: "Marketing & Pubs", keywords: ["flyer", "affiche", "banner", "ad", "pub"] },
  { id: "docs", label: "Documents & CV", keywords: ["cv", "resume", "doc", "invoice"] },
];

import { useAuth } from "@clerk/nextjs";

export default function TemplatesPage() {
  const { userId } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterOnlyPro, setFilterOnlyPro] = useState<boolean | null>(null);

  const paywall = usePaywall();
  const mutation = useCreateProject();
  const router = useRouter();

  const { data, isLoading, isError } = useGetTemplates({
    page: "1",
    limit: "50",
  });

  const handleSelectTemplate = (template: ResponderType['data'][0]) => {
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
        height: template.height,
      },
      {
        onSuccess: ({ data }: any) => {
          router.push(`/editor/${data.id}`);
        },
      }
    );
  };

  // Filter templates
  const filteredTemplates = useMemo(() => {
    if (!data) return [];

    return data.filter((template: any) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = template.name.toLowerCase().includes(query);
        if (!matchesName) return false;
      }

      // 2. Category
      if (selectedCategory !== "all") {
        const categoryObj = TEMPLATE_CATEGORIES.find((c) => c.id === selectedCategory);
        if (categoryObj && categoryObj.keywords) {
          const nameLower = template.name.toLowerCase();
          const matchesKeyword = categoryObj.keywords.some((kw) => nameLower.includes(kw));
          if (!matchesKeyword) return false;
        }
      }

      // 3. Pro / Free Filter
      if (filterOnlyPro === true && !template.isPro) return false;
      if (filterOnlyPro === false && template.isPro) return false;

      return true;
    });
  }, [data, searchQuery, selectedCategory, filterOnlyPro]);

  return (
    <div className="max-w-screen-2xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-800 p-8 md:p-12 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 size-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 size-72 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300">
            <Sparkles className="size-3.5" />
            <span>Catalogue CanIA Pro & Gratuit</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Explorez des modèles prêts à sublimer vos projets
          </h1>
          <p className="text-sm md:text-base text-white/80">
            Choisissez un modèle conçu par des designers, personnalisez-le avec notre éditeur et laissez canAI Copilote adapter les textes et couleurs à vos besoins.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              id="template-search"
              aria-label="Rechercher un modèle de design"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un modèle (Instagram, Affiche, CV, YouTube...)"
              className="pl-10 text-xs rounded-xl border-slate-200 focus-visible:ring-violet-500 h-10"
            />
          </div>

          {/* Pro / Free Toggle Pills */}
          <div className="flex items-center gap-1.5 self-start md:self-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterOnlyPro(null)}
              className={`text-xs rounded-xl h-8 px-3 ${
                filterOnlyPro === null ? "bg-slate-900 text-white hover:bg-slate-800" : "text-slate-600"
              }`}
            >
              Tous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterOnlyPro(false)}
              className={`text-xs rounded-xl h-8 px-3 ${
                filterOnlyPro === false ? "bg-slate-900 text-white hover:bg-slate-800" : "text-slate-600"
              }`}
            >
              Gratuits
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterOnlyPro(true)}
              className={`text-xs rounded-xl h-8 px-3 flex items-center gap-1 ${
                filterOnlyPro === true ? "bg-amber-500 text-white hover:bg-amber-600" : "text-amber-700 bg-amber-50 hover:bg-amber-100"
              }`}
            >
              <Crown className="size-3" />
              <span>Pro</span>
            </Button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100 no-scrollbar">
          {TEMPLATE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition whitespace-nowrap ${
                selectedCategory === category.id
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <Loader2 size="36" className="animate-spin text-violet-600" />
          <p className="text-xs text-slate-500">Chargement de la bibliothèque de modèles...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 space-y-2">
          <AlertTriangle size="36" className="text-amber-500" />
          <p className="text-sm font-semibold text-slate-700">Impossible de charger les modèles</p>
        </div>
      )}

      {/* Grid or Empty Results */}
      {!isLoading && !isError && (
        <>
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>{filteredTemplates.length} modèle{filteredTemplates.length > 1 ? "s" : ""} disponible{filteredTemplates.length > 1 ? "s" : ""}</span>
          </div>

          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTemplates.map((template: any) => (
                <TemplateCard
                  key={template.id}
                  title={template.name}
                  imageSrc={template.thumbnail || ""}
                  onClick={() => handleSelectTemplate(template)}
                  disabled={mutation.isPending}
                  description={`${template.width} x ${template.height} px`}
                  width={template.width}
                  height={template.height}
                  isPremium={template.isPro || false}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center space-y-3">
              <LayoutTemplate className="size-10 text-slate-300" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">Aucun modèle trouvé</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Essayez avec un autre mot-clé ou réinitialisez vos filtres de recherche.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setFilterOnlyPro(null);
                }}
                className="text-xs rounded-xl"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
