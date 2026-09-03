import {fabric} from "fabric";
import {useCallback, useRef} from "react";
import {uuid} from "uuidv4";

interface useClipboardProps {
    canvas: fabric.Canvas | null;
}

export const useClipboard = ({ canvas }: useClipboardProps) => {
    const clipBoard = useRef<any>(null);
    const copy = useCallback(() => {
        canvas?.getActiveObject()?.clone((cloned: any) => {
            clipBoard.current = cloned;
        });
    }, [canvas]);
    const paste = useCallback(() => {
        if (!clipBoard.current) return;
        clipBoard.current.clone((clonedObj: any) => {
            canvas?.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });
            if (clonedObj.type === "activeSelection") {
                clonedObj.canvas = canvas;
                clonedObj.forEachObject((obj: any) => {
                    obj.set({ id: uuid() });
                    canvas?.add(obj);
                });
                clonedObj.setCoords();
            } else {
                clonedObj.set({ id: uuid() });
                canvas?.add(clonedObj);
            }

            clipBoard.current.top += 10;
            clipBoard.current.left += 10;

            canvas?.setActiveObject(clonedObj);
            canvas?.requestRenderAll();

        });
    }, [canvas]);

    return {
        copy,
        paste
    }
}