import React from 'react';

import {cn} from "@/lib/utils";
import {ActiveTool, EditorProps} from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import {ScrollArea} from "@/components/ui/scroll-area";
import ColorPicker from "./color-picker";
import ToolSidebarClose from "./tool-sidebar-close";


interface fillColorProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const FillColorSideBar = ({
                          editor,
                          activeTool,
                          onChangeActiveTool,
                      }: fillColorProps) => {
    const value = editor?.getActiveColor() || "#000000";

    const onClose = () => {
        onChangeActiveTool("select");
    }

    const onChange= (color: string) => {
        editor?.changeFillColor(color);
    }
    return (
        <aside
            className={cn(
                `bg-white relative border-r z-[40] w-[360px] h-full flex flex-col`,
                activeTool === "fill" ? "visible" : "hidden"
            )}
        >
            <ToolSidebarHeader title={"fill Color"} description={"Add fill color to your design"} />
            <ScrollArea>
                <div
                    className="p-4 space-y-6"
                >
                    <ColorPicker
                        value={value}
                        onChange={onChange}
                    />
                </div>
            </ScrollArea>
            <ToolSidebarClose closeSidebar={onClose} />
        </aside>
    );
};

export default FillColorSideBar;