'use client';

import React from 'react';
import {
  BrainCircuit, 
  LayoutGrid, 
  CaseUpper, 
  Paintbrush, 
  Component, 
  Images, 
  Wand2, 
  FolderUp, 
  Smile, 
  SquareStack, 
  SlidersHorizontal,
  QrCode,
  Frame,
  Palette,
  BarChart3,
  PlayCircle,
  History,
} from "lucide-react";
import { ActiveTool } from "../types";
import SidebarItem from "./sidebar-item";

interface SideBarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const SideBar = ({
  activeTool,
  onChangeActiveTool,
}: SideBarProps) => {
  return (
    <aside className="bg-white/95 backdrop-blur-md flex flex-col w-[80px] h-full border-r border-slate-200/80 overflow-y-auto no-scrollbar shrink-0 select-none z-30 shadow-xs">
      <div className="flex flex-col py-2.5 px-1 space-y-1">
        {/* AI & Core Studio */}
        <SidebarItem
          label="Agent IA"
          icon={BrainCircuit}
          onClick={() => onChangeActiveTool("agent")}
          isActive={activeTool === "agent"}
          hasBadge
        />
        <SidebarItem
          label="Modèles"
          icon={LayoutGrid}
          onClick={() => onChangeActiveTool("templates")}
          isActive={activeTool === "templates"}
        />

        {/* Separator */}
        <div className="py-1 px-2.5">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        {/* Content Creation */}
        <SidebarItem
          label="Texte"
          icon={CaseUpper}
          onClick={() => onChangeActiveTool("text")}
          isActive={activeTool === "text"}
        />
        <SidebarItem
          label="Dessin"
          icon={Paintbrush}
          onClick={() => onChangeActiveTool("draw")}
          isActive={activeTool === "draw"}
        />
        <SidebarItem
          label="Formes"
          icon={Component}
          onClick={() => onChangeActiveTool("shapes")}
          isActive={activeTool === "shapes"}
        />
        <SidebarItem
          label="Cadres"
          icon={Frame}
          onClick={() => onChangeActiveTool("frames")}
          isActive={activeTool === "frames"}
        />

        {/* Separator */}
        <div className="py-1 px-2.5">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        {/* Media & AI Assets */}
        <SidebarItem
          label="Photos"
          icon={Images}
          onClick={() => onChangeActiveTool("images")}
          isActive={activeTool === "images"}
        />
        <SidebarItem
          label="Générer IA"
          icon={Wand2}
          onClick={() => onChangeActiveTool("ai")}
          isActive={activeTool === "ai"}
          hasBadge
        />
        <SidebarItem
          label="Fichiers"
          icon={FolderUp}
          onClick={() => onChangeActiveTool("upload")}
          isActive={activeTool === "upload"}
        />
        <SidebarItem
          label="Stickers"
          icon={Smile}
          onClick={() => onChangeActiveTool("sticker")}
          isActive={activeTool === "sticker"}
        />
        <SidebarItem
          label="QR Code"
          icon={QrCode}
          onClick={() => onChangeActiveTool("qrcode")}
          isActive={activeTool === "qrcode"}
        />
        <SidebarItem
          label="Marque"
          icon={Palette}
          onClick={() => onChangeActiveTool("brand")}
          isActive={activeTool === "brand"}
        />
        <SidebarItem
          label="Graphiques"
          icon={BarChart3}
          onClick={() => onChangeActiveTool("charts")}
          isActive={activeTool === "charts"}
        />
        <SidebarItem
          label="Animation"
          icon={PlayCircle}
          onClick={() => onChangeActiveTool("animation")}
          isActive={activeTool === "animation"}
        />
        <SidebarItem
          label="Historique"
          icon={History}
          onClick={() => onChangeActiveTool("history")}
          isActive={activeTool === "history"}
        />

        {/* Separator */}
        <div className="py-1 px-2.5">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        {/* Layers & Settings */}
        <SidebarItem
          label="Calques"
          icon={SquareStack}
          onClick={() => onChangeActiveTool("layers")}
          isActive={activeTool === "layers"}
        />
        <SidebarItem
          label="Réglages"
          icon={SlidersHorizontal}
          onClick={() => onChangeActiveTool("settings")}
          isActive={activeTool === "settings"}
        />
      </div>
    </aside>
  );
};

export default SideBar;