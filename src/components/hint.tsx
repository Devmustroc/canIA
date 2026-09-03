import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip"

import React from 'react';

export interface HintProps {
    label: string;
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    alight? : "start" | "center" | "end";
    sideOffset?: number;
    alignOffset?: number;
}

export const Hint = ({
    label,
    children,
    side = "top",
    alight = "center",
    sideOffset = 0,
    alignOffset = 0,
}: HintProps) => {
    return (
        <TooltipProvider>
            <Tooltip
                delayDuration={100}
            >
                <TooltipTrigger asChild>
                    { children }
                </TooltipTrigger>
                <TooltipContent
                    className="text-white bg-slate-800 border-slate-800"
                    side={side}
                    align={alight}
                    sideOffset={sideOffset}
                    alignOffset={alignOffset}
                >
                    <p
                        className="font-semibold capitalize"
                    >
                        { label }
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

