'use client';

import React, { useState } from 'react';
import { fabric } from "fabric";

import { cn } from "@/lib/utils";
import { ActiveTool, EditorProps } from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSidebarClose from "./tool-sidebar-close";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Loader2,
  Sparkles,
  XCircle,
  Activity,
  Palette,
  Wand2,
  ShieldCheck,
  Zap,
  ChevronDown,
} from "lucide-react";
import { AgentAction, useAgentPlan } from "@/features/ia/api/use-agent-plan";
import { useAgentAudit, AuditResult } from "@/features/ia/api/use-agent-audit";
import { useAgentHarmonize } from "@/features/ia/api/use-agent-harmonize";
import { useGenerateImage } from "@/features/ia/api/use-generate-image";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { STYLE_PROFILES } from "@/features/agent-harness/design-knowledge";
import { useSelectedModel } from "@/features/ai-models/use-selected-model";
import { toast } from "sonner";

interface AgentSideBarProps {
  editor: EditorProps | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

type TabType = "studio" | "audit" | "palettes";

type LogEntry = {
  id: string;
  label: string;
  status: "pending" | "done" | "error";
};

const SUGGESTED_PROMPTS = [
  {
    category: "Affiche & Événement",
    text: "Affiche minimaliste pour une conférence sur l'IA avec grand titre",
  },
  {
    category: "Réseaux Sociaux",
    text: "Post Instagram élégant pour un café bio avec formes douces",
  },
  {
    category: "Marketing & Soldes",
    text: "Bannière publicitaire pour soldes d'été avec badge -50%",
  },
  {
    category: "Branding de Luxe",
    text: "Carte de visite moderne épurée avec typographie haut de gamme",
  },
];

const describeAction = (action: AgentAction): string => {
  switch (action.type) {
    case "add_text":
      return `Texte : "${action.text}"`;
    case "add_shape":
      return `Forme : ${action.shape.replace("_", " ")}`;
    case "generate_image":
      return `Image IA : "${action.prompt.slice(0, 24)}..."`;
    case "set_background":
      return `Arrière-plan : ${action.color}`;
    case "align":
      return `Aligner (${action.alignment})`;
    case "arrange":
      return `Ordre (${action.order})`;
    case "set_opacity":
      return `Opacité : ${Math.round((action.opacity ?? 1) * 100)}%`;
    case "delete":
      return `Suppression élément`;
    default:
      return "Action de design";
  }
};

const AgentSideBar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: AgentSideBarProps) => {
  const subscription = usePaywall();
  const [activeTab, setActiveTab] = useState<TabType>("studio");

  // Selected OpenRouter model hook
  const {
    chatModelId,
    currentChatModel,
    selectChatModel,
    chatModels,
    userApiKey,
  } = useSelectedModel();

  // Studio State
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string>("minimalist");
  const [assistantMessage, setAssistantMessage] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Audit State
  const [auditData, setAuditData] = useState<AuditResult | null>(null);

  // Mutations
  const planMutation = useAgentPlan();
  const auditMutation = useAgentAudit();
  const harmonizeMutation = useAgentHarmonize();
  const generateImageMutation = useGenerateImage();

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const updateLogStatus = (actionId: string, status: LogEntry["status"]) => {
    setLog((prev) => prev.map((entry) => (entry.id === actionId ? { ...entry, status } : entry)));
  };

  const runPlan = async (actions: AgentAction[]) => {
    if (!editor) return;

    setLog(actions.map((a) => ({ id: a.id, label: describeAction(a), status: "pending" })));

    const idMap = new Map<string, fabric.Object>();

    for (const action of actions) {
      try {
        switch (action.type) {
          case "set_background": {
            const workspace = editor.getWorkSpace() as fabric.Rect | undefined;
            if (workspace) {
              workspace.set("fill", action.color);
            } else {
              editor.canvas.setBackgroundColor(action.color, () => {});
            }
            break;
          }
          case "add_text": {
            const object = editor.addText(action.text, {
              fill: action.fill,
              fontSize: action.fontSize,
              fontWeight: action.fontWeight,
              fontStyle: action.fontStyle,
              fontFamily: action.fontFamily,
            });
            idMap.set(action.id, object);
            break;
          }
          case "add_shape": {
            const shapeOptions = {
              fill: action.fill,
              stroke: action.stroke,
              strokeWidth: action.strokeWidth,
              width: action.width,
              height: action.height,
            };
            let object: fabric.Object;
            switch (action.shape) {
              case "soft_rectangle":
                object = editor.addSoftRectangle(shapeOptions);
                break;
              case "circle":
                object = editor.addCircle(shapeOptions);
                break;
              case "triangle":
                object = editor.addTriangle(shapeOptions);
                break;
              case "inverse_triangle":
                object = editor.addInverseTriangle(shapeOptions);
                break;
              case "diamond":
                object = editor.addDiamond(shapeOptions);
                break;
              default:
                object = editor.addRectangle(shapeOptions);
            }
            idMap.set(action.id, object);
            break;
          }
          case "generate_image": {
            const res = await generateImageMutation.mutateAsync({ prompt: action.prompt });
            if (res.data) {
              editor.addImage(res.data);
            }
            break;
          }
          case "align": {
            const targetObj = idMap.get(action.target) || editor.canvas.getActiveObject();
            if (targetObj) {
              const workspace = editor.getWorkSpace() as fabric.Rect | undefined;
              const wW = workspace?.width ?? editor.canvas.getWidth();
              const wH = workspace?.height ?? editor.canvas.getHeight();
              switch (action.alignment) {
                case "center-horizontal":
                  targetObj.set("left", wW / 2);
                  targetObj.set("originX", "center");
                  break;
                case "center-vertical":
                  targetObj.set("top", wH / 2);
                  targetObj.set("originY", "center");
                  break;
                case "left":
                  targetObj.set("left", 50);
                  targetObj.set("originX", "left");
                  break;
                case "right":
                  targetObj.set("left", wW - 50);
                  targetObj.set("originX", "right");
                  break;
                case "top":
                  targetObj.set("top", 50);
                  targetObj.set("originY", "top");
                  break;
                case "bottom":
                  targetObj.set("top", wH - 50);
                  targetObj.set("originY", "bottom");
                  break;
              }
              targetObj.setCoords();
            }
            break;
          }
          case "arrange": {
            const targetObj = idMap.get(action.target) || editor.canvas.getActiveObject();
            if (targetObj) {
              switch (action.order) {
                case "front":
                  editor.canvas.bringToFront(targetObj);
                  break;
                case "back":
                  editor.canvas.sendToBack(targetObj);
                  break;
                case "forward":
                  editor.canvas.bringForward(targetObj);
                  break;
                case "backward":
                  editor.canvas.sendBackwards(targetObj);
                  break;
              }
            }
            break;
          }
          case "set_opacity": {
            const targetObj = idMap.get(action.target) || editor.canvas.getActiveObject();
            if (targetObj) {
              targetObj.set("opacity", action.opacity);
            }
            break;
          }
          case "delete": {
            const targetObj = idMap.get(action.target);
            if (targetObj) {
              editor.canvas.remove(targetObj);
            }
            break;
          }
        }
        updateLogStatus(action.id, "done");
        editor.canvas.renderAll();
        await new Promise((resolve) => setTimeout(resolve, 150));
      } catch (err) {
        console.error("Action failed:", err);
        updateLogStatus(action.id, "error");
      }
    }
    editor.canvas.renderAll();
  };

  const handleExecuteStudio = (targetPrompt: string) => {
    if (!editor || !targetPrompt.trim() || isRunning) return;

    setPrompt("");
    setAssistantMessage("");
    setLog([]);

    const workspace = editor.getWorkSpace() as fabric.Rect | undefined;

    planMutation.mutate(
      {
        prompt: targetPrompt,
        style: selectedStyle,
        canvas: {
          width: workspace?.width ?? 0,
          height: workspace?.height ?? 0,
          background: typeof workspace?.fill === "string" ? workspace.fill : undefined,
          objects: editor.listCanvasObjects(),
        },
        model: chatModelId,
        apiKey: userApiKey || undefined,
      },
      {
        onSuccess: async ({ data }) => {
          setAssistantMessage(data.message);
          setIsRunning(true);
          await runPlan(data.actions);
          setIsRunning(false);
          toast.success("Composition générée avec succès !");
        },
        onError: (err: any) => {
          toast.error(err.message || "Erreur lors de la conception du design");
        },
      }
    );
  };

  const handleRunAudit = () => {
    if (!editor) return;
    const workspace = editor.getWorkSpace() as fabric.Rect | undefined;

    auditMutation.mutate(
      {
        canvas: {
          width: workspace?.width ?? 0,
          height: workspace?.height ?? 0,
          background: typeof workspace?.fill === "string" ? workspace.fill : undefined,
          objects: editor.listCanvasObjects(),
        },
      },
      {
        onSuccess: ({ data }: any) => {
          setAuditData(data);
          toast.success(`Score de design : ${data.score}/100`);
        },
      }
    );
  };

  const handleHarmonize = (styleKey: string) => {
    if (!editor) return;
    const workspace = editor.getWorkSpace() as fabric.Rect | undefined;

    harmonizeMutation.mutate(
      {
        styleId: styleKey,
        canvas: {
          width: workspace?.width ?? 0,
          height: workspace?.height ?? 0,
          background: typeof workspace?.fill === "string" ? workspace.fill : undefined,
          objects: editor.listCanvasObjects(),
        },
      },
      {
        onSuccess: async ({ data }) => {
          setIsRunning(true);
          await runPlan(data.actions as AgentAction[]);
          setIsRunning(false);
          toast.success(`Palette ${data.profile.name} appliquée !`);
        },
      }
    );
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col shadow-sm",
        activeTool === "agent" ? "block" : "hidden"
      )}
    >
      {/* Standard Unified Header */}
      <ToolSidebarHeader
        title="Agent IA"
        description="Génération autonome et analyse esthétique"
      />

      {/* Tabs */}
      <div className="flex items-center px-4 pt-2.5 pb-2 border-b gap-1.5 bg-slate-50/60">
        <button
          type="button"
          onClick={() => setActiveTab("studio")}
          className={cn(
            "flex-1 flex items-center justify-center gap-x-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer",
            activeTab === "studio"
              ? "bg-white text-violet-700 shadow-xs border border-slate-200"
              : "text-slate-500 hover:text-slate-800"
          )}
        >
          <Zap className="size-3.5" />
          <span>Studio</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("audit");
            if (!auditData) handleRunAudit();
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-x-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer",
            activeTab === "audit"
              ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
              : "text-slate-500 hover:text-slate-800"
          )}
        >
          <Activity className="size-3.5" />
          <span>Audit IA</span>
          {auditData && (
            <span className="text-[9px] px-1 rounded bg-indigo-100 text-indigo-700 font-mono">
              {auditData.score}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("palettes")}
          className={cn(
            "flex-1 flex items-center justify-center gap-x-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer",
            activeTab === "palettes"
              ? "bg-white text-cyan-700 shadow-xs border border-slate-200"
              : "text-slate-500 hover:text-slate-800"
          )}
        >
          <Palette className="size-3.5" />
          <span>Styles</span>
        </button>
      </div>

      <ScrollArea className="flex-1">
        {/* TAB 1: STUDIO */}
        {activeTab === "studio" && (
          <div className="p-4 space-y-4">
            {/* Model Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Modèle d&apos;IA</span>
                <span className="text-[10px] text-violet-600 font-mono">OpenRouter</span>
              </label>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Sélectionner le modèle IA"
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-violet-400 bg-slate-50/50 hover:bg-white transition text-left"
                  >
                    <div className="flex items-center gap-x-2 truncate">
                      <div className="size-6 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 font-bold text-xs">
                        <Bot className="size-3.5" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                          {currentChatModel.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                          {currentChatModel.providerLabel}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className="size-4 text-slate-400 shrink-0 ml-2" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[320px] max-h-80 overflow-y-auto no-scrollbar shadow-lg">
                  <DropdownMenuLabel className="text-xs text-slate-500 font-semibold">
                    Choisir un modèle OpenRouter
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {chatModels.map((m) => {
                    const isSelected = chatModelId === m.id;
                    return (
                      <DropdownMenuItem
                        key={m.id}
                        onClick={() => {
                          selectChatModel(m.id);
                          toast.success(`Modèle actif : ${m.name}`);
                        }}
                        className={cn(
                          "flex flex-col items-start gap-y-0.5 cursor-pointer py-2 px-2.5",
                          isSelected && "bg-violet-50 text-violet-800 font-semibold"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-x-1.5">
                            <span className="text-xs font-medium">{m.name}</span>
                            <span className="text-[9px] px-1 rounded bg-slate-100 text-slate-500 font-mono">
                              {m.providerLabel}
                            </span>
                          </div>
                          {m.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 leading-tight">
                          {m.description}
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteStudio(prompt);
              }}
              className="space-y-4"
            >
              {/* Style Aesthetic Pills */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Style esthétique souhaité
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(STYLE_PROFILES).map((style, idx, arr) => {
                    const isSelected = selectedStyle === style.id;
                    const isLastOdd = idx === arr.length - 1 && arr.length % 2 !== 0;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedStyle(style.id)}
                        className={cn(
                          "flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition",
                          isLastOdd && "col-span-2",
                          isSelected
                            ? "border-violet-600 bg-violet-50/70 text-violet-900 font-semibold ring-1 ring-violet-500"
                            : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                        )}
                      >
                        <span
                          className="size-2.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: style.palette.primary }}
                        />
                        <span className="truncate">{style.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prompt Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Votre consigne de design
                </label>
                <Textarea
                  disabled={planMutation.isPending || isRunning}
                  value={prompt}
                  placeholder='ex: "Affiche minimaliste pour une exposition de design contemporain avec grand titre et formes géométriques"'
                  rows={4}
                  required
                  minLength={3}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="resize-none text-xs rounded-xl border-slate-200 focus-visible:ring-violet-500"
                />
              </div>

              {/* Submit CTA Button */}
              <Button
                disabled={planMutation.isPending || isRunning || !prompt.trim()}
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow font-medium h-10 text-xs"
              >
                {planMutation.isPending || isRunning ? (
                  <span className="flex items-center gap-x-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Création avec {currentChatModel.name.split(" ")[0]}...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-x-1.5">
                    <Wand2 className="size-4" />
                    <span>Générer le design sur mesure</span>
                  </span>
                )}
              </Button>
            </form>

            {/* Quick Suggestions */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-x-1.5">
                <Sparkles className="size-3.5 text-amber-500" /> Idées de création rapide
              </span>
              <div className="space-y-1.5">
                {SUGGESTED_PROMPTS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={planMutation.isPending || isRunning}
                    onClick={() => {
                      setPrompt(suggestion.text);
                      handleExecuteStudio(suggestion.text);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition text-xs group"
                  >
                    <span className="text-[10px] text-violet-600 font-semibold block uppercase font-mono">
                      {suggestion.category}
                    </span>
                    <span className="text-slate-700 font-medium line-clamp-1 mt-0.5">
                      {suggestion.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {planMutation.isError && (
              <div className="flex items-start gap-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                <p>{planMutation.error.message}</p>
              </div>
            )}

            {assistantMessage && (
              <div className="rounded-xl bg-violet-50 p-3 text-xs text-violet-900 border border-violet-200 font-medium">
                🤖 {assistantMessage}
              </div>
            )}

            {log.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold text-slate-700">
                  Journal d&apos;exécution ({log.filter((l) => l.status === "done").length}/{log.length})
                </span>
                <ul className="space-y-1.5">
                  {log.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-center gap-x-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100"
                    >
                      {entry.status === "pending" && (
                        <Loader2 className="size-3.5 shrink-0 animate-spin text-violet-600" />
                      )}
                      {entry.status === "done" && (
                        <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                      )}
                      {entry.status === "error" && (
                        <XCircle className="size-3.5 shrink-0 text-red-500" />
                      )}
                      <span className="truncate text-slate-600 font-mono text-[11px]">{entry.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AUDIT IA */}
        {activeTab === "audit" && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Audit de Qualité & Ergonomie</h4>
                <p className="text-[11px] text-slate-500">Inspection automatique de votre composition</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRunAudit}
                disabled={auditMutation.isPending}
                className="h-8 text-xs rounded-xl"
              >
                {auditMutation.isPending ? <Loader2 className="size-3 animate-spin" /> : "Réanalyser"}
              </Button>
            </div>

            {auditData && (
              <div className="space-y-4">
                {/* Score Card */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Score Global</span>
                      <div className="text-3xl font-black mt-1">
                        {auditData.score} <span className="text-sm font-normal text-indigo-300">/ 100</span>
                      </div>
                    </div>
                    <div className="size-12 rounded-full border-4 border-indigo-400/40 flex items-center justify-center font-bold text-lg bg-white/10">
                      {auditData.score >= 80 ? "A" : auditData.score >= 60 ? "B" : "C"}
                    </div>
                  </div>
                  <p className="text-xs text-indigo-200 mt-2">{auditData.summary}</p>
                </div>

                {/* Issues List */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700">
                    Points d&apos;attention ({auditData.issues.length})
                  </span>

                  {auditData.issues.length === 0 ? (
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                      <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
                      <span>Aucun problème détecté. Votre design respecte les règles de composition !</span>
                    </div>
                  ) : (
                    auditData.issues.map((issue) => (
                      <div
                        key={issue.id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{issue.title}</span>
                          <span
                            className={cn(
                              "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded",
                              issue.severity === "high"
                                ? "bg-red-100 text-red-700"
                                : issue.severity === "medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-700"
                            )}
                          >
                            {issue.severity}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px]">{issue.description}</p>
                        <p className="text-indigo-600 font-medium text-[11px]">💡 {issue.suggestion}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PALETTES */}
        {activeTab === "palettes" && (
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Harmoniser en 1 Clic</h4>
              <p className="text-[11px] text-slate-500">
                Appliquez un système de couleurs et typographies professionnel à tout votre canvas.
              </p>
            </div>

            <div className="space-y-3">
              {Object.values(STYLE_PROFILES).map((profile) => (
                <div
                  key={profile.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-violet-300 hover:shadow-md transition space-y-2.5"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{profile.name}</h5>
                    <p className="text-[11px] text-slate-500">{profile.description}</p>
                  </div>

                  {/* Swatches */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-6 flex-1 rounded-md border border-black/10 flex items-center justify-center text-[9px] font-bold"
                      style={{ backgroundColor: profile.background, color: profile.palette.text }}
                    >
                      Fond
                    </div>
                    <div
                      className="size-6 rounded-md border border-black/10 shadow-sm"
                      style={{ backgroundColor: profile.palette.primary }}
                      title="Primaire"
                    />
                    <div
                      className="size-6 rounded-md border border-black/10 shadow-sm"
                      style={{ backgroundColor: profile.palette.secondary }}
                      title="Secondaire"
                    />
                    <div
                      className="size-6 rounded-md border border-black/10 shadow-sm"
                      style={{ backgroundColor: profile.palette.accent }}
                      title="Accent"
                    />
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleHarmonize(profile.id)}
                    disabled={harmonizeMutation.isPending || isRunning}
                    className="w-full h-8 text-xs rounded-xl bg-slate-900 hover:bg-violet-700 text-white font-semibold transition"
                  >
                    Appliquer ce style au design
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>

      <ToolSidebarClose closeSidebar={onClose} />
    </aside>
  );
};

export default AgentSideBar;
