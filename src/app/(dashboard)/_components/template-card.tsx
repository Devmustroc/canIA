import React from 'react';
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Crown, Wand2 } from "lucide-react";

interface TemplateCardProps {
  imageSrc: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  description?: string;
  width: number;
  height: number;
  isPremium?: boolean;
  priority?: boolean;
}

const TemplateCard = ({
  imageSrc,
  title,
  onClick,
  disabled,
  width,
  height,
  isPremium,
  priority = false,
}: TemplateCardProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group text-left transition flex flex-col space-y-2 rounded-2xl p-2 bg-white border border-slate-100 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-900/5",
        disabled ? "cursor-not-allowed opacity-75" : "cursor-pointer"
      )}
    >
      <div
        style={{ aspectRatio: `${width}/${height}` }}
        className="relative rounded-xl h-full w-full overflow-hidden bg-slate-100 border border-slate-100"
      >
        {imageSrc ? (
          <Image
            fill
            src={imageSrc}
            alt={title}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            quality={70}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-100 via-indigo-50 to-cyan-50 flex items-center justify-center">
            <span className="text-xs font-semibold text-slate-400">CanIA Design</span>
          </div>
        )}

        {isPremium && (
          <div className="absolute top-2.5 right-2.5 size-7 flex items-center justify-center bg-amber-500 text-white rounded-full shadow-md z-10">
            <Crown className="size-3.5 fill-white text-white" />
          </div>
        )}

        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute inset-0 bg-violet-950/40 backdrop-blur-[2px] flex items-center justify-center p-3">
          <span className="px-3.5 py-2 rounded-xl bg-white text-violet-900 font-semibold text-xs shadow-lg flex items-center gap-x-1.5 transform group-hover:scale-105 transition-transform">
            <Wand2 className="size-3.5 text-violet-600" />
            Créer avec ce modèle
          </span>
        </div>
      </div>

      <div className="px-1 py-0.5 flex flex-col">
        <span className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-violet-700 transition">
          {title}
        </span>
        <span className="text-[10px] text-slate-400 font-mono">
          {width} x {height} px
        </span>
      </div>
    </button>
  );
};

export default TemplateCard;