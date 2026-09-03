import React from 'react';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

interface SelectFontProps {
    fontFamily: string[];
}

const SelectFont = ({
    fontFamily
    }: SelectFontProps) => {
    const [open, setOpen] = React.useState(false);
    const [selectedFont, setSelectedFont] = React.useState<string | null>(null);
    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
        </Popover>
    );
};

export default SelectFont;