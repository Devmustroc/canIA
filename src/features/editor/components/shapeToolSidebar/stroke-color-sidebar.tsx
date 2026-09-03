import React from 'react';

import {cn} from "@/lib/utils";

import {ScrollArea} from "@/components/ui/scroll-area";
import {ActiveTool, EditorProps, STROKE_COLOR} from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import ColorPicker from "./color-picker";
import ToolSidebarClose from "./tool-sidebar-close";


interface StrokeColorProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const StrokeColorSideBar = ({
                          editor,
                          activeTool,
                          onChangeActiveTool,
                      }: StrokeColorProps) => {
    const value = editor?.getActiveStrokeColor() || STROKE_COLOR;

    const onClose = () => {
        onChangeActiveTool("select");
    }

    const onChange= (color: string) => {
        editor?.changeStrokeColor(color);
    }
    return (
        <aside
            className={cn(
                `bg-white relative border-r z-[40] w-[360px] h-full flex flex-col`,
                activeTool === "stroke-color" ? "visible" : "hidden"
            )}
        >
            <ToolSidebarHeader title={"fill Color"} description={"Add border color to your design"} />
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

export default StrokeColorSideBar;