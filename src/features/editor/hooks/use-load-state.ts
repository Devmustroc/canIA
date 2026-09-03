import {fabric} from "fabric";
import React, {useEffect, useRef} from "react";
import {JSON_KEYS} from "@/features/editor/types";

interface  useStateLoadProps {
    autoZoom: () => void;
    canvas: fabric.Canvas | null;
    initialState: React.MutableRefObject<string | undefined>;
    canvasHistory: React.MutableRefObject<string[]>;
    setHistory: React.Dispatch<React.SetStateAction<number>>;
}

export const useLoadState = ({
                                 autoZoom,
                                 canvas,
                                 initialState,
                                 canvasHistory,
                                 setHistory
}: useStateLoadProps) => {
    const init = useRef(false);
    useEffect(() => {
        if (!init.current && initialState?.current && canvas) {
            canvas.loadFromJSON(JSON.parse(initialState.current), () => {
                const currentState = JSON.stringify(
                    canvas.toJSON(JSON_KEYS)
                );

                canvasHistory.current = [currentState];
                setHistory(0);
                autoZoom();
            });

            init.current = true;
        }
    } , [
        autoZoom,
        canvas,
        canvasHistory,
        initialState,
        setHistory
    ]);
};