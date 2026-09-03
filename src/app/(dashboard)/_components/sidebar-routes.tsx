'use client';

import React from 'react';
import { 
  Home, 
  FolderKanban, 
  LayoutTemplate, 
  Sparkles, 
  CreditCard, 
  HelpCircle, 
  Crown,
  Wand2,
  Palette
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SidebarItem from "@/app/(dashboard)/_components/sidebar-item";
import { usePathname } from "next/navigation";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/features/subscriptions/hooks/use-checkout";
import { useBilling } from "@/features/subscriptions/hooks/use-billing";

export const SidebarRoutes = () => {
  const { shouldBeBlock, triggerPaywall, isLoading } = usePaywall();
  const billingMutation = useBilling();
  const mutation = useCheckout();
  const pathname = usePathname();

  const handleBillingClick = () => {
    if (shouldBeBlock) {
      triggerPaywall();
      return;
    }
    billingMutation.mutate();
  };

  return (
    <div className="flex flex-col flex-1 justify-between p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Main Navigation */}
        <div className="space-y-1">
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Navigation
          </span>
          <SidebarItem
            href="/"
            icon={Home}
            label="Accueil"
            isActive={pathname === "/"}
          />
          <SidebarItem
            href="/templates"
            icon={LayoutTemplate}
            label="Modèles Canva"
            isActive={pathname === "/templates"}
          />
          <SidebarItem
            href="/brand-kit"
            icon={Palette}
            label="Kit de Marque"
            isActive={pathname === "/brand-kit"}
          />
          <SidebarItem
            href="/#projects"
            icon={FolderKanban}
            label="Vos Projets"
            isActive={false}
          />
        </div>

        <Separator className="bg-slate-100" />

        {/* AI & Utilities */}
        <div className="space-y-1">
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Outils & Abonnements
          </span>
          <SidebarItem
            href="/pricing"
            icon={Crown}
            label="Tarifs & Offres"
            isActive={pathname === "/pricing"}
          />
          <SidebarItem
            href={pathname}
            icon={CreditCard}
            label="Facturation Stripe"
            onClick={handleBillingClick}
          />
          <SidebarItem
            href="mailto:elmustapha.abourar@gmail.com"
            icon={HelpCircle}
            label="Aide & Support"
          />
        </div>
      </div>

      {/* Canva Pro Banner at Bottom */}
      {shouldBeBlock && !isLoading && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-4 text-white shadow-lg mt-6">
          <div className="absolute -right-4 -bottom-4 size-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-x-2 mb-2">
            <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Crown className="size-4 text-amber-300 fill-amber-300" />
            </div>
            <span className="text-xs font-bold tracking-wide uppercase">CanIA Magic Pro</span>
          </div>

          <p className="text-xs text-white/80 mb-3 leading-snug">
            Débloquez la génération d'images par IA illimitée, les stickers et l'effacement de fond.
          </p>

          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="w-full rounded-xl bg-white hover:bg-slate-100 text-violet-900 font-semibold text-xs h-9 shadow"
          >
            <Sparkles className="size-3.5 mr-1.5 text-amber-500 fill-amber-500" />
            Passer à CanIA Pro
          </Button>
        </div>
      )}
    </div>
  );
};

export default SidebarRoutes;