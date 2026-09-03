'use client';

import React, { useState } from 'react';
import { 
  Crown, 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/features/subscriptions/hooks/use-checkout";
import { useBilling } from "@/features/subscriptions/hooks/use-billing";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import Link from "next/link";

const FAQS = [
  {
    q: "Puis-je annuler mon abonnement à tout moment ?",
    a: "Oui, absolument. Vous pouvez résilier votre abonnement en un clic depuis votre espace Facturation. Vous continuerez de bénéficier de CanIA Pro jusqu'à la fin de votre période de facturation.",
  },
  {
    q: "Mes créations m'appartiennent-elles à 100% ?",
    a: "Oui, vous disposez d'une licence commerciale complète sur tous les designs, images générées par IA et exports que vous réalisez sur CanIA.",
  },
  {
    q: "Quels sont les formats d'export inclus dans CanIA Pro ?",
    a: "Les membres Pro ont accès à tous les formats sans restriction : PNG transparent haute définition, JPG optimisé, SVG vectoriel pour graphistes et PDF haute résolution prêt pour l'impression.",
  },
  {
    q: "Comment fonctionne canAI Copilote ?",
    a: "canAI Copilote est connecté directement à votre canvas. Vous pouvez lui parler au micro ou par écrit pour générer des éléments, harmoniser vos couleurs ou appliquer votre Brand Kit en quelques secondes.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { shouldBeBlock, isLoading } = usePaywall();
  const checkoutMutation = useCheckout();
  const billingMutation = useBilling();

  const handleSubscribe = () => {
    if (!shouldBeBlock) {
      billingMutation.mutate();
    } else {
      checkoutMutation.mutate();
    }
  };

  const isPending = checkoutMutation.isPending || billingMutation.isPending;

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-20 pt-4">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 text-violet-700 font-semibold text-xs tracking-wide">
          <Sparkles className="size-3.5 text-amber-500 fill-amber-500" />
          <span>Investissez dans votre créativité</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Des tarifs simples pour des designs spectaculaires
        </h1>
        <p className="text-sm md:text-base text-slate-500">
          Démarrez gratuitement, passez à la vitesse supérieure avec les super-pouvoirs de l'IA et créez sans aucune limite.
        </p>

        {/* Toggle Annual / Monthly */}
        <div className="flex items-center justify-center pt-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                !isAnnual ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Facturation Mensuelle
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                isAnnual ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Annuelle</span>
              <span className="bg-emerald-100 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        
        {/* Free Plan Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">CanIA Gratuit</h3>
              <p className="text-xs text-slate-500">Idéal pour découvrir l'éditeur et créer vos premiers visuels.</p>
            </div>

            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">0 €</span>
                <span className="text-xs text-slate-400 font-medium">/ pour toujours</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-3">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ce qui est inclus :</p>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500 shrink-0" />
                  <span>Éditeur complet Fabric.js (formes, textes, filtres)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500 shrink-0" />
                  <span>Exports en PNG et JPG standard</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500 shrink-0" />
                  <span>Gestion des calques et zoom infini</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-500 shrink-0" />
                  <span>Accès aux modèles gratuits de la communauté</span>
                </li>
              </ul>
            </div>
          </div>

          <Link href="/">
            <Button variant="outline" className="w-full rounded-2xl h-11 text-xs font-semibold border-slate-300">
              Continuer gratuitement
            </Button>
          </Link>
        </div>

        {/* Pro Plan Card (Featured) */}
        <div className="relative rounded-3xl p-8 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-800 text-white shadow-2xl shadow-violet-900/20 flex flex-col justify-between space-y-6 overflow-hidden border border-white/20">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-amber-400 text-slate-950 font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow">
              Le plus populaire
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Crown className="size-5 text-amber-300 fill-amber-300" />
                <h3 className="text-xl font-bold">CanIA Magic Pro</h3>
              </div>
              <p className="text-xs text-white/80">Pour les créateurs, freelances et marques qui veulent l'excellence.</p>
            </div>

            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{isAnnual ? "15 €" : "19 €"}</span>
                <span className="text-xs text-white/70 font-medium">/ mois {isAnnual && "(facturé annuellement)"}</span>
              </div>
            </div>

            <div className="border-t border-white/20 pt-6 space-y-3">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Tout le Gratuit, plus :</p>
              <ul className="space-y-2.5 text-xs text-white/90">
                <li className="flex items-center gap-2 font-medium">
                  <Sparkles className="size-4 text-amber-300 shrink-0" />
                  <span><strong>canAI Copilote</strong> interactif & dictée vocale illimités</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-300 shrink-0" />
                  <span><strong>Effacement de fond IA</strong> en 1 clic</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-300 shrink-0" />
                  <span><strong>Génération d'images IA</strong> photoréalistes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-300 shrink-0" />
                  <span><strong>Export PDF Haute Définition</strong> (prêt pour impression)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-300 shrink-0" />
                  <span><strong>Export SVG vectoriel</strong> & format JSON complet</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-300 shrink-0" />
                  <span><strong>Brand Kit officiel</strong> appliqué en 1 clic</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-300 shrink-0" />
                  <span>Accès illimité à tous les modèles Pro</span>
                </li>
              </ul>
            </div>
          </div>

          <Button
            onClick={handleSubscribe}
            disabled={isPending}
            className="w-full rounded-2xl h-11 text-xs font-bold bg-white hover:bg-slate-100 text-violet-900 shadow-xl transition-transform active:scale-95"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin text-violet-900 mr-2" />
            ) : (
              <Crown className="size-4 text-amber-500 fill-amber-500 mr-2" />
            )}
            {!shouldBeBlock ? "Gérer mon abonnement" : "Passer à CanIA Pro"}
          </Button>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-3xl mx-auto space-y-6 pt-8">
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-bold text-slate-900">Questions Fréquentes</h3>
          <p className="text-xs text-slate-500">Tout ce que vous devez savoir avant de commencer.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left font-semibold text-xs md:text-sm text-slate-800"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="size-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="size-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-slate-500 mt-2.5 pt-2.5 border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
