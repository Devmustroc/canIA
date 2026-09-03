"use client";

import React, { useState, useEffect } from 'react';

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ChevronDown, Download, Loader2, MousePointerClick, Redo2, Undo2, Presentation, Keyboard} from "lucide-react";
import {CiFileOn} from "react-icons/ci";
import {Separator} from "@/components/ui/separator";
import {Hint} from "@/components/hint";
import {BsCloudCheck, BsCloudSlash} from "react-icons/bs";
import {cn} from "@/lib/utils";
import Logo from "./logo";
import {ActiveTool, EditorProps} from "../types";
import {useFilePicker} from "use-file-picker";
import UserButton from "@/features/auth/components/user-button";
import {useUpdateProject} from "@/features/projects/api/use-update-project";
import {useMutationState} from "@tanstack/react-query";
import PresentationModal from "@/features/editor/components/presentation-modal";
import KeyboardShortcutsModal from "@/features/editor/components/keyboard-shortcuts-modal";

interface NavBarProps {
    id: string;
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const NavBar = ({
    id,
    editor,
    activeTool,
    onChangeActiveTool,
}: NavBarProps) => {
    const data = useMutationState({
        filters: {
            mutationKey: ['project', { id }],
            exact: true
        },
        select: (mutation) => mutation.state.status
    })

    const currentStatus = data[data.length - 1];

    const isErrored = currentStatus === "error";
    const isPending = currentStatus === "pending";

    const [isPresentationOpen, setIsPresentationOpen] = useState(false);
    const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "/") {
                e.preventDefault();
                setIsShortcutsOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const { openFilePicker } = useFilePicker({
        accept: '.json',
        onFilesSuccessfullySelected: ({ plainFiles }: any) => {
            if (plainFiles && plainFiles.length > 0) {
                const file = plainFiles[0];
                const reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = () => {
                    editor?.loadJson(reader.result as string);
                }
            }
        },
    })
    return (
        <nav
            className="w-full flex items-center px-4 h-[64px] gap-x-6 border-b border-slate-200/80 bg-white/95 backdrop-blur-md lg:px-6 z-30 select-none shadow-2xs"
        >
            <Logo />
            <div
                className="w-full flex items-center gap-x-1 h-full"
            >
                <DropdownMenu
                    modal={false}
                >
                    <DropdownMenuTrigger asChild>
                        <Button
                            size={"sm"}
                            variant={"ghost"}
                            aria-label="Menu fichier"
                            className="rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                        >
                            Fichier
                            <ChevronDown
                                className="size-3.5 ml-1.5 text-slate-400"
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align={"start"} className="min-w-60 rounded-2xl p-1.5 shadow-xl border-slate-200"
                    >
                        <DropdownMenuItem
                            onClick={() => openFilePicker()}
                            className="flex items-center gap-x-2.5 p-2 rounded-xl cursor-pointer"
                        >
                            <CiFileOn
                                className="size-6 text-violet-600"
                            />
                            <div>
                                <p className="text-xs font-semibold text-slate-800">Ouvrir</p>
                                <p
                                    className="text-[10px] text-muted-foreground"
                                >
                                    Ouvrir un fichier projet JSON
                                </p>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Separator
                    orientation={"vertical"}
                    className="mx-2 h-5 bg-slate-200"
                />
                <Hint
                    label={"Sélection"} side={"bottom"} sideOffset={10}
                >
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => onChangeActiveTool("select")}
                        aria-label="Outil Sélection"
                        className={cn(
                            "size-8.5 rounded-xl transition text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                            activeTool === "select" && "bg-violet-100 text-violet-800 hover:bg-violet-200"
                        )}
                    >
                        <MousePointerClick className="size-4" />
                    </Button>
                </Hint>
                <Hint
                    label={"Annuler (Ctrl+Z)"} side={"bottom"} sideOffset={10}
                >
                    <Button
                        disabled={!editor?.canUndo()}
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => editor?.onUndo()}
                        aria-label="Annuler (Ctrl+Z)"
                        className="size-8.5 rounded-xl transition text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30"
                    >
                        <Undo2 className="size-4" />
                    </Button>
                </Hint>
                <Hint
                    label={"Rétablir (Ctrl+Y)"} side={"bottom"} sideOffset={10}
                >
                    <Button
                        disabled={!editor?.canRedo()}
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => editor?.onRedo()}
                        aria-label="Rétablir (Ctrl+Y)"
                        className="size-8.5 rounded-xl transition text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30"
                    >
                        <Redo2 className="size-4" />
                    </Button>
                </Hint>
                <Separator orientation={"vertical"} className="mx-2 h-5 bg-slate-200" />
                {
                    !isPending && !isErrored && (
                        <div
                            className="flex items-center gap-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-medium"
                        >
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Enregistré</span>
                        </div>
                    )
                }
                {
                    !isPending && isErrored && (
                        <div
                            className="flex items-center gap-x-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 text-xs font-medium"
                        >
                            <span className="size-1.5 rounded-full bg-rose-500" />
                            <span>Non synchronisé</span>
                        </div>
                    )
                }
                {
                    isPending &&  (
                        <div
                            className="flex items-center gap-x-1.5 px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200/60 text-xs font-medium"
                        >
                            <Loader2 className="size-3 animate-spin" />
                            <span>Enregistrement...</span>
                        </div>
                    )
                }
                <div
                    className="ml-auto flex items-center gap-x-2 sm:gap-x-3"
                >
                    {/* Presentation Button */}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsPresentationOpen(true)}
                        aria-label="Lancer la présentation plein écran"
                        className="text-xs h-9 px-3 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-1.5"
                    >
                        <Presentation className="size-4 text-violet-600" />
                        <span className="hidden md:inline font-medium">Présentation</span>
                    </Button>

                    {/* Keyboard Shortcuts Button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsShortcutsOpen(true)}
                        aria-label="Guide des raccourcis clavier (Ctrl+/)"
                        className="size-9 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        title="Raccourcis clavier (Ctrl + /)"
                    >
                        <Keyboard className="size-4" />
                    </Button>

                    {/* Export Dropdown */}
                    <DropdownMenu
                        modal={false}
                    >
                        <DropdownMenuTrigger asChild>
                            <Button
                                size={"sm"}
                                aria-label="Menu d'exportation"
                                className={"rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-sm text-xs font-semibold px-4 h-9 gap-1.5"}
                            >
                                <Download className="size-3.5"/>
                                <span>Exporter</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align={"end"}
                            className="min-w-64 rounded-2xl p-2 shadow-xl border-slate-200"
                        >
                            <DropdownMenuItem
                                onClick={() => editor?.saveAsPng()}
                                className="flex items-center gap-x-2.5 p-2 rounded-xl cursor-pointer"
                            >
                                <CiFileOn className={"size-7 text-emerald-600"} />
                                <div>
                                    <p className="text-xs font-bold text-slate-800">PNG</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        Image haute définition transparente
                                    </p>
                                </div>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => editor?.saveAsJpeg()}
                                className="flex items-center gap-x-2.5 p-2 rounded-xl cursor-pointer"
                            >
                                <CiFileOn className={"size-7 text-sky-600"} />
                                <div>
                                    <p className="text-xs font-bold text-slate-800">JPG</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        Image compressée pour le web
                                    </p>
                                </div>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => editor?.saveAsPdf()}
                                className="flex items-center gap-x-2.5 p-2 rounded-xl cursor-pointer bg-rose-50/50 hover:bg-rose-50"
                            >
                                <CiFileOn className={"size-7 text-rose-600"} />
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-xs font-bold text-rose-700">PDF</p>
                                        <span className="text-[9px] bg-rose-200 text-rose-800 font-bold px-1.5 py-0.2 rounded-full">
                                            Impression HD
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-rose-600/80">
                                        Document prêt à imprimer
                                    </p>
                                </div>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => editor?.saveAsSvg()}
                                className="flex items-center gap-x-2.5 p-2 rounded-xl cursor-pointer"
                            >
                                <CiFileOn className={"size-7 text-amber-600"} />
                                <div>
                                    <p className="text-xs font-bold text-slate-800">SVG</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        Vecteur infini pour graphistes
                                    </p>
                                </div>
                            </DropdownMenuItem>

                            <div className="my-1 border-t border-slate-100" />

                            <DropdownMenuItem
                                onClick={() => editor?.saveAsJson()}
                                className="flex items-center gap-x-2.5 p-2 rounded-xl cursor-pointer"
                            >
                                <CiFileOn className={"size-7 text-indigo-600"} />
                                <div>
                                    <p className="text-xs font-bold text-slate-800">JSON Projet</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        Sauvegarder pour rééditer plus tard
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <UserButton />
                </div>
            </div>

            {/* Presentation Modal */}
            <PresentationModal
                editor={editor}
                isOpen={isPresentationOpen}
                onClose={() => setIsPresentationOpen(false)}
            />

            {/* Keyboard Shortcuts Modal */}
            <KeyboardShortcutsModal
                isOpen={isShortcutsOpen}
                onClose={() => setIsShortcutsOpen(false)}
            />
        </nav>
    );
};

export default NavBar;