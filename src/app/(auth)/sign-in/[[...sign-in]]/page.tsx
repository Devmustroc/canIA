import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="w-full flex items-center justify-center">
      <Suspense fallback={<div className="text-violet-400 text-xs animate-pulse">Chargement de la connexion...</div>}>
        <SignIn
          appearance={{
            elements: {
              card: "bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-2xl rounded-3xl text-white p-6 sm:p-8 w-full",
              headerTitle: "text-white text-xl font-extrabold tracking-tight text-center",
              headerSubtitle: "text-slate-400 text-xs text-center mt-1",
              socialButtonsBlockButton: "bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-2xl transition-all duration-200 py-2.5",
              socialButtonsBlockButtonText: "text-white font-medium text-xs",
              dividerLine: "bg-white/10",
              dividerText: "text-slate-400 text-[11px] uppercase tracking-wider font-semibold",
              formFieldLabel: "text-slate-300 text-xs font-semibold mb-1",
              formFieldInput: "bg-slate-950/80 border-white/15 text-white placeholder:text-slate-500 rounded-2xl text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 py-2.5 px-3.5 transition",
              formButtonPrimary: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl py-3 text-sm shadow-lg shadow-violet-600/30 transition-all duration-200 mt-2",
              footerActionLink: "text-violet-400 hover:text-violet-300 font-semibold text-xs transition",
              footerActionText: "text-slate-400 text-xs",
              identityPreviewText: "text-slate-300 text-xs font-medium",
              identityPreviewEditButtonIcon: "text-violet-400",
              formHeaderTitle: "text-white text-lg font-bold",
              formHeaderSubtitle: "text-slate-400 text-xs",
            }
          }}
        />
      </Suspense>
    </div>
  );
}
