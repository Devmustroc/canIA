'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { EditorProps } from '../types';
import { 
  X, 
  Download, 
  Sun, 
  Moon, 
  Maximize, 
  Sparkles,
  Presentation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PresentationModalProps {
  editor: EditorProps | undefined;
  isOpen: boolean;
  onClose: () => void;
  designName?: string;
}

export const PresentationModal = ({
  editor,
  isOpen,
  onClose,
  designName = "Design CanIA",
}: PresentationModalProps) => {
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [isLightMode, setIsLightMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !editor?.canvas) {
      setSnapshotUrl(null);
      return;
    }

    try {
      const workspace = editor.getWorkSpace() as fabric.Rect | undefined;
      if (!workspace) return;

      // Temporarily detach canvas-level clipPath (workspace bounds) to prevent drawClipPathOnCanvas 0-dim cache crashes
      const prevCanvasClipPath = editor.canvas.clipPath;
      editor.canvas.clipPath = undefined;

      // Sanitize object-level clipPaths (image frame masks)
      editor.canvas.getObjects().forEach((obj) => {
        if (obj.clipPath) {
          const cp = obj.clipPath;
          if (!cp.width || cp.width <= 0) cp.width = obj.width || 100;
          if (!cp.height || cp.height <= 0) cp.height = obj.height || 100;
          if (!cp.scaleX || cp.scaleX <= 0) cp.scaleX = 1;
          if (!cp.scaleY || cp.scaleY <= 0) cp.scaleY = 1;
          cp.setCoords();
          // @ts-ignore
          if (typeof cp._createCacheCanvas === "function" && (!cp._cacheCanvas || cp._cacheCanvas.width === 0 || cp._cacheCanvas.height === 0)) {
            // @ts-ignore
            cp._createCacheCanvas();
          }
        }
      });

      editor.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataUrl = editor.canvas.toDataURL({
        format: "png",
        quality: 1,
        width: workspace.width,
        height: workspace.height,
        left: workspace.left,
        top: workspace.top,
      });

      // Restore canvas-level clipPath
      editor.canvas.clipPath = prevCanvasClipPath;

      setSnapshotUrl(dataUrl);
      editor.autoZoom();
    } catch (err) {
      console.error("Presentation snapshot error:", err);
      toast.error("Impossible de générer l'aperçu de présentation.");
    }
  }, [isOpen, editor]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-screen h-screen z-[999999] flex flex-col items-center justify-between p-6 select-none bg-slate-950 text-white overflow-hidden transition-all animate-in fade-in duration-200">
      {/* Top Floating Bar */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-2xl">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-full bg-violet-500/30 border border-violet-400/40 flex items-center justify-center">
            <Presentation className="size-4 text-violet-300" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-tight">{designName}</h3>
            <p className="text-[10px] text-white/60">Mode Présentation • Appuyez sur Échap pour quitter</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle backdrop color */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsLightMode(!isLightMode)}
            className="text-white hover:bg-white/15 text-xs h-8 px-2.5 rounded-full"
            title={isLightMode ? "Fond sombre" : "Fond clair"}
          >
            {isLightMode ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
          </Button>

          {/* Quick Download */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor?.saveAsPng()}
            className="text-white hover:bg-white/15 text-xs h-8 px-3 rounded-full gap-1.5"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Télécharger PNG</span>
          </Button>

          {/* Close */}
          <Button
            size="sm"
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 text-white font-medium text-xs h-8 px-3.5 rounded-full"
          >
            <X className="size-3.5 mr-1" />
            <span>Quitter</span>
          </Button>
        </div>
      </div>

      {/* Main Presentation Viewport */}
      <div 
        className={`flex-1 w-full max-w-5xl my-6 rounded-3xl p-6 flex items-center justify-center transition-colors duration-300 overflow-hidden shadow-2xl border ${
          isLightMode ? "bg-slate-100 border-slate-300/40" : "bg-black/40 border-white/10"
        }`}
      >
        {snapshotUrl ? (
          <img
            src={snapshotUrl}
            alt={designName}
            className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl transition-transform hover:scale-[1.01] duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 text-white/50">
            <div className="animate-spin size-8 border-2 border-white border-t-transparent rounded-full" />
            <p className="text-xs">Chargement de la diapositive...</p>
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="text-[11px] text-white/40 flex items-center gap-2">
        <Sparkles className="size-3 text-amber-400" />
        <span>Astuce : Utilisez ce mode pour projeter votre création ou capturer des présentations impeccables.</span>
      </div>
    </div>,
    document.body
  );
};

export default PresentationModal;
