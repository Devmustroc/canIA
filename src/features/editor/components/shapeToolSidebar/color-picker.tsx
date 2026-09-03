import React from 'react';

import {ChromePicker, CirclePicker} from "react-color";
import {rgbaToString} from "../../utils";
import {colors} from "../../types";



interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

const ColorPicker = ({ value, onChange}: ColorPickerProps) => {
    return (
        <div
            className="w-full space-y-4"
        >
            <ChromePicker
                color={value}
                onChange={(color) => {
                    const formattedValue = rgbaToString(color.rgb);
                    onChange(formattedValue);
                }}
                className="border rounded-l-lg"
            />
            <CirclePicker
                color={value}
                colors={colors}
                onChangeComplete={(color) => {
                    const formattedValue = rgbaToString(color.rgb);
                    onChange(formattedValue);
                }}
            />
        </div>
    );
};

export default ColorPicker;