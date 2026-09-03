'use client'

import React, { useState, useEffect, useMemo } from 'react';
import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Label} from "@radix-ui/react-dropdown-menu";
import {Slider} from "@/components/ui/slider";
import {ActiveTool, EditorProps} from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-sidebar-close";


interface OpacityProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const OpacitySideBar = ({
                          editor,
                          activeTool,
                          onChangeActiveTool,
                      }: OpacityProps) => {
    const initialValue = editor?.getActiveOpacity() || 1;

    const [opacity, setOpacity] = useState(initialValue);

    const selectedObject = useMemo(() => editor?.canvas.getActiveObject(), [editor?.canvas.getActiveObject()]);

    const onClose = () => {
        onChangeActiveTool("select");
    }

    const onChange = (value: number) => {
        editor?.changeOpacity(value);
        setOpacity(value);
    }

    useEffect(() => {
        if (selectedObject) {
            setOpacity(selectedObject.get('opacity') || 1); ;
        }
    }, [selectedObject]);

    return (
        <aside
            className={cn(
                `bg-white relative border-r z-[40] w-[360px] h-full flex flex-col`,
                activeTool === "opacity" ? "visible" : "hidden"
            )}
        >
            <ToolSidebarHeader title={"Opacity"} description={"Opacity of your design"} />
            <ScrollArea>
                <div
                    className="p-4 space-y-4 border-b"
                >
                    <Label
                        className="text-sm space-y-4 font-bold"
                    >
                        Opacity
                        <Slider
                            value={[opacity]}
                            onValueChange={(values) => onChange(values[0])}
                            max={1}
                            step={0.1}
                            min={0}
                            className="w-full mt-4"
                        />
                    </Label>
                </div>

            </ScrollArea>
            <ToolSidebarClose closeSidebar={onClose} />
        </aside>
    );
};

export default OpacitySideBar;