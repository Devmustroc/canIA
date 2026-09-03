import {RGBColor} from "react-color";
import {fabric} from "fabric";
import {uuid} from "uuidv4";

export function isTextType(type: string | undefined) {
  return type === "text" || type === "i-text" || type === "textbox";
}

// Convert rgba to string

export function rgbaToString(rgba: RGBColor | "transparent"): string {
    if (rgba === "transparent") {
        return `rgba(0,0,0,0)`
    }
    const alpha = rgba.a === undefined ? 1 : rgba.a;
    return `rgba(${rgba.r},${rgba.g},${rgba.b},${alpha})`;
}

export const createFilter = (value: string) => {
    let effect;

    switch (value) {
        case "polaroid":
            // @ts-ignore
            effect = new fabric.Image.filters.Polaroid();
            break;
        case "sepia":
            effect = new fabric.Image.filters.Sepia();
            break;
        case "kodachrome":
            // @ts-ignore
            effect = new fabric.Image.filters.Kodachrome();
            break;
        case 'contrast':
            effect = new fabric.Image.filters.Contrast({ contrast: 0.3 });
            break;
        case 'brightness':
            effect = new fabric.Image.filters.Brightness({ brightness: 0.8 });
            break;
        case 'grayscale':
            effect = new fabric.Image.filters.Grayscale();
            break;
        case 'invert':
            effect = new fabric.Image.filters.Invert();
            break;
        case 'noise':
            effect = new fabric.Image.filters.Noise({ noise: 100 });
            break;
        case 'pixelate':
            effect = new fabric.Image.filters.Pixelate();
            break;
        case 'blur':
            effect = new fabric.Image.filters.Blur({ blur: 0.5 });
            break;
        case 'sharpen':
            effect = new fabric.Image.filters.Convolute({
                matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
            });
            break;
        case 'emboss':
            effect = new fabric.Image.filters.Convolute({
                matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
            });
            break;
        case "brownie":
            // @ts-ignore
            effect = new fabric.Image.filters.Brownie();
            break;
        case "vintage":
                // @ts-ignore
             effect = new fabric.Image.filters.Vintage();
               break;
        case "technicolor":
            // @ts-ignore
            effect = new fabric.Image.filters.Technicolor();
            break;
        case "removecolor":
            // @ts-ignore
            effect = new fabric.Image.filters.RemoveColor({
                distance: 0.5,
                threshold: 0.2,
            });
            break;
        case "blacknwhite":
            // @ts-ignore
            effect = new fabric.Image.filters.BlackWhite();
            break;
        case "vibrance":
            // @ts-ignore
            effect = new fabric.Image.filters.Vibrance({
                vibrance: 1,
            });
            break;
        case "blendColor":
            effect = new fabric.Image.filters.BlendColor({
                color: '#f00',
                mode: 'multiply',
            });
            break;
        case "huerotate":
            effect = new fabric.Image.filters.HueRotation({
                rotation: 0.5,
            });
            break;
        case "saturation":
            effect = new fabric.Image.filters.Saturation({
                saturation: 0.5,
            });
            break;
        case "colorize":
            effect = new fabric.Image.filters.ColorMatrix({
                matrix: [
                    1, 0, 0, 0, 0,
                    0, 1, 0, 0, 0,
                    0, 0, 1, 0, 0,
                    0, 0, 0, 1, 0,
                ],
            });
            break;
        case "gamma":
            // @ts-ignore
            effect = new fabric.Image.filters.Gamma({
                gamma:[1, 0.5, 2.1]
            });
            break;
        default:
            effect = null
            return;
    }

    return effect;
}

export function downloadFile (file: string, type: string)  {
    const anchor = document.createElement("a");
    anchor.href = file;
    anchor.download = `${uuid()}image.${type}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
}

export async function transformText(objects: any) {
    if (!objects) return;

    objects.forEach((item: any) => {
        if (item.objects) {
            transformText(item.objects);
        } else {
            if (isTextType(item.type)) {
                item.type = "text";
            }
        }
    });
}