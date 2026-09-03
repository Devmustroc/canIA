import React from 'react';
import Image from 'next/image';
import { Sparkles, Wand2, Palette, BarChart3, ShieldCheck } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-950 select-none overflow-hidden">
            {/* Left Brand Showcase Column */}
            <div className="hidden lg:flex lg:col-span-6 relative flex-col justify-between p-12 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-950 via-slate-950 to-slate-900 border-r border-white/10 text-white">
                {/* Background ambient glow */}
                <div className="absolute top-1/4 left-1/4 size-96 bg-violet-600/20 blur-[120px] pointer-events-none rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 size-96 bg-indigo-600/15 blur-[120px] pointer-events-none rounded-full" />

                {/* Top Brand Header */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25 border border-white/20">
                        <Sparkles className="size-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                            can<span className="text-violet-400">AI</span>
                        </h1>
                        <p className="text-[10px] text-white/50 tracking-wider uppercase font-semibold">Studio Graphique Intelligent</p>
                    </div>
                </div>

                {/* Center Hero Content */}
                <div className="relative z-10 space-y-8 my-auto">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30 text-xs font-semibold">
                            <Wand2 className="size-3.5 text-amber-400" />
                            <span>La référence du Design assisté par IA</span>
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
                            Créez, éditez et animez des visuels d'exception.
                        </h2>
                        <p className="text-sm text-slate-300 max-w-md leading-relaxed">
                            Accédez à une suite d'outils vectoriels avancés, au copywriter IA, au kit de marque et à des fonctionnalités graphiques inédites.
                        </p>
                    </div>

                    {/* Feature badges */}
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <div className="size-8 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-300">
                                <Wand2 className="size-4" />
                            </div>
                            <span className="text-xs font-semibold text-slate-200">Copywriter & IA</span>
                        </div>
                        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <div className="size-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                                <Palette className="size-4" />
                            </div>
                            <span className="text-xs font-semibold text-slate-200">Kit de Marque</span>
                        </div>
                        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <div className="size-8 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-300">
                                <BarChart3 className="size-4" />
                            </div>
                            <span className="text-xs font-semibold text-slate-200">Data & Graphiques</span>
                        </div>
                        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <div className="size-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                                <ShieldCheck className="size-4" />
                            </div>
                            <span className="text-xs font-semibold text-slate-200">Exportation HD</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer info */}
                <div className="relative z-10 text-xs text-white/40 flex items-center justify-between border-t border-white/10 pt-6">
                    <span>© 2026 canAI Studio • Tous droits réservés</span>
                    <span>Sécurisé par Clerk</span>
                </div>
            </div>

            {/* Right Auth Form Column */}
            <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-slate-950">
                <div className="w-full max-w-md flex flex-col items-center justify-center">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;