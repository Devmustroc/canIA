'use client'

import React, {useCallback, useEffect, useRef, useState} from 'react';

import {fabric} from "fabric";
import {ActiveTool, selectionDependentTools} from "../types";
import {useEditor} from "../hooks/useEditor";
import NavBar from "./navbar";
import SideBar from "./sidebar";
import ShapeSidebar from "./shape-sidebar";
import FillColorSideBar from "./shapeToolSidebar/fill-color-sidebar";
import StrokeColorSideBar from "./shapeToolSidebar/stroke-color-sidebar";
import StrokeWidthSideBar from "./shapeToolSidebar/stroke-width-sidebar";
import OpacitySideBar from "./shapeToolSidebar/opacity-sidebar";
import TextSideBar from "./shapeToolSidebar/text-sidebar";
import Toolbar from "./toolbar";
import Footer from "./footer";
import FontSideBar from "@/features/editor/components/shapeToolSidebar/font-sidebar";
import ImageSideBar from "@/features/editor/components/shapeToolSidebar/image-sidebar";
import FilterSideBar from "@/features/editor/components/shapeToolSidebar/filter-sidebar";
import AiSideBar from "@/features/editor/components/shapeToolSidebar/ia-sidebar";
import AgentSideBar from "@/features/editor/components/shapeToolSidebar/agent-sidebar";
import RemoveBgSideBar from "@/features/editor/components/shapeToolSidebar/remove-bg-sidebar";
import StickerImageSideBar from "@/features/editor/components/shapeToolSidebar/Sticker-sidebar";
import DrawSideBar from "@/features/editor/components/shapeToolSidebar/draw-sidebar";
import SettingsSideBar from "@/features/editor/components/shapeToolSidebar/settings-sidebar";
import ScaleSideBar from "@/features/editor/components/shapeToolSidebar/scale-sidebar";
import {ResponseType} from "@/features/projects/api/use-get-project";
import {useUpdateProject} from "@/features/projects/api/use-update-project";
import {debounce} from "effect/Stream";
import TemplateSideBar from "@/features/editor/components/shapeToolSidebar/template-sidebar";
import UploadSidebar from "@/features/editor/components/shapeToolSidebar/upload-sidebar";
import LayersSideBar from "@/features/editor/components/shapeToolSidebar/layers-sidebar";
import QrcodeSidebar from "@/features/editor/components/shapeToolSidebar/qrcode-sidebar";
import FramesSidebar from "@/features/editor/components/shapeToolSidebar/frames-sidebar";
import BrandSidebar from "@/features/editor/components/shapeToolSidebar/brand-sidebar";
import ChartsSidebar from "@/features/editor/components/shapeToolSidebar/charts-sidebar";
import AnimationSidebar from "@/features/editor/components/shapeToolSidebar/animation-sidebar";
import HistorySidebar from "@/features/editor/components/shapeToolSidebar/history-sidebar";
import CanAiChat from "@/features/editor/components/canai-chat";

interface EditorProps {
    initialData: ResponseType['data'];
}


const Editor = ({ initialData }: EditorProps) => {
    const { mutate } = useUpdateProject(initialData.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSave = useCallback((values: {
        json: string,
        height: number,
        width: number,
    }) => {
        mutate(values);
    }, [mutate]);

    const [ activeTool, setActiveTool ] = useState<ActiveTool>("select");

    const onClearSelection = useCallback(() => {
        if (selectionDependentTools.includes(activeTool)) {
            setActiveTool("select")
        }
    }, [activeTool]);

    const { init, editor } = useEditor({
        defaultState: initialData.json,
        defaultWidth: initialData.width,
        defaultHeight: initialData.height,
        onClearSelectionCallback: onClearSelection,
        saveCallback: debouncedSave
    });

    const onChangeActive = useCallback((tool: ActiveTool) => {

        if (tool === "draw") {
            editor?.enabledDrawingMode();
        }

        if (activeTool === "draw") {
           editor?.disabledDrawingMode();
        }

        if (tool === activeTool) {
            return setActiveTool("select")
        }
        setActiveTool(tool)
    }, [activeTool, editor]);

    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const canvas = new fabric.Canvas(
            canvasRef.current,
            {
                controlsAboveOverlay: true,
                preserveObjectStacking: true
            }
        )
        init({
            initialCanvas: canvas,
            initialContainer: containerRef.current!
        })

        return () => {
            canvas.dispose()
        }
    }, [init]);

    return (
        <div
            className="h-full flex flex-col"
        >
            <NavBar
                id={initialData.id}
                editor={editor}
                activeTool={activeTool}
                onChangeActiveTool={onChangeActive}
            />
            <div
                className="absolute h-[calc(100%-68px)] w-full flex top-[68px]"
            >
                <SideBar
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <ShapeSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <FillColorSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <StrokeColorSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <StrokeWidthSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <OpacitySideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <TextSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <FontSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <ImageSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <AiSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <AgentSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <FilterSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <RemoveBgSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <StickerImageSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <DrawSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <SettingsSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <ScaleSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <TemplateSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <UploadSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <LayersSideBar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <QrcodeSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <FramesSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <BrandSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <ChartsSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <AnimationSidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <HistorySidebar
                    editor={editor}
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActive}
                />
                <main
                    className="bg-muted flex-1 overflow-auto relative flex flex-col"
                >
                    <Toolbar
                        editor={editor}
                        activeTool={activeTool}
                        onChangeActiveTool={onChangeActive}
                        key={JSON.stringify(editor?.canvas.getActiveObject())}
                    />
                    <div
                        className="flex-1 h-[calc(100% - 124px)] bg-sky-100"
                        ref={containerRef}
                    >
                        <canvas ref={canvasRef}/>
                    </div>
                    <Footer
                        editor={editor}
                    />
                    <CanAiChat
                        editor={editor}
                    />
                </main>
            </div>
        </div>
    );
};

export default Editor;