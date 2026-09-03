import React from 'react';

import {cn} from "@/lib/utils";

import {ScrollArea} from "@/components/ui/scroll-area";
import {Label} from "@radix-ui/react-dropdown-menu";
import {Slider} from "@/components/ui/slider";
import {Button} from "@/components/ui/button";
import {ActiveTool, EditorProps, STROKE_DASH_ARRAY, STROKE_WIDTH} from "../../types";
import ToolSidebarHeader from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-sidebar-close";

interface StrokeWidthProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const StrokeWidthSideBar = ({
                          editor,
                          activeTool,
                          onChangeActiveTool,
                      }: StrokeWidthProps) => {
    const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
    const typeValue = editor?.getActiveStrokeDashedArray() || STROKE_DASH_ARRAY;

    const onClose = () => {
        onChangeActiveTool("select");
    }

    const onChangeStrokeWidth = (width: number) => {
        editor?.changeStrokeWidth(width);
    }
    const onChangeStrokeType = (values : number[]) => {
        editor?.changeStrokeDashArray(values);
    }
    return (
        <aside
            className={cn(
                `bg-white relative border-r z-[40] w-[360px] h-full flex flex-col`,
                activeTool === "stroke-width" ? "visible" : "hidden"
            )}
        >
            <ToolSidebarHeader title={"Border options"} description={"Modify border width of your design"} />
            <ScrollArea>
                <div
                    className="p-4 space-y-4 border-b"
                >
                    <Label
                        className="text-sm space-y-4 font-bold"
                    >
                        Border width
                        <Slider
                            value={[widthValue]}
                            onValueChange={(values) => onChangeStrokeWidth(values[0])}
                            className="w-full mt-4"
                        />
                    </Label>
                </div>
                <div
                    className="p-4 space-y-4 border-b"
                >
                    <Label
                        className="text-sm space-y-4 font-bold"
                    >
                        Border type
                        <Button
                            onClick={() => onChangeStrokeType([0, 0])}
                            size={"lg"}
                            variant={"secondary"}
                            className={cn("w-full h-16 justify-start text-left mt-4 hover:bg-sky-600 active:bg-sky-600",
                                typeValue[0] === 0 && typeValue[1] === 0 && "bg-sky-600"
                            )}
                        >
                            <div className="w-full border-black rounded-full border-2"/>
                        </Button>
                    </Label>
                </div>
                <div
                    className="p-4 space-y-4 border-b"
                >
                    <Label
                        className="text-sm space-y-4 font-bold"
                    >
                        Border type
                        <Button
                            onClick={() => onChangeStrokeType([10, 10])}
                            variant={"secondary"}
                            size={"lg"}
                            className={cn("w-full h-16 justify-start text-left mt-4  hover:bg-sky-600 active:bg-sky-600",
                                typeValue[0] === 10 && typeValue[1] === 10 && "bg-sky-600"
                            )}
                        >
                            <div className="w-full border-black rounded-full border-2 border-dashed"/>
                        </Button>
                    </Label>
                </div>
            </ScrollArea>
            <ToolSidebarClose closeSidebar={onClose} />
        </aside>
    );
};

export default StrokeWidthSideBar;