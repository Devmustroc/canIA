import Banner from "@/app/(dashboard)/_components/banner";
import { auth } from "@clerk/nextjs/server";
import ProjectsSection from "@/app/(dashboard)/_components/projects-section";
import TemplatesSection from "@/app/(dashboard)/_components/templates-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col space-y-10 max-w-screen-2xl mx-auto pb-12">
      <Banner />

      {!userId && (
        <div className="mx-4 sm:mx-8 p-6 rounded-3xl bg-gradient-to-r from-violet-900/90 via-indigo-900/80 to-slate-950 border border-violet-500/30 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30 text-xs font-semibold">
              <Sparkles className="size-3.5 text-amber-400" />
              <span>Studio Créatif IA & Design</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Créez des visuels professionnels sans limites
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              Rejoignez canIA pour accéder à l'éditeur vectoriel complet, au copywriter IA, aux graphiques et aux exportations HD.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button asChild size="lg" className="rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-6 gap-2 shadow-lg">
              <Link href="/sign-in">
                <span>Commencer gratuitement</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      <TemplatesSection />

      {userId && <ProjectsSection />}
    </div>
  );
}
