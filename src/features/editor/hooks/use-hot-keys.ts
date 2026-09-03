import {fabric} from "fabric";
import {useEvent} from "react-use";

interface UseHotKeysProps {
    canvas: fabric.Canvas | null;
    undo: () => void;
    redo: () => void;
    save: (skip?: boolean) => void;
    copy: () => void;
    paste: () => void;
}

export const useHotKeys = ({
    canvas,
    undo,
    redo,
    save,
    copy,
    paste
}:UseHotKeysProps) => {
    useEvent('keydown', (e) => {
        const isCtlKey = e.ctrlKey || e.metaKey;
        const isCancel = e.key === 'Escape';
        const isBackspace = e.key === 'Backspace';
        const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

        if (isInput) return;

        if (isBackspace) {
            canvas?.remove(...canvas.getActiveObjects());
            canvas?.discardActiveObject();
        }

        if (isCtlKey && e.key === 'z') {
            e.preventDefault();
            undo();
        }

        if (isCtlKey && e.key === 'y') {
            e.preventDefault();
            redo();
        }

        if (isCtlKey && e.key === 's') {
            e.preventDefault();
            save(true);
        }

        if (isCtlKey && e.key === 'c') {
            e.preventDefault();
            copy();
        }

        if (isCtlKey && e.key === 'v') {
            e.preventDefault();
            paste();
        }

        if (isCtlKey && e.key === 'a') {
            e.preventDefault();
            canvas?.discardActiveObject();
            const allObjects = canvas?.getObjects().filter((obj) => obj.selectable );
            canvas?.setActiveObject(new fabric.ActiveSelection(allObjects || [], {
                canvas: canvas,
            }));

            canvas?.requestRenderAll();
        }

        if (isCtlKey && e.key === 'x') {
            e.preventDefault();
            copy();
            canvas?.remove(...canvas.getActiveObjects());
            canvas?.discardActiveObject();
        }

        if (isCtlKey && e.key === 'd') {
            e.preventDefault();
            copy();
            paste();
        }


        if (isCancel) {
            e.preventDefault();
            canvas?.discardActiveObject();
        }

    }, );
}