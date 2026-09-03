import React from 'react';
import { ChevronsLeft } from "lucide-react";

interface ToolSidebarCloseProps {
  closeSidebar?: () => void;
  onClick?: () => void;
}

const ToolSidebarClose = ({ closeSidebar, onClick }: ToolSidebarCloseProps) => {
  const handleClose = onClick || closeSidebar;

  return (
    <button
      onClick={handleClose}
      className="absolute -right-[2.05rem] h-[64px] top-1/2 p-2 bg-white transform -translate-y-1/2 flex items-center justify-center rounded-r-xl border-r border-y shadow-sm group hover:bg-slate-50 transition z-50"
    >
      <ChevronsLeft className="size-4 text-slate-600 group-hover:text-slate-900 group-hover:-translate-x-0.5 transition-all duration-200" />
    </button>
  );
};

export default ToolSidebarClose;