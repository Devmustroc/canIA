import {useCallback, useMemo, useRef, useState} from "react";
import {fabric} from "fabric";
import {uuid} from "uuidv4";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
// @ts-ignore
import ImageTracer from "imagetracerjs";
import {useAutoResize} from "./use-auto-resize";
import {
    AgentAlignment,
    AgentArrangeOrder,
    BuildEditorProps,
    CanvasObjectSummary,
    CIRCLE_OPTIONS,
    DIAMOND_OPTIONS,
    EditorHookProps,
    EditorProps,
    FILL_COLOR,
    FONT_FAMILY, FONT_SIZE, FONT_STYLE, FONT_WEIGHT, JSON_KEYS,
    RECTANGLE_OPTIONS,
    ShapeOptions,
    STROKE_COLOR,
    STROKE_DASH_ARRAY,
    STROKE_WIDTH,
    TEXT_OPTIONS,
    TRIANGLE_OPTIONS
} from "../types";
import {useCanvasEvents} from "./use-canvas-events";
import {createFilter, downloadFile, isTextType, transformText} from "../utils";
import {useClipboard} from "@/features/editor/hooks/use-clipboard";
import {useHistoryHook} from "@/features/editor/hooks/use-history-hook";
import {useHotKeys} from "@/features/editor/hooks/use-hot-keys";
import {useWindowEvent} from "@/features/editor/hooks/use-window-event";
import {useLoadState} from "@/features/editor/hooks/use-load-state";


const buildEditor = ({
        canvas ,
        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        selectedObject,
        strokeDashArray,
        setStrokeDashArray,
        fontFamily,
        setFontFamily,
        copy,
        paste,
        autoZoom,
        canUndo,
        canRedo,
        save,
        undo,
        redo,
        canvasHistory,
        setHistoryIdx
}: BuildEditorProps) : EditorProps => {
    const getWorkSpace = () => {

        let workspace: fabric.Rect | undefined;
        workspace = canvas.getObjects().find((object) => {
            return object.name === "clip"
        });
        return workspace;
    }
    const generateSaveOptions = () => {
        canvas.getObjects().forEach((obj) => {
            if (obj.clipPath) {
                const cp = obj.clipPath;
                if (!cp.width || cp.width <= 0) cp.width = obj.width || 100;
                if (!cp.height || cp.height <= 0) cp.height = obj.height || 100;
                if (!cp.scaleX || cp.scaleX <= 0) cp.scaleX = 1;
                if (!cp.scaleY || cp.scaleY <= 0) cp.scaleY = 1;
                cp.setCoords();
            }
        });
        const {width, height, left, top} = getWorkSpace() as fabric.Rect;

        return {
            name:"Image",
            format: "png",
            quality: 1,
            width: width,
            height: height,
            left: left,
            top: top,
        };
    }



    const saveAsPng = () => {
        const options = generateSaveOptions();
        const prevClip = canvas.clipPath;
        canvas.clipPath = undefined;

        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        const dataUrl = canvas.toDataURL(options);
        canvas.clipPath = prevClip;

        downloadFile(dataUrl, "png")
        autoZoom()
    }

    const saveAsSvg = () => {
        const options = generateSaveOptions();
        const prevClip = canvas.clipPath;
        canvas.clipPath = undefined;

        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        const dataUrl = canvas.toSVG(options);
        canvas.clipPath = prevClip;

        downloadFile(dataUrl, "svg")
        autoZoom()
    }

    const saveAsJpeg = () => {
        const options = generateSaveOptions();
        const prevClip = canvas.clipPath;
        canvas.clipPath = undefined;

        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        const dataUrl = canvas.toDataURL(options);
        canvas.clipPath = prevClip;

        downloadFile(dataUrl, "jpg")
        autoZoom()
    }

    const saveAsPdf = () => {
        const options = generateSaveOptions();
        const prevClip = canvas.clipPath;
        canvas.clipPath = undefined;

        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        const dataUrl = canvas.toDataURL({
            ...options,
            format: "jpeg",
            quality: 1,
        });
        canvas.clipPath = prevClip;

        const width = options.width || 800;
        const height = options.height || 600;
        const orientation = width > height ? "landscape" : "portrait";

        const doc = new jsPDF({
            orientation,
            unit: "pt",
            format: [width, height],
        });

        doc.addImage(dataUrl, "JPEG", 0, 0, width, height);
        doc.save("design.pdf");
        autoZoom();
    }

    const saveAsJson = async () => {
        const dataUrl = canvas.toJSON(JSON_KEYS);

        await transformText(dataUrl.objects);
        const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataUrl, null, 2))}`;
        downloadFile(fileString, "json")

    }

    const loadJson = (json: string) => {
        const data = JSON.parse(json);

        canvas.loadFromJSON(data, () => {
            autoZoom()
        })
    }

    const center = (object: fabric.Object) => {
        const workspace = getWorkSpace();
        const center = workspace?.getCenterPoint();

        if (!center) return;

        // @ts-ignore
        canvas._centerObject(object, center)
    }
    const addToCanvas = (object: fabric.Object) => {
        if (!(object as any).id) {
            object.set({ id: uuid() } as Partial<fabric.Object>)
        }
        center(object)
        canvas.add(object)
        canvas.setActiveObject(object)
    }
    return {
        saveAsPng,
        saveAsSvg,
        saveAsJpeg,
        saveAsPdf,
        saveAsJson,
        loadJson,
        autoZoom,
        zoomIn: () => {
            let zoomRatio = canvas.getZoom();
            zoomRatio += 0.05;
            const center = canvas.getCenter();
            canvas.zoomToPoint(
                new fabric.Point(center.left, center.top),
                zoomRatio
            );
        },
        zoomOut: () => {
            let zoomRatio = canvas.getZoom();
            zoomRatio -= 0.05;
            const center = canvas.getCenter();
            canvas.zoomToPoint(
                new fabric.Point(center.left, center.top),
                zoomRatio < 0.2 ? 0.2 : zoomRatio
            );
        },
        getWorkSpace: () => getWorkSpace(),
        changeSize: (size: { width: number, height: number} ) => {
            const worksapce = getWorkSpace();

            worksapce?.set(size)
            autoZoom()
            save()
        },
        changeBackground: (value: string) => {
            const workspace = getWorkSpace();

            workspace?.set({ fill: value})
            canvas.renderAll()
            save()
        },
        enabledDrawingMode: () => {
            canvas.discardActiveObject();
            canvas.renderAll();
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.width = strokeWidth;
            canvas.freeDrawingBrush.color = strokeColor;
        },
        disabledDrawingMode: () => {
            canvas.isDrawingMode = false;
        },
        onUndo: () => undo(),
        onRedo: () => redo(),
        canUndo: () => canUndo(),
        canRedo: () => canRedo(),
        copy: () => copy(),
        paste: () => paste(),
        deleteActiveObject: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.remove(object)
            })
            canvas.discardActiveObject();
            canvas.renderAll()
        },
        addText: (value, options) => {
            const object = new fabric.Textbox(value, {
                ...TEXT_OPTIONS,
                fill: fillColor,
                ...options
            })
            addToCanvas(object)
            return object
        },
        addCircle: (options: ShapeOptions = {}) => {
           const object = new fabric.Circle({
               ...CIRCLE_OPTIONS,
               fill: fillColor,
               stroke: strokeColor,
               strokeWidth: strokeWidth,
                strokeDashArray,
                ...options
           });
            addToCanvas(object)
            return object
        },
        addSoftRectangle: (options: ShapeOptions = {}) => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                rx: 40,
                ry: 40,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray,
                ...options
            });
            addToCanvas(object)
            return object
        },
        addRectangle: (options: ShapeOptions = {}) => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray,
                ...options
            });
            addToCanvas(object)
            return object
        },
        addTriangle: (options: ShapeOptions = {}) => {
            const object = new fabric.Triangle({
                ...TRIANGLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray,
                ...options
            });
            addToCanvas(object)
            return object
        },
        addInverseTriangle: (options: ShapeOptions = {}) => {
            const HEIGHT = 400;
            const WIDTH = 400;
            const object = new fabric.Polygon(
                [
                    {x: 0 , y: 0},
                    {x: WIDTH, y: 0},
                    {x: WIDTH / 2, y: HEIGHT}
                ],
                {
                    ...TRIANGLE_OPTIONS,
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    strokeDashArray,
                    ...options
                }
            );
            addToCanvas(object)
            return object
        },
        addDiamond: (options: ShapeOptions = {}) => {
            const HEIGHT = DIAMOND_OPTIONS.height;
            const WIDTH = DIAMOND_OPTIONS.width;
            const object = new fabric.Polygon(
                [
                    {x: WIDTH / 2 , y: 0},
                    {x: WIDTH, y: HEIGHT / 2},
                    {x: WIDTH / 2, y: HEIGHT},
                    {x: 0, y: HEIGHT / 2}
                ],
                {
                    ...DIAMOND_OPTIONS,
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    strokeDashArray,
                    ...options
                }
            )
            addToCanvas(object)
            return object
        },
        addImage: (url: string) => {
            return new Promise<fabric.Image>((resolve, reject) => {
                fabric.Image.fromURL(url, (image) => {
                    if (!image.getElement()) {
                        reject(new Error("Failed to load image"));
                        return;
                    }
                    const workspace = getWorkSpace();
                    image.scaleToWidth(workspace?.width || 0)
                    image.scaleToHeight(workspace?.height || 0)
                    addToCanvas(image)
                    resolve(image)
                },
                    {
                        crossOrigin: "anonymous"
                })
            })
        },
        addQrCode: async (url: string, options?: { fgColor?: string; bgColor?: string }) => {
            try {
                const dataUrl = await QRCode.toDataURL(url, {
                    width: 800,
                    margin: 2,
                    color: {
                        dark: options?.fgColor || "#000000",
                        light: options?.bgColor || "#ffffff",
                    },
                });
                return new Promise<fabric.Image>((resolve, reject) => {
                    fabric.Image.fromURL(dataUrl, (image) => {
                        if (!image.getElement()) {
                            reject(new Error("Failed to load QR code image"));
                            return;
                        }
                        const workspace = getWorkSpace();
                        const workspaceWidth = workspace?.width || 400;
                        const workspaceHeight = workspace?.height || 400;
                        const targetSize = Math.min(workspaceWidth, workspaceHeight) * 0.4;
                        image.scaleToWidth(targetSize);
                        image.scaleToHeight(targetSize);
                        (image as any).id = uuid();
                        (image as any).name = "qrcode";
                        addToCanvas(image);
                        resolve(image);
                    });
                });
            } catch (err) {
                console.error("Failed to generate QR code", err);
                return undefined;
            }
        },
        addFramedImage: (frameType: string, url: string) => {
            return new Promise<fabric.Image>((resolve, reject) => {
                fabric.Image.fromURL(
                    url,
                    (image) => {
                        if (!image.getElement()) {
                            reject(new Error("Failed to load image"));
                            return;
                        }
                        const workspace = getWorkSpace();
                        const targetWidth = (workspace?.width || 800) * 0.5;
                        image.scaleToWidth(targetWidth);

                        const width = image.width || 300;
                        const height = image.height || 300;

                        const size = Math.min(width, height);
                        let clipPath: fabric.Object;

                        if (frameType === "circle") {
                            clipPath = new fabric.Circle({
                                radius: size / 2,
                                originX: "center",
                                originY: "center",
                            });
                        } else if (frameType === "rounded_rect") {
                            clipPath = new fabric.Rect({
                                width: width,
                                height: height,
                                rx: size * 0.15,
                                ry: size * 0.15,
                                originX: "center",
                                originY: "center",
                            });
                        } else if (frameType === "star") {
                            const points = [];
                            const numPoints = 5;
                            const outerRadius = size / 2;
                            const innerRadius = outerRadius * 0.4;
                            for (let i = 0; i < numPoints * 2; i++) {
                                const r = i % 2 === 0 ? outerRadius : innerRadius;
                                const angle = (i * Math.PI) / numPoints - Math.PI / 2;
                                points.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) });
                            }
                            clipPath = new fabric.Polygon(points, {
                                originX: "center",
                                originY: "center",
                            });
                        } else if (frameType === "hexagon") {
                            const points = [];
                            const r = size / 2;
                            for (let i = 0; i < 6; i++) {
                                const angle = (i * Math.PI) / 3 - Math.PI / 6;
                                points.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) });
                            }
                            clipPath = new fabric.Polygon(points, {
                                originX: "center",
                                originY: "center",
                            });
                        } else if (frameType === "diamond") {
                            const r = size / 2;
                            const points = [
                                { x: 0, y: -r },
                                { x: r, y: 0 },
                                { x: 0, y: r },
                                { x: -r, y: 0 },
                            ];
                            clipPath = new fabric.Polygon(points, {
                                originX: "center",
                                originY: "center",
                            });
                        } else {
                            clipPath = new fabric.Rect({
                                width: width,
                                height: height,
                                rx: 20,
                                ry: 20,
                                originX: "center",
                                originY: "center",
                            });
                        }

                        if (!clipPath.width || clipPath.width <= 0) clipPath.width = width || size;
                        if (!clipPath.height || clipPath.height <= 0) clipPath.height = height || size;
                        clipPath.setCoords();

                        image.set("clipPath", clipPath);
                        (image as any).id = uuid();
                        (image as any).name = `framed-${frameType}`;
                        addToCanvas(image);
                        resolve(image);
                    },
                    { crossOrigin: "anonymous" }
                );
            });
        },
        applyClipPathToActiveImage: (frameType: string) => {
            const activeObject = canvas.getActiveObject();
            if (!activeObject || activeObject.type !== "image") return;
            const img = activeObject as fabric.Image;
            const width = img.width || 300;
            const height = img.height || 300;
            const size = Math.min(width, height);
            let clipPath: fabric.Object;

            if (frameType === "circle") {
                clipPath = new fabric.Circle({
                    radius: size / 2,
                    originX: "center",
                    originY: "center",
                });
            } else if (frameType === "rounded_rect") {
                clipPath = new fabric.Rect({
                    width: width,
                    height: height,
                    rx: size * 0.15,
                    ry: size * 0.15,
                    originX: "center",
                    originY: "center",
                });
            } else if (frameType === "star") {
                const points = [];
                const numPoints = 5;
                const outerRadius = size / 2;
                const innerRadius = outerRadius * 0.4;
                for (let i = 0; i < numPoints * 2; i++) {
                    const r = i % 2 === 0 ? outerRadius : innerRadius;
                    const angle = (i * Math.PI) / numPoints - Math.PI / 2;
                    points.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) });
                }
                clipPath = new fabric.Polygon(points, {
                    originX: "center",
                    originY: "center",
                });
            } else if (frameType === "hexagon") {
                const points = [];
                const r = size / 2;
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3 - Math.PI / 6;
                    points.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) });
                }
                clipPath = new fabric.Polygon(points, {
                    originX: "center",
                    originY: "center",
                });
            } else if (frameType === "diamond") {
                const r = size / 2;
                const points = [
                    { x: 0, y: -r },
                    { x: r, y: 0 },
                    { x: 0, y: r },
                    { x: -r, y: 0 },
                ];
                clipPath = new fabric.Polygon(points, {
                    originX: "center",
                    originY: "center",
                });
            } else {
                clipPath = new fabric.Rect({
                    width: width,
                    height: height,
                    rx: 20,
                    ry: 20,
                    originX: "center",
                    originY: "center",
                });
            }

            if (!clipPath.width || clipPath.width <= 0) clipPath.width = width || size;
            if (!clipPath.height || clipPath.height <= 0) clipPath.height = height || size;
            clipPath.setCoords();

            img.set("clipPath", clipPath);
            canvas.renderAll();
            save();
        },
        vectorizeActiveImage: async (options?: { numberofcolors?: number }) => {
            const activeObject = canvas.getActiveObject();
            if (!activeObject || activeObject.type !== "image") return;
            const img = activeObject as fabric.Image;
            const element = img.getElement() as HTMLImageElement | HTMLCanvasElement;

            let src = "";
            if (element instanceof HTMLImageElement && element.src) {
                src = element.src;
            } else if (element instanceof HTMLCanvasElement) {
                src = element.toDataURL("image/png");
            } else {
                src = img.toDataURL({ format: "png" });
            }

            return new Promise<void>((resolve, reject) => {
                try {
                    ImageTracer.imageToSVG(
                        src,
                        (svgString: string) => {
                            if (!svgString) {
                                reject(new Error("Tracing failed"));
                                return;
                            }
                            fabric.loadSVGFromString(svgString, (objects, svgOptions) => {
                                if (!objects || objects.length === 0) {
                                    reject(new Error("Failed to parse SVG objects"));
                                    return;
                                }
                                const svgGroup = fabric.util.groupSVGElements(objects, svgOptions);

                                const left = img.left || 0;
                                const top = img.top || 0;
                                const scaleX = img.scaleX || 1;
                                const scaleY = img.scaleY || 1;
                                const angle = img.angle || 0;

                                const imgWidth = (img.width || 300) * scaleX;
                                const imgHeight = (img.height || 300) * scaleY;

                                svgGroup.set({
                                    left,
                                    top,
                                    angle,
                                    scaleX: imgWidth / (svgGroup.width || 1),
                                    scaleY: imgHeight / (svgGroup.height || 1),
                                });

                                (svgGroup as any).id = uuid();
                                (svgGroup as any).name = "vectorized-svg";

                                canvas.remove(img);
                                addToCanvas(svgGroup);
                                canvas.setActiveObject(svgGroup);
                                canvas.renderAll();
                                save();
                                resolve();
                            });
                        },
                        {
                            numberofcolors: options?.numberofcolors || 16,
                            strokewidth: 1,
                            viewbox: true,
                        }
                    );
                } catch (err) {
                    console.error("Vectorization failed", err);
                    reject(err);
                }
            });
        },
        applyBrandPalette: (palette: string[]) => {
            if (!palette || palette.length === 0) return;
            const workspace = getWorkSpace();
            const bgColor = palette[palette.length - 1] || "#ffffff";
            workspace?.set({ fill: bgColor });

            const nonClipObjects = canvas.getObjects().filter((obj) => obj.name !== "clip");
            nonClipObjects.forEach((obj, idx) => {
                const primaryColor = palette[idx % Math.max(1, palette.length - 1)];
                const accentColor = palette[(idx + 1) % Math.max(1, palette.length - 1)];

                if (isTextType(obj.type)) {
                    obj.set({ fill: primaryColor });
                } else if (obj.type === "rect" || obj.type === "circle" || obj.type === "triangle" || obj.type === "polygon") {
                    obj.set({ fill: primaryColor, stroke: accentColor });
                } else if (obj.type === "path") {
                    obj.set({ stroke: primaryColor });
                }
            });

            canvas.renderAll();
            save();
        },
        addChart: (
            type: "bar" | "pie" | "line" | "donut",
            config?: { labels?: string[]; data?: number[]; title?: string; colors?: string[] }
        ) => {
            const workspace = getWorkSpace();
            const labels = config?.labels || ["Jan", "Fév", "Mar", "Avr", "Mai"];
            const data = config?.data || [45, 75, 55, 90, 60];
            const titleText = config?.title || "Rapport de Performance";
            const colors = config?.colors || ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EC4899"];

            const chartObjects: fabric.Object[] = [];

            // Title
            const title = new fabric.Text(titleText, {
                fontSize: 18,
                fontFamily: "Arial",
                fontWeight: "bold",
                fill: "#1E293B",
                left: 0,
                top: 0,
            });
            chartObjects.push(title);

            if (type === "bar") {
                const barWidth = 36;
                const gap = 16;
                const chartHeight = 150;
                const maxVal = Math.max(...data, 1);

                data.forEach((val, idx) => {
                    const h = (val / maxVal) * chartHeight;
                    const x = idx * (barWidth + gap);
                    const y = 200 - h;

                    const bar = new fabric.Rect({
                        left: x,
                        top: y,
                        width: barWidth,
                        height: h,
                        fill: colors[idx % colors.length],
                        rx: 6,
                        ry: 6,
                    });

                    const label = new fabric.Text(labels[idx] || "", {
                        fontSize: 11,
                        fontFamily: "Arial",
                        fill: "#64748B",
                        left: x + (barWidth / 2),
                        top: 210,
                        originX: "center",
                    });

                    const valText = new fabric.Text(String(val), {
                        fontSize: 10,
                        fontFamily: "Arial",
                        fontWeight: "bold",
                        fill: "#334155",
                        left: x + (barWidth / 2),
                        top: y - 16,
                        originX: "center",
                    });

                    chartObjects.push(bar, label, valText);
                });
            } else if (type === "pie" || type === "donut") {
                const total = data.reduce((a, b) => a + b, 0) || 1;
                let startAngle = -Math.PI / 2;
                const radius = 80;
                const centerX = 120;
                const centerY = 130;

                data.forEach((val, idx) => {
                    const sliceAngle = (val / total) * 2 * Math.PI;
                    const endAngle = startAngle + sliceAngle;

                    const x1 = centerX + radius * Math.cos(startAngle);
                    const y1 = centerY + radius * Math.sin(startAngle);
                    const x2 = centerX + radius * Math.cos(endAngle);
                    const y2 = centerY + radius * Math.sin(endAngle);

                    const largeArc = sliceAngle > Math.PI ? 1 : 0;
                    const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                    const wedge = new fabric.Path(pathData, {
                        fill: colors[idx % colors.length],
                        stroke: "#FFFFFF",
                        strokeWidth: 2,
                    });

                    chartObjects.push(wedge);
                    startAngle = endAngle;
                });

                if (type === "donut") {
                    const hole = new fabric.Circle({
                        radius: 40,
                        fill: "#FFFFFF",
                        left: centerX,
                        top: centerY,
                        originX: "center",
                        originY: "center",
                    });
                    chartObjects.push(hole);
                }
            } else if (type === "line") {
                const chartWidth = 240;
                const chartHeight = 140;
                const maxVal = Math.max(...data, 1);

                const points: { x: number; y: number }[] = data.map((val, idx) => ({
                    x: (idx / Math.max(1, data.length - 1)) * chartWidth,
                    y: 190 - (val / maxVal) * chartHeight,
                }));

                const line = new fabric.Polyline(points, {
                    fill: "",
                    stroke: colors[0],
                    strokeWidth: 4,
                    strokeLineCap: "round",
                    strokeLineJoin: "round",
                });
                chartObjects.push(line);

                points.forEach((pt, idx) => {
                    const dot = new fabric.Circle({
                        radius: 5,
                        fill: "#FFFFFF",
                        stroke: colors[0],
                        strokeWidth: 3,
                        left: pt.x,
                        top: pt.y,
                        originX: "center",
                        originY: "center",
                    });

                    const lbl = new fabric.Text(labels[idx] || "", {
                        fontSize: 11,
                        fontFamily: "Arial",
                        fill: "#64748B",
                        left: pt.x,
                        top: 205,
                        originX: "center",
                    });

                    chartObjects.push(dot, lbl);
                });
            }

            const group = new fabric.Group(chartObjects, {
                left: workspace?.width ? workspace.width / 2 - 120 : 100,
                top: workspace?.height ? workspace.height / 2 - 100 : 100,
            });

            (group as any).id = uuid();
            (group as any).name = "chart";

            addToCanvas(group);
            canvas.setActiveObject(group);
            canvas.renderAll();
            save();
        },
        applyTextEffect: (
            effect: "none" | "neon" | "shadow3d" | "hollow" | "glitch" | "curved",
            options?: { color?: string; blur?: number; curvature?: number }
        ) => {
            const selectedObject = canvas.getActiveObject();
            if (!selectedObject || !isTextType(selectedObject.type)) {
                return;
            }

            const textObj = selectedObject as fabric.Text | fabric.Textbox;

            if (effect === "none") {
                textObj.set({
                    shadow: undefined,
                    stroke: undefined,
                    strokeWidth: 0,
                    fill: "#000000",
                });
            } else if (effect === "neon") {
                const glowColor = options?.color || "#EC4899";
                textObj.set({
                    fill: "#FFFFFF",
                    stroke: glowColor,
                    strokeWidth: 1.5,
                    shadow: new fabric.Shadow({
                        color: glowColor,
                        blur: options?.blur || 25,
                        offsetX: 0,
                        offsetY: 0,
                    }),
                });
            } else if (effect === "shadow3d") {
                const shadowColor = options?.color || "rgba(0,0,0,0.6)";
                textObj.set({
                    shadow: new fabric.Shadow({
                        color: shadowColor,
                        blur: options?.blur || 12,
                        offsetX: 6,
                        offsetY: 6,
                    }),
                });
            } else if (effect === "hollow") {
                const strokeColor = options?.color || "#1E293B";
                textObj.set({
                    fill: "transparent",
                    stroke: strokeColor,
                    strokeWidth: 2,
                    shadow: undefined,
                });
            } else if (effect === "glitch") {
                const offsetColor = options?.color || "#EC4899";
                textObj.set({
                    shadow: new fabric.Shadow({
                        color: offsetColor,
                        blur: 0,
                        offsetX: 5,
                        offsetY: 5,
                    }),
                });
            } else if (effect === "curved") {
                const radius = options?.curvature || 150;
                const pathData = `M 0 ${radius} A ${radius} ${radius} 0 0 1 ${radius * 2} ${radius}`;
                const curvedPath = new fabric.Path(pathData, { visible: false });
                (textObj as any).set("path", curvedPath);
            }

            canvas.renderAll();
            save();
        },
        distributeObjects: (direction: "horizontal" | "vertical") => {
            const activeObject = canvas.getActiveObject();
            if (!activeObject) {
                return;
            }

            let objects: fabric.Object[] = [];
            if (activeObject.type === "activeSelection") {
                objects = (activeObject as fabric.ActiveSelection).getObjects();
            } else {
                objects = canvas.getObjects().filter((o) => o.name !== "clip");
            }

            if (objects.length < 2) {
                return;
            }

            if (direction === "horizontal") {
                objects.sort((a, b) => (a.left || 0) - (b.left || 0));
                const first = objects[0];
                const last = objects[objects.length - 1];

                const minX = first.left || 0;
                const maxX = (last.left || 0) + ((last.width || 0) * (last.scaleX || 1));
                const totalWidth = objects.reduce((sum, obj) => sum + (obj.width || 0) * (obj.scaleX || 1), 0);

                const availableGap = (maxX - minX - totalWidth) / Math.max(1, objects.length - 1);
                let currentX = minX;

                objects.forEach((obj) => {
                    obj.set("left", currentX);
                    currentX += (obj.width || 0) * (obj.scaleX || 1) + Math.max(0, availableGap);
                    obj.setCoords();
                });
            } else {
                objects.sort((a, b) => (a.top || 0) - (b.top || 0));
                const first = objects[0];
                const last = objects[objects.length - 1];

                const minY = first.top || 0;
                const maxY = (last.top || 0) + ((last.height || 0) * (last.scaleY || 1));
                const totalHeight = objects.reduce((sum, obj) => sum + (obj.height || 0) * (obj.scaleY || 1), 0);

                const availableGap = (maxY - minY - totalHeight) / Math.max(1, objects.length - 1);
                let currentY = minY;

                objects.forEach((obj) => {
                    obj.set("top", currentY);
                    currentY += (obj.height || 0) * (obj.scaleY || 1) + Math.max(0, availableGap);
                    obj.setCoords();
                });
            }

            canvas.renderAll();
            save();
        },
        applyAnimation: (type: "none" | "fade" | "slide" | "pop" | "breathe") => {
            const selectedObject = canvas.getActiveObject();
            if (!selectedObject) {
                return;
            }

            (selectedObject as any).animationType = type;

            if (type === "fade") {
                selectedObject.set("opacity", 0);
                fabric.util.animate({
                    startValue: 0,
                    endValue: 1,
                    duration: 600,
                    onChange: (value) => {
                        selectedObject.set("opacity", value);
                        canvas.renderAll();
                    },
                });
            } else if (type === "pop") {
                const origScaleX = selectedObject.scaleX || 1;
                const origScaleY = selectedObject.scaleY || 1;
                selectedObject.set({ scaleX: origScaleX * 0.3, scaleY: origScaleY * 0.3 });

                fabric.util.animate({
                    startValue: 0.3,
                    endValue: 1,
                    duration: 500,
                    easing: fabric.util.ease.easeOutBack,
                    onChange: (value) => {
                        selectedObject.set({ scaleX: origScaleX * value, scaleY: origScaleY * value });
                        canvas.renderAll();
                    },
                });
            } else if (type === "slide") {
                const origLeft = selectedObject.left || 0;
                selectedObject.set("left", origLeft - 80);

                fabric.util.animate({
                    startValue: origLeft - 80,
                    endValue: origLeft,
                    duration: 600,
                    easing: fabric.util.ease.easeOutCubic,
                    onChange: (value) => {
                        selectedObject.set("left", value);
                        canvas.renderAll();
                    },
                });
            }

            canvas.renderAll();
            save();
        },
        playAllAnimations: () => {
            const objects = canvas.getObjects().filter((obj) => obj.name !== "clip");
            objects.forEach((obj, idx) => {
                const anim = (obj as any).animationType;
                if (!anim || anim === "none") return;

                setTimeout(() => {
                    if (anim === "fade") {
                        obj.set("opacity", 0);
                        fabric.util.animate({
                            startValue: 0,
                            endValue: 1,
                            duration: 600,
                            onChange: (val) => {
                                obj.set("opacity", val);
                                canvas.renderAll();
                            },
                        });
                    } else if (anim === "pop") {
                        const origScaleX = obj.scaleX || 1;
                        const origScaleY = obj.scaleY || 1;
                        obj.set({ scaleX: origScaleX * 0.3, scaleY: origScaleY * 0.3 });

                        fabric.util.animate({
                            startValue: 0.3,
                            endValue: 1,
                            duration: 500,
                            easing: fabric.util.ease.easeOutBack,
                            onChange: (val) => {
                                obj.set({ scaleX: origScaleX * val, scaleY: origScaleY * val });
                                canvas.renderAll();
                            },
                        });
                    } else if (anim === "slide") {
                        const origLeft = obj.left || 0;
                        obj.set("left", origLeft - 80);

                        fabric.util.animate({
                            startValue: origLeft - 80,
                            endValue: origLeft,
                            duration: 600,
                            easing: fabric.util.ease.easeOutCubic,
                            onChange: (val) => {
                                obj.set("left", val);
                                canvas.renderAll();
                            },
                        });
                    }
                }, idx * 120);
            });
        },
        restoreVersion: (index: number) => {
            if (!canvasHistory.current || !canvasHistory.current[index]) return;
            try {
                const targetState = JSON.parse(canvasHistory.current[index]);
                canvas.loadFromJSON(targetState, () => {
                    canvas.renderAll();
                    setHistoryIdx(index);
                    autoZoom();
                });
            } catch (err) {
                console.error("Failed to restore history version", err);
            }
        },
        getHistoryCount: () => {
            return canvasHistory.current ? canvasHistory.current.length : 0;
        },
        getObjectById: (id: string) => {
            return canvas.getObjects().find((object) => (object as any).id === id);
        },
        listCanvasObjects: (): CanvasObjectSummary[] => {
            return canvas.getObjects()
                .filter((object) => object.name !== "clip" && (object as any).id)
                .map((object) => {
                    const bounding = object.getBoundingRect(true, true);
                    return {
                        id: (object as any).id as string,
                        type: object.type || "object",
                        text: isTextType(object.type) ? (object as fabric.Textbox).text : undefined,
                        left: Math.round(bounding.left),
                        top: Math.round(bounding.top),
                        width: Math.round(bounding.width),
                        height: Math.round(bounding.height),
                        fill: typeof object.fill === "string" ? object.fill : undefined,
                    };
                });
        },
        alignObject: (object: fabric.Object, alignment: AgentAlignment) => {
            const workspace = getWorkSpace();
            if (!workspace) return;

            const workspaceRect = workspace.getBoundingRect(true, true);
            const objectRect = object.getBoundingRect(true, true);
            const currentLeft = object.left ?? 0;
            const currentTop = object.top ?? 0;

            switch (alignment) {
                case "left":
                    object.set({ left: currentLeft - objectRect.left + workspaceRect.left });
                    break;
                case "right":
                    object.set({ left: currentLeft - objectRect.left + (workspaceRect.left + workspaceRect.width - objectRect.width) });
                    break;
                case "center-horizontal":
                    object.set({ left: currentLeft - objectRect.left + (workspaceRect.left + (workspaceRect.width - objectRect.width) / 2) });
                    break;
                case "top":
                    object.set({ top: currentTop - objectRect.top + workspaceRect.top });
                    break;
                case "bottom":
                    object.set({ top: currentTop - objectRect.top + (workspaceRect.top + workspaceRect.height - objectRect.height) });
                    break;
                case "center-vertical":
                    object.set({ top: currentTop - objectRect.top + (workspaceRect.top + (workspaceRect.height - objectRect.height) / 2) });
                    break;
            }

            object.setCoords();
            canvas.renderAll();
            save();
        },
        arrangeObject: (object: fabric.Object, order: AgentArrangeOrder) => {
            if (order === "front") {
                canvas.bringToFront(object);
            } else if (order === "forward") {
                canvas.bringForward(object);
            } else if (order === "backward") {
                canvas.sendBackwards(object);
            } else if (order === "back") {
                canvas.sendToBack(object);
            }

            if (order === "back" || order === "backward") {
                getWorkSpace()?.sendToBack();
            }

            canvas.renderAll();
            save();
        },
        setObjectOpacity: (object: fabric.Object, value: number) => {
            object.set({ opacity: value });
            canvas.renderAll();
            save();
        },
        removeObject: (object: fabric.Object) => {
            canvas.remove(object);
            canvas.discardActiveObject();
            canvas.renderAll();
            save();
        },
        getActiveFilters: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return [];
            }

            // @ts-ignore
            const value = selected.get('filter') || [];

            return value;
        },
        getActiveColor: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return fillColor;
            }

            const value = selected.get('fill') || fillColor;

            return value as string;
        },
        getActiveFontFamily: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return FONT_FAMILY;
            } // @ts-ignore
            const value = selected.get('fontFamily') || FONT_FAMILY;

            return value;
        },
        getActiveFontWeight: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return FONT_WEIGHT;
            } // @ts-ignore
            const value = selected.get('fontWeight') || FONT_WEIGHT;

            return value;
        },
        getActiveFontStyle: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return FONT_STYLE;
            } // @ts-ignore
            const value = selected.get('fontWeight') || FONT_STYLE;

            return value;
        },
        getActiveFontLineThrough: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return false;
            } // @ts-ignore
            const value = selected.get('linethrough') || false;

            return value;
        },
        getActiveFontUnderline: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return false;
            } // @ts-ignore
            const value = selected.get('underline') || false;

            return value;
        },
        getActiveFontSize: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return FONT_SIZE;
            } // @ts-ignore
            const value = selected.get('fontSize') || FONT_SIZE;

            return value;
        },
        getActiveTextAlign: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return "left";
            } // @ts-ignore
            const value = selected.get('textAlign') || "left";

            return value;
        },
        getActiveStrokeColor: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return fillColor;
            }

            const value = selected.get('stroke') || STROKE_COLOR;

            return value;
        },
        getActiveStrokeWidth: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return strokeWidth;
            }

            const value = selected.get('strokeWidth') || STROKE_WIDTH;

            return value;
        },
        getActiveStrokeDashedArray: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return strokeDashArray;
            }

            const value = selected.get('strokeDashArray') || STROKE_DASH_ARRAY;

            return value;
        },
        getActiveOpacity: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return 1;
            }

            const value = selected.get('opacity') || 1;

            return value;
        },
        changeOpacity: (value: number) => {
            canvas.getActiveObjects().forEach((object) => {
                object.set({opacity: value})
            })

            canvas.renderAll()
        },
        bringForward: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.bringForward(object)
            })
            canvas.renderAll()
            const workspace = getWorkSpace();
            workspace?.sendToBack()
        },
        sendBackward: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.sendBackwards(object)
            })
            canvas.renderAll()

            const workspace = getWorkSpace();
            workspace?.sendToBack()
        },
        changeImageFilter: (value: string) => {
            const objects = canvas.getActiveObjects();
            objects.forEach((object) => {
                if (object.type === "image") {
                    // @ts-ignore
                    const imageObject = object as fabric.Image;
                    const effect = createFilter(value)

                    imageObject.filters = effect ? [effect] : []
                    imageObject.applyFilters()
                    canvas.renderAll()
                }
            })
        },
        changeFontFamily: (value: string) => {
            setFontFamily(fontFamily);
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type))
                {
                    // @ts-ignore
                    object.set({"fontFamily": value })
                }
            })
            canvas.renderAll()
        },
        changeFontWeight: (value: number) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type))
                {
                    // @ts-ignore
                    object.set({"fontWeight": value })
                }
            })

            canvas.renderAll()
        },
        changeFontStyle: (value: string) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type))
                {
                    // @ts-ignore
                    object.set({"fontStyle": value })
                }
            })

            canvas.renderAll()
        },
        changeFontLineTrough: (value: boolean) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type))
                {
                    // @ts-ignore
                    object.set({ linethrough: value })
                }
            })

            canvas.renderAll()
        },
        changeFontUnderline: (value: boolean) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type))
                {
                    // @ts-ignore
                    object.set({ underline: value })
                }
            })

            canvas.renderAll()
        },
        changeFontSize: (value: number) => {
            canvas.getActiveObjects().forEach((object) => {
                if(isTextType(object.type))
                {
                    // @ts-ignore
                    object.set({fontSize: value})
                }
            })

            canvas.renderAll()
        },
        changeTextAlign: (value: string) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type))
                {
                    // @ts-ignore
                    object.set({ textAlign: value })
                }
            })

            canvas.renderAll()
        },
        changeFillColor: (color: string) => {
            setFillColor(color)
            canvas.getActiveObjects().forEach((object) => {
                object.set({fill: color})
            });
            canvas.renderAll()
        },
        changeStrokeColor: (color: string) => {
            setStrokeColor(color)
            canvas.getActiveObjects().forEach((object) => {
                // Text objects do not have stroke
                if (isTextType(object.type)) {
                    object.set({ fill: color })
                    return
                }
                object.set({ stroke: color })
            })
            canvas.freeDrawingBrush.color = color;
            canvas.renderAll()
        },
        changeStrokeWidth: (width: number) => {
            setStrokeWidth(width)
            canvas.getActiveObjects().forEach((object) => {
                object.set({ strokeWidth: width })
            })
            canvas.freeDrawingBrush.width = width;
            canvas.renderAll()
        },
        changeStrokeDashArray: (dashArray: number[]) => {
            setStrokeDashArray(dashArray);
            canvas.getActiveObjects().forEach((object) => {
                object.set({ strokeDashArray: dashArray })
            })

            canvas.renderAll()

        },
        selectedObject,
        canvas
    }
}

export const useEditor = ({
    onClearSelectionCallback,
    saveCallback,
    defaultState,
    defaultWidth,
    defaultHeight
} : EditorHookProps) => {
    const initialState = useRef(defaultState);
    const initialHeight = useRef(defaultHeight);
    const initialWidth = useRef(defaultWidth);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [selectedObject, setSelectedObject] = useState<fabric.Object[]>([]);
    const [fillColor, setFillColor] = useState(FILL_COLOR);
    const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
    const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
    const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);
    const [fontFamily, setFontFamily] = useState<string>(FONT_FAMILY);

    const { save, canUndo, canRedo, undo, redo, canvasHistory, setHistoryIdx } = useHistoryHook({
        canvas,
        saveCallback
    });

    const { copy, paste }= useClipboard({ canvas})

    const { autoZoom } = useAutoResize({
        canvas,
        container
    });

    useCanvasEvents({
        canvas,
        setSelectedObject,
        onClearSelectionCallback,
        save
    });

    useHotKeys({
        canvas,
        undo,
        redo,
        save,
        copy,
        paste
    });

    useWindowEvent();

    useLoadState({
        autoZoom,
        canvas,
        initialState,
        canvasHistory,
        setHistory: setHistoryIdx
    })

    const editor = useMemo(() => {
        if (canvas) {
            return buildEditor({
                autoZoom,
                canvas,
                fillColor,
                setFillColor,
                strokeColor,
                setStrokeColor,
                strokeDashArray,
                strokeWidth,
                setStrokeWidth,
                selectedObject,
                setStrokeDashArray,
                fontFamily,
                setFontFamily,
                copy,
                paste,
                save,
                undo,
                redo,
                canUndo,
                canRedo,
                canvasHistory,
                setHistoryIdx,
            })
        }
        return undefined
    }, [
        canvas,
        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        selectedObject,
        strokeDashArray,
        setStrokeDashArray,
        fontFamily,
        setFontFamily,
        copy,
        paste,
        autoZoom,
        save,
        undo,
        redo,
        canUndo,
        canRedo
    ]);

    const init = useCallback((
        {
            initialCanvas,
            initialContainer
        } : {
            initialCanvas: fabric.Canvas,
            initialContainer: HTMLDivElement
        }
    ) => {
        fabric.Object.prototype.set({
            cornerColor: "#fff",
            cornerStyle: "circle",
            borderColor: "#3b82f6",
            borderScaleFactor: 1.5,
            transparentCorners: false,
            borderOpacityWhenMoving: 1,
            cornerStrokeColor: "#3b82f6"
        })

        const initialWorkSpace = new fabric.Rect({
            width: initialWidth.current,
            height: initialHeight.current,
            name: "clip",
            fill: 'white',
            selectable: false,
            hasControls: false,
            shadow: new fabric.Shadow({
                color: "rgba(0,0,0,0.8)",
                blur: 5
            }),
        });
        initialCanvas.setWidth(
            initialContainer.offsetWidth
        );
        initialCanvas.setHeight(
            initialContainer.offsetHeight
        )

        initialCanvas.add(initialWorkSpace)
        initialCanvas.centerObject(initialWorkSpace)
        initialCanvas.clipPath = initialWorkSpace

        setCanvas(initialCanvas)
        setContainer(initialContainer)
        const currentState = JSON.stringify(
            initialCanvas.toJSON(JSON_KEYS)
        );

        canvasHistory.current = [currentState];
        setHistoryIdx(0);

    }, [
        canvasHistory,
        setHistoryIdx
    ]);



    return { init , editor }
}