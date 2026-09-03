'use client';

import React, { useState, useMemo } from 'react';
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSidebarHeader from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-sidebar-close";
import { ActiveTool, EditorProps } from "../../types";
import { useGetImages } from "@/features/images/api/use-get-images";
import { AlertTriangle, Loader2, Search, Upload, Sparkles } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { UploadButton } from "@/lib/uploadthing";
import { Input } from "@/components/ui/input";

interface ImageSideBarProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const CATEGORIES = [
  "Tous",
  "Nature",
  "Bureau & Tech",
  "Architecture",
  "Minimaliste",
  "Textures",
];

const ImageSideBar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ImageSideBarProps) => {
  const { data, isLoading, isError } = useGetImages();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const filteredImages = useMemo(() => {
    if (!data) return [];
    let list: Array<any> = [...data];

    if (selectedCategory !== "Tous") {
      const catLower = selectedCategory.toLowerCase();
      const filtered = list.filter((img) =>
        Boolean(img?.alt_description && String(img.alt_description).toLowerCase().includes(catLower))
      );
      if (filtered.length > 0) {
        list = filtered;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((img) =>
        Boolean(
          (img?.alt_description && String(img.alt_description).toLowerCase().includes(q)) ||
          (img?.user?.name && String(img.user.name).toLowerCase().includes(q))
        )
      );
    }

    return list;
  }, [data, searchQuery, selectedCategory]);

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col shadow-sm",
        activeTool === "images" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Photos & Médias"
        description="Photos haute définition libres de droits Unsplash"
      />

      {/* Upload Zone */}
      <div className="p-3.5 border-b bg-slate-50/50">
        <UploadButton
          appearance={{
            button:
              "w-full h-10 text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow transition duration-200",
            allowedContent: "hidden",
          }}
          content={{
            button: "Importer une image depuis l'appareil",
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res?.[0]?.url) {
              editor?.addImage(res[0].url);
            }
          }}
        />

        {/* Search Input */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des photos..."
            className="h-9 pl-9 text-xs rounded-xl border-slate-200 bg-white focus-visible:ring-violet-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "text-[11px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition",
                selectedCategory === cat
                  ? "bg-violet-600 text-white shadow-2xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center flex-1 p-6 text-slate-400 gap-y-2">
          <Loader2 className="animate-spin size-6 text-violet-600" />
          <span className="text-xs">Chargement de la photothèque...</span>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center flex-1 p-6 text-center text-slate-500 gap-y-2">
          <AlertTriangle className="size-6 text-amber-500" />
          <p className="text-xs">Impossible de contacter la bibliothèque d&apos;images.</p>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-3.5">
          <div className="grid grid-cols-2 gap-2">
            {filteredImages.map((image, idx) => {
              return (
                <div
                  key={image.id}
                  onClick={() => editor?.addImage(image.urls.regular)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      editor?.addImage(image.urls.regular);
                    }
                  }}
                  aria-label={`Ajouter la photo : ${image.alt_description || "photo libre de droits"}`}
                  className={cn(
                    "relative w-full h-[140px] group hover:opacity-95 transition bg-slate-100 rounded-xl overflow-hidden border border-slate-200/80 cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none",
                    idx % 5 === 0 && "col-span-2 h-[180px]"
                  )}
                >
                  <Image
                    fill
                    src={image.urls.small}
                    alt={image.alt_description || "Photo de galerie"}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 360px) 50vw, 180px"
                  />
                  <Link
                    href={(image as any).links?.html || image.urls.regular}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 truncate absolute bottom-0 left-0 w-full h-7 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 flex items-center justify-between transition-opacity duration-200"
                  >
                    <span className="truncate">{image.user?.name}</span>
                    <span className="text-[9px] text-white/75 font-mono">Unsplash</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      <ToolSidebarClose closeSidebar={onClose} />
    </aside>
  );
};

export default ImageSideBar;