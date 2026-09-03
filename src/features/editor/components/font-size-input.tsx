import React from 'react';
import {Button} from "@/components/ui/button";
import {Minus, Plus} from "lucide-react";
import {Input} from "@/components/ui/input";

interface FontSizeInputProps {
    value: number;
    onChange: (value: number) => void;
}


const FontSizeInput = ({
    value,
    onChange
}: FontSizeInputProps) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        onChange(value);
    }
    return (
        <div
            className="flex items-center"
        >
            <Button
                onClick={() => onChange(value - 1)}
                variant={"outline"}
                className={"rounded-full py-1 px-3 rounded-r-none border-r-none"}
                size={"icon"}
            >
                <Minus
                    className="w-6 h-6"
                />
            </Button>
            <Input
                onChange={handleChange}
                value={value}
                type={"text"}
                className="w-[50px] h-10 focus-visible:ring-offset-0 rounded-none focus-visible:ring-0 border-r-none border-l-none"
            />
            <Button
                onClick={() => onChange(value + 1)}
                variant={"outline"}
                className={"rounded-full py-1 px-3 rounded-l-none border-l-none"}
                size={"icon"}
            >
                <Plus
                    className="w-6 h-6"
                />
            </Button>
        </div>
    );
};

export default FontSizeInput;