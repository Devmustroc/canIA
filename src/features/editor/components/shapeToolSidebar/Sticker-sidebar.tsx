import React, { useState } from 'react';

import { cn } from "@/lib/utils";
import { ActiveTool, EditorProps } from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSidebarClose from "./tool-sidebar-close";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/lib/uploadthing";
import { useGenerateSticker } from "@/features/ia/api/use-generate-sticker";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

interface StickerImageSideBarProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const StickerImageSideBar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: StickerImageSideBarProps) => {
    const subscription = usePaywall();
    const [value, setValue] = useState("");
    const mutation = useGenerateSticker();
    const [uploadedImage, setUploadedImage] = useState<string>("");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (subscription.shouldBeBlock) {
            subscription.triggerPaywall();
            return;
        }

        mutation.mutate({ image: uploadedImage, prompt: value }, {
            onSuccess: (res: any) => {
                if ("data" in res && res.data) {
                    const data = res.data;
                    if (Array.isArray(data)) {
                        data.forEach(img => editor?.addImage(img));
                    } else if (typeof data === "string") {
                        editor?.addImage(data);
                    }
                }
            }
        });
    };

    const onClose = () => {
        onChangeActiveTool("select");
    };

    return (
        <aside
            className={cn(
                `bg-white relative border-r z-[40] w-[360px] h-full flex flex-col`,
                activeTool === "sticker" ? "block" : "hidden"
            )}
        >
            <ToolSidebarHeader title={"Logo"} description={"Generate logo from text"} />
            <ScrollArea>
                <form
                    onSubmit={onSubmit}
                    className="p-4 space-y-6">
                    <div className="p-4 border-b">
                        <UploadButton
                            appearance={{
                                button: "w-full text-sm font-medium bg-amber-500 text-black hover:bg-amber-600",
                                allowedContent: "hidden"
                            }}
                            content={{
                                button: "Upload Image",
                            }}
                            endpoint={"imageUploader"}
                            onClientUploadComplete={(res) => {
                                setUploadedImage(res[0].url);
                            }}
                        />
                    </div>
                    <Textarea
                        disabled={mutation.isPending}
                        placeholder="a photo of vibrant artistic graffiti on a wall saying `welcome to the Cania`"
                        cols={30}
                        rows={10}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required={true}
                        minLength={3}
                    />
                    <Button
                        disabled={mutation.isPending}
                        type="submit"
                        className="w-full"
                    >
                        Generate
                    </Button>
                </form>
            </ScrollArea>
            <ToolSidebarClose closeSidebar={onClose} />
        </aside>
    );
};

export default StickerImageSideBar;