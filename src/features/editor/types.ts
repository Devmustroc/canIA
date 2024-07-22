import {fabric} from "fabric";
import material from "material-colors";
import {ITextboxOptions} from "fabric/fabric-impl";

export const selectionDependentTools = [
    "fill",
    "font",
    "filter",
    "opacity",
    "remove-bg",
    "stroke-color",
    "stroke-width",
]

export interface EditorHookProps {
    defaultState: string;
    defaultWidth: number;
    defaultHeight: number;
    onClearSelectionCallback?: () => void;
    saveCallback?: (values: {
        json: string,
        height: number,
        width: number,
    }) => void;
}

export type ActiveTool =
| "select"
| "shapes"
| "text"
| "images"
| "draw"
| "fill"
| "stroke-color"
| "stroke-width"
| "font"
| "opacity"
| "filter"
| "settings"
| "ai"
| "sticker"
| "remove-bg"
| "templates"
| "scale";



export const FILL_COLOR = "rgba(0,0,0,1)"
export const STROKE_COLOR = "rgba(0,0,0,1)"
export const STROKE_WIDTH = 2
export const STROKE_DASH_ARRAY = []
export const FONT_FAMILY = "Arial"
export const FONT_SIZE = 32
export const FONT_WEIGHT = 400
export const FONT_STYLE = "normal"

export const TEXT_OPTIONS = {
    type: "textbox",
    left: 100,
    top: 100,
    fill: FILL_COLOR,
    fontSize: FONT_SIZE,
    fontFamily: FONT_FAMILY,
}

export const CIRCLE_OPTIONS = {
    radius: 200,
    left: 100,
    top: 100,
    fill: FILL_COLOR,
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH
}

export const RECTANGLE_OPTIONS = {
    left: 100,
    top: 100,
    fill: FILL_COLOR,
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    width: 400,
    height: 400,
    angle: 0
}

export const filters = [
    "polaroid",
    "sepia",
    "kodachrome",
    "contrast",
    "brightness",
    "grayscale",
    "invert",
    "noise",
    "pixelate",
    "blur",
    "sharpen",
    "emboss",
    "brownie",
    "vintage",
    "technicolor",
    "removecolor",
    "blacknwhite",
    "vibrance",
    "blendColor",
    "huerotate",
    "saturation",
    "colorize",
    "gamma"
]

export const colors = [
    material.red["500"],
    material.pink["500"],
    material.purple["500"],
    material.deepPurple["500"],
    material.indigo["500"],
    material.blue["500"],
    material.lightBlue["500"],
    material.cyan["500"],
    material.teal["500"],
    material.green["500"],
    material.lightGreen["500"],
    material.lime["500"],
    material.yellow["500"],
    material.amber["500"],
    material.orange["500"],
    material.deepOrange["500"],
    material.brown["500"],
    material.grey["500"],
    material.blueGrey["500"],
    material.black,
    material.white,
    "transparent"
]

export const TRIANGLE_OPTIONS = {
    left: 100,
    top: 100,
    fill: FILL_COLOR,
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    width: 400,
    height: 400,
    angle: 0
}

export const DIAMOND_OPTIONS = {
    left: 100,
    top: 100,
    fill: FILL_COLOR,
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    width: 400,
    height: 400,
    angle: 0
}



export type BuildEditorProps = {
    canUndo: () => boolean;
    canRedo: () => boolean;
    save: (skip?: boolean) => void;
    undo: () => void;
    redo: () => void;
    autoZoom: () => void;
    canvas: fabric.Canvas;
    fillColor: string;
    setFillColor: (color: string) => void;
    strokeColor : string;
    setStrokeColor : (color: string) => void;
    strokeWidth : number;
    setStrokeWidth: (width: number) => void;
    selectedObject: fabric.Object[];
    strokeDashArray: number[];
    setStrokeDashArray: (dashArray: number[]) => void;
    fontFamily: string;
    setFontFamily: (fontFamily: string) => void;
    copy: () => void;
    paste: () => void;
}

export const JSON_KEYS = [
    "name",
    "gradientAngle",
    "selectable",
    "hasControls",
    "linkData",
    "editable",
    "extension",
    "extensionType",
]

export interface EditorProps {
    deleteActiveObject: () => void;
    addText: (value: string, options? : ITextboxOptions) => void;
    getActiveOpacity: () => number;
    changeOpacity: (value: number) => void;
    bringForward: () => void;
    sendBackward: () => void;
    addCircle: () => void;
    addSoftRectangle: () => void;
    addRectangle: () => void;
    addTriangle: () => void;
    addInverseTriangle: () => void;
    addDiamond: () => void;
    selectedObject: fabric.Object[];
    changeFillColor: (color: string) => void;
    changeStrokeColor: (color: string) => void;
    changeStrokeWidth: (width: number) => void;
    changeStrokeDashArray: (dashArray: number[]) => void;
    changeFontFamily: (fontFamily: string) => void;
    changeFontWeight: (fontWeight: number) => void;
    changeFontStyle: (fontStyle: string) => void;
    getActiveColor: () => string;
    getActiveStrokeColor: () => string;
    getActiveStrokeWidth: () => number;
    getActiveStrokeDashedArray: () => number[];
    getActiveFontFamily: () => string;
    getActiveFontWeight: () => number;
    getActiveFontStyle: () => string;
    getActiveFontLineThrough: () => boolean;
    changeFontLineTrough: (value: boolean) => void;
    getActiveFontUnderline: () => boolean;
    changeFontUnderline: (value: boolean) => void;
    changeTextAlign: (value: string) => void;
    getActiveTextAlign: () => string;
    changeFontSize: (value: number) => void;
    getActiveFontSize: () => number;
    canvas: fabric.Canvas;
    addImage: (url: string) => void;
    getActiveFilters: () => string[];
    changeImageFilter: (filter: string) => void;
    copy: () => void;
    paste: () => void;
    enabledDrawingMode: () => void;
    disabledDrawingMode: () => void;
    changeSize: (size: { width: number, height: number} ) => void;
    changeBackground: (value: string) => void;
    getWorkSpace: () => fabric.Object | undefined;
    zoomIn: () => void;
    zoomOut: () => void;
    autoZoom: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
    saveAsPng: () => void;
    saveAsSvg: () => void;
    saveAsJpeg: () => void;
    saveAsJson: () => void;
    loadJson: (json: string) => void;
}


export interface Point {
    x: number;
    y: number;
}


export const fonts = [
    "Arial",
    "Arial Black",
    "Verdana",
    "Helvetica",
    "Tahoma",
    "Trebuchet MS",
    "Times New Roman",
    "Georgia",
    "Garamond",
    "Courier New",
    "Brush Script MT",
    "Palatino",
    "Bookman",
    "Comic Sans MS",
    "Impact",
    "Lucida Sans Unicode",
    "Geneva",
    "Lucida Console",
];