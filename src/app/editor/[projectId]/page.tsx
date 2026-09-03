'use client'

import dynamic from "next/dynamic";
import {useGetProject} from "@/features/projects/api/use-get-project";
import {AlertTriangle, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const Editor = dynamic(() => import("@/features/editor/components/editor"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex flex-col items-center justify-center space-y-4 bg-slate-50">
      <Loader2 size={44} className="text-violet-600 animate-spin" />
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-slate-700">Ouverture du Studio CanIA...</p>
        <p className="text-xs text-slate-400">Initialisation de votre canvas haute performance</p>
      </div>
    </div>
  ),
});


interface Props {
    params: {
        projectId: string;
    };
}


const EditorPage =  ({ params }: Props) => {
    const { data, isLoading, isError} = useGetProject(params.projectId);

    if (!params.projectId) {
        return (
            <div
                className="h-full flex flex-col items-center justify-center"
            >
                <AlertTriangle
                    size={48}
                    className="text-yellow-500"
                />
                <p
                    className="text-muted-foreground"
                >
                    Invalid project id
                </p>
                <Button
                    asChild
                    variant={"ghost"}
                    className="mt-4"
                >
                    <Link
                        href="/"

                    >
                        Back to dashboard
                    </Link>
                </Button>
            </div>
        )
    }

    if (isLoading || !data) {
        return (
            <div
                className="h-full flex flex-col items-center justify-center"
            >
                <Loader2
                    size={48}
                    className="text-muted-foreground animate-spin"
                />
            </div>
        )
    }

    if (isError) {
        return (
            <div
                className="h-full flex flex-col items-center justify-center"
            >
                <AlertTriangle
                    size={48}
                    className="text-yellow-500"
                />
                <p
                    className="text-muted-foreground"
                >
                    Failed to fetch project
                </p>
                <Button
                    asChild
                    variant={"ghost"}
                    className="mt-4"
                >
                    <Link
                        href="/"

                    >
                        Back to dashboard
                    </Link>
                </Button>
            </div>
        )
    }
    return (
        <Editor
            initialData={data}
        />
    );
};

export default EditorPage;