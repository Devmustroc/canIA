import {fabric} from "fabric";
import {useEffect} from "react";

interface UseCanvasEventsProps {
    canvas: fabric.Canvas | null;
    setSelectedObject: (objects: fabric.Object[]) => void;
    onClearSelectionCallback?: () => void;
    save: () => void;
}

export const useCanvasEvents = ({
    canvas,
    setSelectedObject,
    onClearSelectionCallback,
    save
}: UseCanvasEventsProps) => {

    useEffect(() => {
        if (canvas) {
            canvas.on("object:added", () => save());
            canvas.on("object:modified", () => save());
            canvas.on("object:removed", () => save());
            canvas.on("selection:created", (e) => {
                setSelectedObject(e.selected || [])
            });
            canvas.on("selection:updated", (e) => {
                setSelectedObject(e.selected || [])
            });
            canvas.on("selection:cleared", () => {
                setSelectedObject([]);
                onClearSelectionCallback && onClearSelectionCallback();
            });
        }

        return () => {
            if (canvas) {
                canvas.off("object:added")
                canvas.off("object:modified")
                canvas.off("object:removed")
                canvas.off("selection:created")
                canvas.off("selection:updated")
                canvas.off("selection:cleared")
            }
        }
    }, [canvas, setSelectedObject, onClearSelectionCallback, save])

}