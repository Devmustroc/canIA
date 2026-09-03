import React from 'react';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
  onClick
}: SidebarItemProps) => {
  const { userId } = useAuth();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (!userId && href !== "/" && href !== "/pricing" && href !== "/templates") {
      e.preventDefault();
      router.push("/sign-in");
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
      <div
        className={cn(
          "flex items-center px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          isActive && "bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-md shadow-violet-200 hover:bg-violet-700 hover:text-white"
        )}
      >
        <Icon
          className={cn(
            "size-5 mr-3 stroke-2",
            isActive ? "text-white" : "text-slate-500 group-hover:text-slate-900"
          )}
        />
        <span className="text-sm">
          {label}
        </span>
      </div>
    </Link>
  );
};

export default SidebarItem;
