import {useCallback, useRef, useState} from "react";
import {fabric} from "fabric";
import {JSON_KEYS} from "@/features/editor/types";

interface UseHistoryHookProps {
    canvas: fabric.Canvas | null;
    saveCallback?: (values: {
        json: string,
        height: number,
        width: number,
    }) => void;
    initialHeight?: number;
    initialWidth?: number;
}

export const useHistoryHook = ({ canvas, saveCallback, initialWidth, initialHeight }: UseHistoryHookProps) => {
    const [historyIdx, setHistoryIdx] = useState(0);
    const canvasHistory = useRef<string[]>([]);
    const skipSave = useRef(false);

    const canUndo = useCallback(() => {
        return historyIdx > 0;
    }, [historyIdx]);

    const canRedo = useCallback(() => {
        return historyIdx < canvasHistory.current.length - 1;
    }, [historyIdx]);

    const save = useCallback((skip = false) => {
        if (!canvas || skipSave.current) return;

        const currentState = canvas.toJSON(JSON_KEYS);
        const jsonHistory = JSON.stringify(currentState);

        if (!skipSave.current && !skip) {
            canvasHistory.current.push(jsonHistory);
            setHistoryIdx(canvasHistory.current.length - 1);
        }

        const workspace = canvas.getObjects().find((object) => object.name === "clip");

        const newHeight = workspace?.height || initialHeight || 0;
        const newWidth = workspace?.width || initialWidth || 0;

        saveCallback?.({
            json: jsonHistory,
            height: newHeight,
            width: newWidth
        });

    }, [canvas, saveCallback]);

    const undo = useCallback(() => {
        if (canUndo()) {
            skipSave.current = true;
            canvas?.clear().renderAll();

            const previousIdx = historyIdx - 1;
            const previousState = JSON.parse(canvasHistory.current[previousIdx]);

            canvas?.loadFromJSON(previousState, () => {
                canvas?.renderAll();
                setHistoryIdx(previousIdx);
                skipSave.current = false;
            })
        }
    }, [canUndo, canvas, historyIdx]);
    const redo = useCallback(() => {
        if (canRedo()) {
            skipSave.current = true;
            canvas?.clear().renderAll();

            const nextIdx = historyIdx + 1;
            const nextState = JSON.parse(canvasHistory.current[nextIdx]);

            canvas?.loadFromJSON(nextState, () => {
                canvas?.renderAll();
                setHistoryIdx(nextIdx);
                skipSave.current = false;
            })
        }
    }, [canRedo, canvas, historyIdx]);

    return { save, canUndo, undo, canRedo, redo, canvasHistory, setHistoryIdx };
}