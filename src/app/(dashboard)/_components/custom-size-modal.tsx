'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight } from "lucide-react";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useRouter } from "next/navigation";

interface CustomSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomSizeModal = ({ isOpen, onClose }: CustomSizeModalProps) => {
  const [width, setWidth] = useState<number>(1080);
  const [height, setHeight] = useState<number>(1080);
  const [name, setName] = useState<string>("Custom Design");
  const mutation = useCreateProject();
  const router = useRouter();

  const handleCreate = () => {
    mutation.mutate(
      {
        name: name || "Custom Design",
        json: "",
        width: Number(width) || 1080,
        height: Number(height) || 1080,
      },
      {
        onSuccess: ({ data }) => {
          onClose();
          router.push(`/editor/${data.id}`);
        },
      }
    );
  };

  const handlePresetSelect = (w: number, h: number, label: string) => {
    setWidth(w);
    setHeight(h);
    setName(label);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[460px] rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-x-2 text-violet-600 mb-1">
            <Sparkles className="size-5" />
            <span className="text-xs font-bold tracking-wider uppercase">CanIA Format Studio</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Custom dimensions
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Enter width and height to start creating your personalized design canvas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-3">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
              Design Title
            </Label>
            <Input
              id="name"
              placeholder="e.g. Summer Banner, Instagram Post"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="width" className="text-xs font-semibold text-slate-700">
                Width (px)
              </Label>
              <Input
                id="width"
                type="number"
                min={100}
                max={8000}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="h-10 rounded-xl font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="height" className="text-xs font-semibold text-slate-700">
                Height (px)
              </Label>
              <Input
                id="height"
                type="number"
                min={100}
                max={8000}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="h-10 rounded-xl font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-400">Popular presets</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handlePresetSelect(1080, 1080, "Instagram Post")}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition"
              >
                Square (1080x1080)
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect(1920, 1080, "HD Presentation")}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition"
              >
                16:9 HD (1920x1080)
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect(1080, 1920, "Instagram Story")}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition"
              >
                Story (1080x1920)
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect(500, 500, "Logo")}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition"
              >
                Logo (500x500)
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-3 pt-2 border-t">
          <Button variant="ghost" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={mutation.isPending}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-violet-200"
          >
            {mutation.isPending ? "Creating..." : "Create design"}
            <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomSizeModal;
