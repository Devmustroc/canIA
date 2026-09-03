'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { cn } from "@/lib/utils";
import { ActiveTool, EditorProps } from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSidebarClose from "./tool-sidebar-close";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Globe, Wifi, Link2, Sparkles, Loader2 } from "lucide-react";
import ColorPicker from "./color-picker";

interface QrcodeSidebarProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const QrcodeSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: QrcodeSidebarProps) => {
  const [url, setUrl] = useState("https://cania.app");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Quick preset templates
  const presets = [
    { label: "Site Web", icon: Globe, defaultVal: "https://cania.app" },
    { label: "Wi-Fi", icon: Wifi, defaultVal: "WIFI:S:MonReseau;T:WPA;P:MotDePasse;;" },
    { label: "Lien court", icon: Link2, defaultVal: "https://link.cania.app/promo" },
  ];

  // Update real-time preview
  useEffect(() => {
    if (!url.trim()) {
      setPreviewUrl("");
      return;
    }

    let isMounted = true;
    QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then((dataUrl) => {
        if (isMounted) setPreviewUrl(dataUrl);
      })
      .catch(() => {
        if (isMounted) setPreviewUrl("");
      });

    return () => {
      isMounted = false;
    };
  }, [url, fgColor, bgColor]);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const handleAddQrCode = async () => {
    if (!url.trim() || !editor) return;

    setIsLoading(true);
    try {
      await editor.addQrCode(url, { fgColor, bgColor });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col transition-all",
        activeTool === "qrcode" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Générateur de QR Code"
        description="Créez des QR codes scannables et personnalisés"
      />

      <ScrollArea className="flex-1 p-4 space-y-5">
        {/* Presets */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-700">Raccourcis & Modèles</Label>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setUrl(preset.defaultVal)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-violet-50 hover:border-violet-300 transition text-slate-700 hover:text-violet-900 group"
                  )}
                >
                  <Icon className="size-4 mb-1 text-slate-500 group-hover:text-violet-600" />
                  <span className="text-[11px] font-medium">{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* URL / Text Input */}
        <div className="space-y-2 pt-2">
          <Label htmlFor="qr-url-input" className="text-xs font-semibold text-slate-700">
            Contenu du QR Code (URL ou Texte)
          </Label>
          <Input
            id="qr-url-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://votre-site.com"
            className="h-10 text-xs rounded-lg border-slate-200 focus-visible:ring-violet-500"
          />
        </div>

        {/* Color Customization */}
        <div className="space-y-3 pt-2">
          <Label className="text-xs font-semibold text-slate-700">Couleurs du QR Code</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-slate-500">Modules (Avant-plan)</span>
              <ColorPicker value={fgColor} onChange={setFgColor} />
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-slate-500">Arrière-plan</span>
              <ColorPicker value={bgColor} onChange={setBgColor} />
            </div>
          </div>
        </div>

        {/* Realtime Live Preview */}
        <div className="space-y-2 pt-3">
          <Label className="text-xs font-semibold text-slate-700">Aperçu en temps réel</Label>
          <div className="flex items-center justify-center min-h-[160px] p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Aperçu QR Code"
                className="size-36 rounded-lg object-contain shadow-xs bg-white p-1"
              />
            ) : (
              <div className="flex flex-col items-center text-slate-400 space-y-1">
                <QrCode className="size-8" />
                <span className="text-xs">Saisissez du texte pour prévisualiser</span>
              </div>
            )}
          </div>
        </div>

        {/* Add to Canvas Action */}
        <div className="pt-4">
          <Button
            onClick={handleAddQrCode}
            disabled={!url.trim() || isLoading}
            className="w-full h-10 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-xl shadow-sm gap-2"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="size-4" />
                Ajouter au Canvas
              </>
            )}
          </Button>
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

export default QrcodeSidebar;
