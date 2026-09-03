'use client'

import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import ToolSidebarHeader from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-sidebar-close";
import {ActiveTool, EditorProps, fonts} from "../../types";
import {Button} from "@/components/ui/button";


interface FontSideBarProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const FontSideBar = ({
                          editor,
                          activeTool,
                          onChangeActiveTool,
                      }: FontSideBarProps) => {



    const onClose = () => {
        onChangeActiveTool("select");
    }


    return (
        <aside
            className={cn(
                `bg-white relative border-r z-[40] w-[360px] h-full flex flex-col`,
                activeTool === "font" ? "visible" : "hidden"
            )}
        >
            <ToolSidebarHeader title={"Font"} description={"Modify text font"} />
            <ScrollArea>
                <div
                    className="p-4 space-y-4 border-b"
                >
                    {
                        fonts.map((font) => (
                            <Button
                                key={font}
                                size="lg"
                                variant="secondary"
                                className={cn("w-full text-left justify-start h-16 hover:bg-sky-400 active:bg-sky-600",
                                    font === editor?.getActiveFontFamily() ? "bg-sky-600 text-white" : ""
                                )}
                                style={{
                                    fontFamily: `${font}, sans-serif`,
                                    fontSize: 18,
                                    padding: "0 16px"
                                }}
                                onClick={() => editor?.changeFontFamily(font)}
                            >
                                {font}
                            </Button>
                        ))
                    }
                </div>
            </ScrollArea>
            <ToolSidebarClose closeSidebar={onClose} />
        </aside>
    );
};

export default FontSideBar;