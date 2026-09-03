'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Keyboard, Command, Sparkles, Layers, Move, Edit3, ZoomIn } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUT_GROUPS = [
  {
    category: "Édition & Historique",
    icon: Edit3,
    items: [
      { keys: ["Ctrl", "Z"], label: "Annuler la dernière action" },
      { keys: ["Ctrl", "Y"], label: "Rétablir l'action annulée" },
      { keys: ["Ctrl", "C"], label: "Copier l'élément sélectionné" },
      { keys: ["Ctrl", "V"], label: "Coller l'élément" },
      { keys: ["Suppr"], label: "Supprimer l'élément sélectionné" },
      { keys: ["Ctrl", "A"], label: "Sélectionner tous les éléments" },
    ],
  },
  {
    category: "Déplacement & Agencement",
    icon: Move,
    items: [
      { keys: ["↑", "↓", "←", "→"], label: "Déplacer de 1 pixel" },
      { keys: ["Shift", "Flèches"], label: "Déplacer rapidement de 10 pixels" },
      { keys: ["Ctrl", "]"], label: "Monter le calque au premier plan" },
      { keys: ["Ctrl", "["], label: "Descendre le calque en arrière-plan" },
    ],
  },
  {
    category: "Zoom & Affichage",
    icon: ZoomIn,
    items: [
      { keys: ["Ctrl", "+"], label: "Zoom avant sur le canvas" },
      { keys: ["Ctrl", "-"], label: "Zoom arrière sur le canvas" },
      { keys: ["Ctrl", "0"], label: "Ajuster le canvas à l'écran (Auto-zoom)" },
      { keys: ["Échap"], label: "Désélectionner ou quitter le mode plein écran" },
    ],
  },
  {
    category: "canAI Copilote",
    icon: Sparkles,
    items: [
      { keys: ["Ctrl", "/"], label: "Ouvrir cette boîte de raccourcis" },
      { keys: ["Micro"], label: "Dictée vocale directe dans le copilote" },
    ],
  },
];

export const KeyboardShortcutsModal = ({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-3xl p-6 bg-white shadow-2xl border border-slate-200">
        <DialogHeader className="space-y-1 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-violet-600 font-semibold text-xs uppercase tracking-wider">
            <Keyboard className="size-4" />
            <span>Productivité Maximale</span>
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Raccourcis Clavier CanIA</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Maîtrisez ces raccourcis pour concevoir vos designs deux fois plus vite.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUT_GROUPS.map((group, idx) => {
            const Icon = group.icon;
            return (
              <div key={idx} className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <Icon className="size-3.5 text-violet-600" />
                  <span>{group.category}</span>
                </h4>
                <div className="space-y-2">
                  {group.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100 text-xs"
                    >
                      <span className="text-slate-600 font-medium text-[11px] pr-2">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {item.keys.map((k, kIdx) => (
                          <kbd
                            key={kIdx}
                            className="px-2 py-1 text-[10px] font-bold font-mono text-slate-700 bg-white border border-slate-200 rounded-md shadow-2xs"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsModal;
