import React from 'react';
import {Hint} from "@/components/hint";
import {Button} from "@/components/ui/button";
import {Minimize, ZoomIn, ZoomOut} from "lucide-react";
import {EditorProps} from "@/features/editor/types";



interface FooterProps {
    editor: EditorProps | undefined;
}

const Footer = ({ editor }: FooterProps) => {
    return (
        <footer
            className="h-[52px] bg-white border-t flex items-center  overflow-x-auto z-[49] p-2 gap-x-1 shrink-0 px-4 flex-row-reverse"
        >
            <Hint
                label={"Zoom in"}
                side={"top"}
                sideOffset={10}
            >
                <Button
                    onClick={() => editor?.zoomIn()}
                    size={"icon"}
                    variant={"ghost"}
                    className={"h-full"}
                >
                    <ZoomIn
                        className="size-6"
                    />
                </Button>
            </Hint>
            <Hint
                label={"Zoom in"}
                side={"top"}
                sideOffset={10}
            >
                <Button
                    onClick={() => editor?.autoZoom()}
                    size={"icon"}
                    variant={"ghost"}
                    className={"h-full"}
                >
                    <Minimize
                        className="size-6"
                    />
                </Button>
            </Hint>
            <Hint
                label={"Zoom in"}
                side={"top"}
                sideOffset={10}
            >
                <Button
                    onClick={() => editor?.zoomOut()}
                    size={"icon"}
                    variant={"ghost"}
                    className={"h-full"}
                >
                    <ZoomOut
                        className="size-6"
                    />
                </Button>
            </Hint>
        </footer>
    );
};

export default Footer;