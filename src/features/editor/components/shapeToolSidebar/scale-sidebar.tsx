import React, {useState} from 'react';

import {cn} from "@/lib/utils";
import {ActiveTool, EditorProps} from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import {ScrollArea} from "@/components/ui/scroll-area";
import ToolSidebarClose from "./tool-sidebar-close";
import {AlertTriangle, Loader2} from "lucide-react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {useRemoveBg} from "@/features/ia/api/use-remove-bg";
import {useScale} from "@/features/ia/api/use-scale";
import {usePaywall} from "@/features/subscriptions/hooks/use-paywall";


interface ScaleSideBarProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const ScaleSideBar = ({
                          editor,
                          activeTool,
                          onChangeActiveTool,
                      }: ScaleSideBarProps) => {
    const subscription = usePaywall();
    const mutation = useScale();
    const selectedObject = editor?.selectedObject[0];

    // @ts-ignore
    let imageSrc = selectedObject?._originalElement?.currentSrc;

    const onClose = () => {
        onChangeActiveTool("select");
    }

    const onClick = () => {
        if (subscription.shouldBeBlock) {
            subscription.triggerPaywall();
            return;
        }
        mutation.mutate({
            image: imageSrc
        }, {
            onSuccess: ({data}) => {
                editor?.addImage(data);
            }
        })
        // @ts-ignore
        imageSrc = selectedObject?._originalElement?.currentSrc;
    }

    return (
        <aside
            className={cn(
                `bg-white relative border-r z-[40] w-[360px] h-full flex flex-col`,
                activeTool === "scale" ? "block" : "hidden"
            )}
        >
            <ToolSidebarHeader title={"Scale"} description={"Scale your image"} />
            {
                !imageSrc && (
                    <div
                        className="flex flex-col gap-y-4 items-center justify-center flex-1"
                    >
                        <AlertTriangle
                            size={48}
                            className="text-yellow-500"
                        />
                        <p
                            className="text-sm text-muted-foreground"
                        >
                            Please select an image to remove background
                        </p>
                    </div>
                )
            }
            {
                imageSrc && (
                    <ScrollArea
                        className="p-4"
                    >
                        <div
                            className={cn(`relative aspect-square rounded-md overflow-hidden transition bg-muted`,
                                mutation.isPending && "opacity-50"
                            )}
                        >
                            <Image
                                src={imageSrc}
                                fill
                                alt={"Selected image"}
                                className="object-cover"
                            />
                        </div>
                        <Button
                            disabled={mutation.isPending}
                            onClick={onClick}
                            className={"w-full mt-4"}
                        >
                            {
                                mutation.isPending ? (
                                    <Loader2
                                        size={24}
                                        className="animate-spin"
                                    />
                                ) : "Apply"
                            }
                        </Button>
                    </ScrollArea>
                )
            }
            <ToolSidebarClose closeSidebar={onClose} />
        </aside>
    );
};

export default ScaleSideBar;