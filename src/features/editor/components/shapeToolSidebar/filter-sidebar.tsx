'use client'

import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import ToolSidebarHeader from "./tool-sidebar-header";
import ToolSidebarClose from "./tool-sidebar-close";
import {ActiveTool, EditorProps, filters, fonts} from "../../types";
import {Button} from "@/components/ui/button";


interface FontSideBarProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const FilterSideBar = ({
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
                activeTool === "filter" ? "visible" : "hidden"
            )}
        >
            <ToolSidebarHeader title={"Filters"} description={"Apply filters to selected Images"} />
            <ScrollArea>
                <div
                    className="p-4 space-y-4 border-b"
                >
                    {
                        filters.map((filter) => (
                            <Button
                                key={filter}
                                size="lg"
                                variant="secondary"
                                className={cn("w-full text-left justify-start h-16 hover:bg-sky-400 active:bg-sky-600",
                                )}
                                onClick={() => editor?.changeImageFilter(filter)}
                            >
                                {filter}
                            </Button>
                        ))
                    }
                </div>
            </ScrollArea>
            <ToolSidebarClose closeSidebar={onClose} />
        </aside>
    );
};

export default FilterSideBar;