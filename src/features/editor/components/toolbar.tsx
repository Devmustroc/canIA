'use client'

import React, {useState} from 'react';

import {Hint} from "@/components/hint";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {BsBorderWidth} from "react-icons/bs";
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    ArrowDown,
    ArrowUp,
    ChevronDown, Copy,
    SquareSplitVertical,
    Trash,
    AlignHorizontalSpaceBetween,
    AlignVerticalSpaceBetween
} from "lucide-react";
import {RxTransparencyGrid} from "react-icons/rx";
import {ActiveTool, EditorProps, FONT_SIZE, FONT_WEIGHT} from "../types";
import {isTextType} from "../utils";
import {FaBold, FaItalic, FaStrikethrough, FaUnderline} from "react-icons/fa";
import FontSizeInput from "@/features/editor/components/font-size-input";
import {TbColorFilter} from "react-icons/tb";
import {GiFishScales} from "react-icons/gi";
import { AiTextPopover } from "@/features/editor/components/ai-text-popover";
import { TextEffectsPopover } from "@/features/editor/components/text-effects-popover";
import { VectorizeButton } from "@/features/editor/components/vectorize-button";





interface ToolbarProps {
    editor: EditorProps | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const Toolbar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: ToolbarProps) => {
    const selectedObject = editor?.canvas.getActiveObject();

    const getProperty = (property: any) => {
        if (!selectedObject) return null;
        return selectedObject.get(property);
    }

    const initialFillColor = editor?.getActiveColor();
    const initialStrokeColor = editor?.getActiveStrokeColor();
    const initialFontFamily = editor?.getActiveFontFamily();
    const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
    const initialFontLinethrough = editor?.getActiveFontLineThrough();
    const initialFontUnderline = editor?.getActiveFontUnderline();
    const initialTextAlign = editor?.getActiveTextAlign();
    const initialFontStyle = editor?.getActiveFontStyle();
    const intialFontSize = editor?.getActiveFontSize() || FONT_SIZE;


    const objectType = getProperty("type");

    const isSelectedText = isTextType(objectType);
    const isSelectedImage = objectType === "image";

    const [properties , setProperties] = useState({
        fillColor: initialFillColor,
        fontWeight: initialFontWeight,
        strokeColor: initialStrokeColor,
        fontFamily: initialFontFamily,
        fontStyle: initialFontStyle,
        fontLineThrough: initialFontLinethrough,
        fontUnderline: initialFontUnderline,
        textAlign: initialTextAlign,
        fontSize: intialFontSize
    });

    if (editor?.selectedObject.length === 0) {
        return (
            <div
                className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2"
            />
        )
    }

    const onChangeTextAlign = (value: string) => {
        if (!selectedObject) return;
        editor?.changeTextAlign(value);
        setProperties((prev) => ({
            ...prev,
            textAlign: value
        }));
    }

    const onChangeFontSize = (value: number) => {
        if (!selectedObject) return;
        editor?.changeFontSize(value);
        setProperties((prev) => ({
            ...prev,
            fontSize: value
        }));
    }

    const toggleBold = () => {
        if (!selectedObject) return;
        const newValue = properties.fontWeight > 500 ? 300 : 700;
        editor?.changeFontWeight(newValue);
        setProperties((prev) => ({
            ...prev,
            fontWeight: newValue
        }));
    }

    const toggleItalic = () => {
        if (!selectedObject) return;
        const newValue = properties.fontStyle === "normal" ? "italic" : "normal";
        editor?.changeFontStyle(newValue);
        setProperties((prev) => ({
            ...prev,
            fontStyle: newValue
        }));
    }

    const toggleLineThrough = () => {
        if (!selectedObject) return;
        const newValue = properties.fontLineThrough !== true;
        editor?.changeFontLineTrough(newValue);
        setProperties((prev) => ({
            ...prev,
            fontLineThrough: newValue
        }));
    }

    const toggleUnderline= () => {
        if (!selectedObject) return;
        const newValue = properties.fontUnderline !== true;
        editor?.changeFontUnderline(newValue);
        setProperties((prev) => ({
            ...prev,
            fontUnderline: newValue
        }));
    }


    return (
        <div
            className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2"
        >
            {
                !isSelectedImage && (
                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <Hint
                            label="Color"
                            side={"bottom"}
                            sideOffset={5}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => onChangeActiveTool("fill")}
                                size={"icon"}
                                className={cn(
                                    `border-2 border-gray-950 rounded-md`,
                                    activeTool === "fill" ? "bg-gray-100" : "bg-white",
                                )}
                            >
                                <div
                                    className="w-[80%] h-[80%] border rounded-md"
                                    style={{
                                        backgroundColor: typeof initialFillColor === "string" ? properties.fillColor : "black"
                                    }}
                                />
                            </Button>
                        </Hint>
                    </div>
                )
            }
            {
                !isSelectedText && (

                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <Hint
                            label="Border Color"
                            side={"bottom"}
                            sideOffset={5}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => onChangeActiveTool("stroke-color")}
                                size={"icon"}
                                className={cn(
                                    activeTool === "stroke-color" ? "bg-gray-100" : "bg-white",
                                )}
                            >
                                <div
                                    className="w-[80%] h-[80%] border rounded-md p-2"
                                    style={{
                                        borderColor: typeof initialStrokeColor === "string" ? properties.strokeColor : "black"
                                    }}
                                />
                            </Button>
                        </Hint>
                    </div>
                )
            }
            {
                !isSelectedText && (
                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <Hint
                            label="Border width"
                            side={"bottom"}
                            sideOffset={5}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => onChangeActiveTool("stroke-width")}
                                size={"icon"}
                                className={cn(
                                    activeTool === "stroke-width" ? "bg-gray-100" : "bg-white",
                                )}
                            >
                                <BsBorderWidth
                                    className="size-6"
                                />
                            </Button>
                        </Hint>
                    </div>
                )
            }
            {
                isSelectedText && (
                    <div className="flex items-center justify-center h-full gap-x-2">
                        <AiTextPopover editor={editor} />
                    </div>
                )
            }
            {
                isSelectedText && (
                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <Hint
                            label="Font"
                            side={"bottom"}
                            sideOffset={5}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => onChangeActiveTool("font")}
                                size={"icon"}
                                className={cn(
                                    "w-auto px-2 text-sm",
                                    activeTool === "font" ? "bg-gray-100" : "bg-white",
                                )}
                            >
                                <div
                                    className="max-w-[300px] border rounded-md p-2 truncate"
                                >
                                    {properties.fontFamily}
                                </div>
                                <ChevronDown
                                    className="size-6"
                                />
                            </Button>
                        </Hint>
                    </div>
                )
            }
            {
                isSelectedText && (
                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <Hint
                            label="Bold"
                            side={"bottom"}
                            sideOffset={5}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => toggleBold()}
                                size={"icon"}
                                className={cn(
                                    properties.fontWeight > 500 && "bg-gray-200",
                                )}
                            >
                                <FaBold
                                    className="size-4"
                                />
                            </Button>
                        </Hint>
                    </div>
                )
            }
            {
                isSelectedText && (
                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <Hint
                            label="Italic"
                            side={"bottom"}
                            sideOffset={5}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => toggleItalic()}
                                size={"icon"}
                                className={cn(
                                    properties.fontStyle === "italic" && "bg-gray-200",
                                )}
                            >
                                <FaItalic
                                    className="size-4"
                                />
                            </Button>
                        </Hint>
                    </div>
                )
            }
            {
                isSelectedText && (
                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <Hint
                            label="underline"
                            side={"bottom"}
                            sideOffset={5}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => toggleUnderline()}
                                size={"icon"}
                                className={cn(
                                    properties.fontUnderline && "bg-gray-200",
                                )}
                            >
                                <FaUnderline
                                    className="size-4"
                                />
                            </Button>
                        </Hint>
                    </div>
                )
            }
            {
                isSelectedText && (
                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <Hint
                            label="Strike"
                            side={"bottom"}
                            sideOffset={5}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => toggleLineThrough()}
                                size={"icon"}
                                className={cn(
                                    properties.fontUnderline && "bg-gray-200",
                                )}
                            >
                                <FaStrikethrough
                                    className="size-4"
                                />
                            </Button>
                        </Hint>
                    </div>
                )
            }
            {
                isSelectedText && (
                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <Hint
                            label="Text align"
                            side={"bottom"}
                            sideOffset={5}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => onChangeTextAlign("left")}
                                size={"icon"}
                                className={cn(
                                    properties.textAlign === "left" && "bg-gray-200",
                                )}
                            >
                                <AlignLeft
                                    className="size-4"
                                />
                            </Button>
                        </Hint>
                    </div>
                )
            }
            {
                isSelectedText && (
                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <Hint
                            label="Text align"
                            side={"bottom"}
                            sideOffset={5}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => onChangeTextAlign("center")}
                                size={"icon"}
                                className={cn(
                                    properties.textAlign === "center" && "bg-gray-200",
                                )}
                            >
                                <AlignCenter
                                    className="size-4"
                                />
                            </Button>
                        </Hint>
                    </div>
                )
            }
            {
                isSelectedText && (
                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <Hint
                            label="Text align"
                            side={"bottom"}
                            sideOffset={5}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => onChangeTextAlign("right")}
                                size={"icon"}
                                className={cn(
                                    properties.textAlign === "right" && "bg-gray-200",
                                )}
                            >
                                <AlignRight
                                    className="size-4"
                                />
                            </Button>
                        </Hint>
                    </div>
                )
            }
            {
                isSelectedText && (
                    <div className="flex items-center justify-center h-full gap-x-2 border-blue-500">
                        <TextEffectsPopover editor={editor} />
                    </div>
                )
            }
            {
                isSelectedImage && (
                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <Hint
                            label="Remove background"
                            side={"bottom"}
                            sideOffset={5}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => onChangeActiveTool("remove-bg")}
                                size={"icon"}
                                className={cn(
                                    activeTool === "remove-bg" && "bg-gray-200",
                                )}
                            >
                                <SquareSplitVertical
                                    className="size-6"
                                />
                            </Button>
                        </Hint>
                    </div>
                )
            }
            {
                isSelectedImage && (
                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <Hint
                            label="Filter"
                            side={"bottom"}
                            sideOffset={5}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => onChangeActiveTool("filter")}
                                size={"icon"}
                                className={cn(
                                    activeTool === "filter" && "bg-gray-200",
                                )}
                            >
                                <TbColorFilter
                                    className="size-6"
                                />
                            </Button>
                        </Hint>
                    </div>
                )
            }
            {
                isSelectedImage && (
                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <Hint
                            label="Scale"
                            side={"bottom"}
                            sideOffset={5}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => onChangeActiveTool("scale")}
                                size={"icon"}
                                className={cn(
                                    activeTool === "scale" && "bg-gray-200",
                                )}
                            >
                                <GiFishScales
                                    className="size-6"
                                />
                            </Button>
                        </Hint>
                    </div>
                )
            }
            {
                isSelectedImage && (
                    <div className="flex items-center justify-center h-full gap-x-2">
                        <VectorizeButton editor={editor} />
                    </div>
                )
            }
            {
                isSelectedText && (
                    <div
                        className="flex items-center justify-center h-full gap-x-2 border-blue-500"
                    >
                        <FontSizeInput
                            value={properties.fontSize}
                            onChange={onChangeFontSize}
                        />
                    </div>
                )
            }
            <div
                className="flex items-center justify-center h-full gap-x-2 border-blue-500"
            >
                <Hint
                    label="Position forward"
                    side={"bottom"}
                    sideOffset={5}
                >
                    <Button
                        variant="ghost"
                        onClick={() => editor?.bringForward()}
                        size={"icon"}
                    >
                        <ArrowUp
                            className="size-6"
                        />
                    </Button>
                </Hint>
            </div>
            <div
                className="flex items-center justify-center h-full gap-x-2 border-blue-500"
            >
                <Hint
                    label="Position backward"
                    side={"bottom"}
                    sideOffset={5}
                >
                    <Button
                        variant="ghost"
                        onClick={() => editor?.sendBackward()}
                        size={"icon"}
                    >
                        <ArrowDown
                            className="size-6"
                        />
                    </Button>
                </Hint>
            </div>
            <div
                className="flex items-center justify-center h-full gap-x-2 border-blue-500"
            >
                <Hint
                    label="Opacity"
                    side={"bottom"}
                    sideOffset={5}
                >
                    <Button
                        variant="ghost"
                        onClick={() => onChangeActiveTool("opacity")}
                        size={"icon"}
                        className={cn(
                            activeTool === "opacity" ? "bg-gray-100" : "bg-white",
                        )}
                    >
                        <RxTransparencyGrid
                            className="size-6"
                        />
                    </Button>
                </Hint>
            </div>
            <div className="flex items-center justify-center h-full gap-x-2 border-blue-500">
                <Hint label="Distribuer horizontalement" side={"bottom"} sideOffset={5}>
                    <Button
                        variant="ghost"
                        onClick={() => editor?.distributeObjects("horizontal")}
                        size={"icon"}
                    >
                        <AlignHorizontalSpaceBetween className="size-5" />
                    </Button>
                </Hint>
            </div>
            <div className="flex items-center justify-center h-full gap-x-2 border-blue-500">
                <Hint label="Distribuer verticalement" side={"bottom"} sideOffset={5}>
                    <Button
                        variant="ghost"
                        onClick={() => editor?.distributeObjects("vertical")}
                        size={"icon"}
                    >
                        <AlignVerticalSpaceBetween className="size-5" />
                    </Button>
                </Hint>
            </div>
            <div
                className="flex items-center justify-center h-full gap-x-2 border-blue-500"
            >
                <Hint
                    label="Duplicate"
                    side={"bottom"}
                    sideOffset={5}
                >
                    <Button
                        variant="ghost"
                        onClick={() => {
                            editor?.copy();
                            editor?.paste();
                        }}
                        size={"icon"}
                    >
                        <Copy
                            className="size-6"
                        />
                    </Button>
                </Hint>
            </div>
            <div
                className="flex items-center justify-center h-full gap-x-2 border-blue-500"
            >
                <Hint
                    label="Delete"
                    side={"bottom"}
                    sideOffset={5}
                >
                    <Button
                        variant="ghost"
                        onClick={() => editor?.deleteActiveObject()}
                        size={"icon"}
                    >
                        <Trash
                            className="size-6"
                        />
                    </Button>
                </Hint>
            </div>
        </div>
    );
};

export default Toolbar;