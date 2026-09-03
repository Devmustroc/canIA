'use client';

import React from 'react';
import { useGetAllProjects } from "@/features/projects/api/use-get-Allproject";
import { 
  AlertTriangle, 
  CopyIcon, 
  FileIcon, 
  Loader2, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Trash, 
  FolderKanban,
  Clock,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDuplicateProject } from "@/features/projects/api/use-duplicate-project";
import { useDeleteProject } from "@/features/projects/api/use-delete-project";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import useConfirm from "@/hooks/use-confirm";

export const ProjectsSection = () => {
  const duplicateMutation = useDuplicateProject();
  const deleteMutation = useDeleteProject();
  const createMutation = useCreateProject();
  const [ConfirmDialog, confirm] = useConfirm(
    "Supprimer le projet",
    "Êtes-vous sûr de vouloir supprimer définitivement ce projet ?"
  );
  const router = useRouter();

  const onCopy = (id: string) => {
    duplicateMutation.mutate({ id });
  };

  const onDelete = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate({ id });
    }
  };

  const handleCreateBlank = () => {
    createMutation.mutate(
      {
        name: "Projet sans titre",
        json: "",
        width: 1920,
        height: 1080,
      },
      {
        onSuccess: ({ data }: any) => {
          router.push(`/editor/${data.id}`);
        },
      }
    );
  };

  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllProjects();

  if (status === "pending") {
    return (
      <div className="space-y-4 pt-6">
        <h2 className="font-bold text-lg text-slate-900">Projets récents</h2>
        <div className="flex flex-col items-center justify-center h-40 bg-slate-50/50 rounded-2xl border border-dashed">
          <Loader2 size={28} className="text-violet-600 animate-spin mb-2" />
          <p className="text-xs text-slate-400">Chargement de vos designs...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-4 pt-6">
        <h2 className="font-bold text-lg text-slate-900">Projets récents</h2>
        <div className="flex flex-col items-center justify-center h-40 bg-slate-50/50 rounded-2xl border border-dashed text-slate-400">
          <AlertTriangle size={28} className="text-amber-500 mb-2" />
          <p className="text-xs text-slate-500">Erreur lors de la récupération des projets</p>
        </div>
      </div>
    );
  }

  const allProjects = data.pages.flatMap((page) => page.data);

  return (
    <div id="projects" className="space-y-6 pt-6">
      <ConfirmDialog />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div className="size-8 rounded-xl bg-indigo-100 flex items-center justify-center">
            <FolderKanban className="size-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Projets récents</h2>
            <p className="text-xs text-slate-500">Retrouvez tous vos designs et créations en cours.</p>
          </div>
        </div>

        <Button
          onClick={handleCreateBlank}
          disabled={createMutation.isPending}
          variant="outline"
          size="sm"
          className="rounded-xl border-slate-200 hover:bg-slate-50 font-medium text-xs text-slate-700"
        >
          <Plus className="size-4 mr-1.5 text-violet-600" />
          Nouveau projet vierge
        </Button>
      </div>

      {allProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50/60 rounded-3xl border border-dashed border-slate-200 text-center">
          <div className="size-14 rounded-2xl bg-violet-100/60 flex items-center justify-center mb-3">
            <Sparkles className="size-7 text-violet-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            Aucun projet pour le moment
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Commencez dès maintenant en choisissant un format ou un modèle dans la bannière ci-dessus !
          </p>
          <Button
            onClick={handleCreateBlank}
            disabled={createMutation.isPending}
            className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-xs shadow-md shadow-violet-200"
          >
            <Plus className="size-4 mr-1.5" />
            Créer votre premier design
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {/* Quick Create Blank Card */}
          <button
            type="button"
            onClick={handleCreateBlank}
            disabled={createMutation.isPending}
            aria-label="Créer un canvas vierge de dimension 1920 par 1080 pixels"
            className="group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-violet-50/50 hover:border-violet-300 transition cursor-pointer min-h-[220px]"
          >
            <div className="size-12 rounded-2xl bg-white shadow-sm border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="size-6 text-violet-600" />
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-violet-700">
              Créer un canvas vierge
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 font-medium">
              1920 x 1080 px
            </span>
          </button>

          {/* User Projects Grid */}
          {allProjects.map((proj) => (
            <div
              key={proj.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-3 shadow-sm hover:shadow-xl hover:shadow-violet-900/5 hover:border-violet-200 transition-all duration-200"
            >
              {/* Project Canvas Thumbnail Placeholder */}
              <div
                onClick={() => router.push(`/editor/${proj.id}`)}
                className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-100 cursor-pointer flex items-center justify-center group-hover:opacity-95 transition"
              >
                {proj.thumbnail ? (
                  <img
                    src={proj.thumbnail}
                    alt={proj.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <FileIcon className="size-8 stroke-1 text-slate-400 mb-1" />
                    <span className="text-[10px] font-mono font-medium text-slate-400">
                      {proj.width} x {proj.height} px
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div className="flex items-center justify-between pt-3 px-1">
                <div
                  onClick={() => router.push(`/editor/${proj.id}`)}
                  className="flex-1 cursor-pointer pr-2"
                >
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-violet-700 transition">
                    {proj.name}
                  </h3>
                  <div className="flex items-center gap-x-1 text-[10px] text-slate-500 mt-0.5 font-medium">
                    <Clock className="size-3 text-slate-500" />
                    <span>
                      {formatDistanceToNow(new Date(proj.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions Dropdown */}
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label={`Options pour le projet ${proj.name}`}
                      className="size-8 rounded-lg hover:bg-slate-100"
                    >
                      <MoreHorizontal className="size-4 text-slate-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl p-1">
                    <DropdownMenuItem
                      disabled={duplicateMutation.isPending}
                      onClick={() => onCopy(proj.id)}
                      className="rounded-lg h-9 cursor-pointer text-xs"
                    >
                      <CopyIcon className="size-4 mr-2 text-slate-500" />
                      Dupliquer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={deleteMutation.isPending}
                      onClick={() => onDelete(proj.id)}
                      className="rounded-lg h-9 cursor-pointer text-xs text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                    >
                      <Trash className="size-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="w-full flex items-center justify-center pt-4">
          <Button
            variant="ghost"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-xl text-xs font-semibold text-violet-700 hover:bg-violet-50"
          >
            {isFetchingNextPage ? (
              <Loader2 size={16} className="animate-spin mr-2" />
            ) : null}
            Charger plus de projets
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;