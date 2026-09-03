'use client';

import React, { useState } from 'react';
import UserButton from "@/features/auth/components/user-button";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Wand2 } from "lucide-react";
import CustomSizeModal from "@/app/(dashboard)/_components/custom-size-modal";
import Logo from "@/app/(dashboard)/_components/logo";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Navbar = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateClick = () => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <CustomSizeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <nav className="w-full flex items-center justify-between h-16 px-6 border-b bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-x-4">
          <div className="block lg:hidden">
            <Logo />
          </div>
          <div className="hidden md:flex items-center gap-x-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            <Sparkles className="size-3.5 text-violet-600 fill-violet-600" />
            <span>Workspace CanIA Pro</span>
          </div>
        </div>

        <div className="flex items-center gap-x-3">
          <Button
            onClick={handleCreateClick}
            size="sm"
            className="rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white font-medium shadow-md shadow-violet-200 transition"
          >
            <Plus className="size-4 mr-1.5" />
            Créer un design
          </Button>

          <div className="pl-2 border-l border-slate-200">
            {userId ? (
              <UserButton />
            ) : (
              <Button asChild size="sm" variant="ghost" className="text-xs font-semibold text-violet-700 hover:bg-violet-50 rounded-xl">
                <Link href="/sign-in">Se connecter</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;