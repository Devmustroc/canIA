'use client';

import React, { useState } from "react";
import { 
  Palette, 
  Sparkles, 
  Type, 
  Check, 
  RotateCcw, 
  Copy, 
  Briefcase, 
  Layers,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  useBrandKit, 
  DEFAULT_BRAND_KIT 
} from "@/features/brand-kit/use-brand-kit";
import { fonts } from "@/features/editor/types";
import Link from "next/link";

export default function BrandKitPage() {
  const { brandKit, isLoaded, updateBrandKit, updateColor, updateFont } = useBrandKit();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyHex = (colorHex: string, key: string) => {
    navigator.clipboard.writeText(colorHex);
    setCopiedKey(key);
    toast.success(`Couleur ${colorHex} copiée dans le presse-papier !`);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleReset = () => {
    updateBrandKit(DEFAULT_BRAND_KIT);
    toast.info("Kit de marque réinitialisé aux valeurs par défaut");
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin size-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-x-2 text-violet-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <Briefcase className="size-4" />
            <span>Identité Visuelle</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Brand Kit (Kit de Marque)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configurez vos couleurs, polices et éléments officiels. canAI Copilote les utilisera automatiquement pour vos créations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="text-xs text-slate-600 hover:text-slate-900 border-slate-300"
          >
            <RotateCcw className="size-3.5 mr-1.5" />
            Réinitialiser
          </Button>
          <Link href="/">
            <Button size="sm" className="text-xs bg-violet-600 hover:bg-violet-700 text-white font-medium">
              <span>Aller à l'éditeur</span>
              <ArrowRight className="size-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Settings & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Settings (8 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Brand Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Briefcase className="size-4 text-violet-600" />
              <span>Informations de Marque</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Nom de la marque</label>
                <Input
                  value={brandKit.name}
                  onChange={(e) => updateBrandKit({ name: e.target.value })}
                  placeholder="Ex: My Startup"
                  className="text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Slogan / Tagline</label>
                <Input
                  value={brandKit.tagline}
                  onChange={(e) => updateBrandKit({ tagline: e.target.value })}
                  placeholder="Ex: Révolutionnez votre visuel"
                  className="text-xs rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Color Palette Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Palette className="size-4 text-violet-600" />
                <span>Palette de Couleurs Officielles</span>
              </h2>
              <span className="text-[11px] text-slate-400">Cliquez pour éditer</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary */}
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandKit.colors.primary}
                    onChange={(e) => updateColor("primary", e.target.value)}
                    className="size-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Primaire</p>
                    <p className="text-[11px] font-mono text-slate-500 uppercase">{brandKit.colors.primary}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyHex(brandKit.colors.primary, "primary")}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white"
                  title="Copier le code HEX"
                >
                  {copiedKey === "primary" ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                </button>
              </div>

              {/* Secondary */}
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandKit.colors.secondary}
                    onChange={(e) => updateColor("secondary", e.target.value)}
                    className="size-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Secondaire</p>
                    <p className="text-[11px] font-mono text-slate-500 uppercase">{brandKit.colors.secondary}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyHex(brandKit.colors.secondary, "secondary")}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white"
                >
                  {copiedKey === "secondary" ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                </button>
              </div>

              {/* Accent */}
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandKit.colors.accent}
                    onChange={(e) => updateColor("accent", e.target.value)}
                    className="size-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Accent (CTA)</p>
                    <p className="text-[11px] font-mono text-slate-500 uppercase">{brandKit.colors.accent}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyHex(brandKit.colors.accent, "accent")}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white"
                >
                  {copiedKey === "accent" ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                </button>
              </div>

              {/* Background */}
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandKit.colors.background}
                    onChange={(e) => updateColor("background", e.target.value)}
                    className="size-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Arrière-plan</p>
                    <p className="text-[11px] font-mono text-slate-500 uppercase">{brandKit.colors.background}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyHex(brandKit.colors.background, "background")}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white"
                >
                  {copiedKey === "background" ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Typography Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Type className="size-4 text-violet-600" />
              <span>Typographies de Marque</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Police des Titres (Headings)</label>
                <select
                  value={brandKit.fonts.heading}
                  onChange={(e) => updateFont("heading", e.target.value)}
                  className="w-full text-xs h-9 rounded-xl border border-slate-200 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {fonts.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <div 
                  className="text-lg font-bold text-slate-900 p-3 bg-slate-50 rounded-xl border border-slate-100 truncate mt-2"
                  style={{ fontFamily: brandKit.fonts.heading }}
                >
                  Titre Élégant Exemple
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Police du Corps (Body text)</label>
                <select
                  value={brandKit.fonts.body}
                  onChange={(e) => updateFont("body", e.target.value)}
                  className="w-full text-xs h-9 rounded-xl border border-slate-200 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {fonts.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <div 
                  className="text-xs text-slate-600 p-3 bg-slate-50 rounded-xl border border-slate-100 truncate mt-2 leading-relaxed"
                  style={{ fontFamily: brandKit.fonts.body }}
                >
                  Paragraphe explicatif et détails du contenu rédigé pour votre marque.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mockup / Visual Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-amber-500" />
                <span>Aperçu de Rendu CanIA</span>
              </h3>
              <span className="text-[10px] bg-violet-100 text-violet-700 font-semibold px-2 py-0.5 rounded-full">
                Temps Réel
              </span>
            </div>

            {/* Mockup Display Card */}
            <div 
              className="rounded-3xl p-7 shadow-xl border border-white/20 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[360px]"
              style={{
                backgroundColor: brandKit.colors.background,
                color: brandKit.colors.text,
              }}
            >
              {/* Glow effect */}
              <div 
                className="absolute -right-8 -bottom-8 size-44 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ backgroundColor: brandKit.colors.primary }}
              />
              <div 
                className="absolute -left-8 -top-8 size-44 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: brandKit.colors.secondary }}
              />

              {/* Header inside card */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="size-8 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm"
                    style={{ backgroundColor: brandKit.colors.primary }}
                  >
                    {brandKit.name.slice(0, 1) || "C"}
                  </div>
                  <span className="font-bold text-sm tracking-tight">{brandKit.name}</span>
                </div>
                <span 
                  className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  Brand Pro
                </span>
              </div>

              {/* Content inside card */}
              <div className="relative z-10 my-6 space-y-2">
                <h4 
                  className="text-2xl font-black leading-tight"
                  style={{ fontFamily: brandKit.fonts.heading }}
                >
                  {brandKit.tagline || "Votre identité en un regard"}
                </h4>
                <p 
                  className="text-xs opacity-80 leading-relaxed max-w-[280px]"
                  style={{ fontFamily: brandKit.fonts.body }}
                >
                  Ce visuel adopte automatiquement vos polices de caractère et vos codes couleurs officiels.
                </p>
              </div>

              {/* Footer action inside card */}
              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <div className="size-4 rounded-full shadow" style={{ backgroundColor: brandKit.colors.primary }} />
                  <div className="size-4 rounded-full shadow" style={{ backgroundColor: brandKit.colors.secondary }} />
                  <div className="size-4 rounded-full shadow" style={{ backgroundColor: brandKit.colors.accent }} />
                </div>

                <button 
                  className="px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-transform active:scale-95"
                  style={{ 
                    backgroundColor: brandKit.colors.accent,
                    color: "#ffffff"
                  }}
                >
                  Découvrir
                </button>
              </div>
            </div>

            {/* Instruction box for AI Copilote */}
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4 text-xs text-violet-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-violet-600" />
                <span>canAI Copilote synchronisé</span>
              </div>
              <p className="text-slate-600 leading-normal">
                Dans l'éditeur, demandez simplement à <strong>canAI Copilote</strong> : <br />
                <code className="bg-white/80 px-1.5 py-0.5 rounded text-violet-700 font-mono text-[11px]">
                  "Applique mon Brand Kit"
                </code> et le canvas s'harmonisera aussitôt !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
