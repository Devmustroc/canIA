'use client';

import React, { useRef, useState } from 'react';
import ToolSidebarHeader from './tool-sidebar-header';
import ToolSidebarClose from './tool-sidebar-close';
import { ActiveTool, EditorProps } from '../../types';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface UploadSidebarProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const UploadSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: UploadSidebarProps) => {
  const [uploads, setUploads] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onClose = () => {
    onChangeActiveTool('select');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setUploads((prev) => [dataUrl, ...prev]);
        editor?.addImage(dataUrl);
        toast.success('Image ajoutée au canvas');
      }
      setIsUploading(false);
    };

    reader.onerror = () => {
      toast.error('Erreur lors du chargement du fichier');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <aside
      className={`bg-white relative z-40 w-[360px] h-full flex flex-col border-r ${
        activeTool === 'upload' ? 'visible' : 'hidden'
      }`}
    >
      <ToolSidebarHeader title="Vos Fichiers" description="Téléchargez vos propres images et éléments" />
      <ToolSidebarClose onClick={onClose} />

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold flex items-center justify-center gap-x-2 shadow-md shadow-violet-200"
        >
          {isUploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              <Upload className="size-5" />
              <span>Importer un fichier</span>
            </>
          )}
        </Button>

        <div className="pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Fichiers récents ({uploads.length})
          </span>
        </div>

        {uploads.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-2xl text-slate-400 text-center mt-2">
            <ImageIcon className="size-10 stroke-1 mb-2 text-slate-300" />
            <p className="text-xs text-slate-500 font-medium mb-1">Aucun fichier importé</p>
            <p className="text-[11px] text-slate-400">
              Glissez-déposez ou cliquez ci-dessus pour ajouter des images à votre projet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {uploads.map((url, idx) => (
              <button
                key={idx}
                onClick={() => editor?.addImage(url)}
                className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 hover:border-violet-400 hover:shadow-md transition text-left"
              >
                <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-200" />
                <div className="opacity-0 group-hover:opacity-100 transition absolute inset-0 bg-violet-950/40 backdrop-blur-[1px] flex items-center justify-center">
                  <span className="px-2.5 py-1 rounded-lg bg-white text-violet-900 font-bold text-[11px] flex items-center gap-x-1 shadow">
                    <Plus className="size-3" /> Insérer
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default UploadSidebar;
