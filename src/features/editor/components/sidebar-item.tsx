'use client';

import React from 'react';
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  isActive?: boolean;
  icon: LucideIcon;
  onClick: () => void;
  hasBadge?: boolean;
}

const SidebarItem = ({
  label,
  isActive,
  icon: Icon,
  onClick,
  hasBadge,
}: SidebarItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      className="group relative w-full flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 cursor-pointer focus-visible:outline-none"
    >
      {/* Icon Squircle Container */}
      <div
        className={cn(
          "relative size-10 rounded-2xl flex items-center justify-center transition-all duration-300",
          isActive
            ? "bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-violet-500/35 scale-105"
            : "bg-slate-100/70 text-slate-600 group-hover:bg-violet-50 group-hover:text-violet-700 group-hover:scale-105 group-hover:shadow-2xs"
        )}
      >
        <Icon
          className={cn(
            "size-5 transition-transform duration-200",
            isActive
              ? "stroke-[2.2] text-white"
              : "stroke-[1.8] group-hover:stroke-[2.1]"
          )}
        />

        {/* Pulsing Glowing AI Badge */}
        {hasBadge && (
          <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-2.5 bg-gradient-to-r from-amber-400 to-amber-500 ring-2 ring-white" />
          </span>
        )}
      </div>

      {/* Label Text */}
      <span
        className={cn(
          "mt-1 text-[10px] tracking-tight text-center px-0.5 leading-tight w-full truncate transition-colors duration-200",
          isActive
            ? "text-violet-700 font-bold"
            : "text-slate-500 font-medium group-hover:text-slate-900 group-hover:font-semibold"
        )}
      >
        {label}
      </span>
    </button>
  );
};

export default SidebarItem;