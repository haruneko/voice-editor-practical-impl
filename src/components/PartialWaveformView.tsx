import React, { useEffect, useMemo, useRef } from "react";
import * as uzumejs from "uzumejs";
import useMeasuredCanvas from "../hooks/useMeasuredCanvas";

type PartialWaveformProps = {
    fetcher: () => uzumejs.Waveform;
    msStart: number;
    msEnd: number;
    width: number;
    height: number;
    axisColor: string;
    backgroundColor: string;
    lightColor: string;
    darkColor: string;
}

const drawLine = (x1: number, y1: number, x2: number, y2: number, context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

export const PartialWaveformView: React.FC<PartialWaveformProps> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const waveform = useMemo(() =>props.fetcher(), [props]);
    useMeasuredCanvas(canvasRef, props);
    useEffect(() => {
        if(canvasRef.current === null) return;
        const context = canvasRef.current.getContext("2d");
        if(context === null) return;
        const onePixelMsLength = (props.msEnd - props.msStart) / props.width;
        context.strokeStyle = props.darkColor;
        for(let i = 0; i < props.width; i++) {
            const msLeft = props.msStart + onePixelMsLength * i;
            const msRight = msLeft + onePixelMsLength;
            const max = waveform.maxAbsoluteValueBetween(msLeft, msRight);
            const length = max * props.height;
            const yStart = (props.height - length) / 2
            const yEnd = props.height - yStart;
            drawLine(i, yStart, i, yEnd, context);
        }
        context.strokeStyle = props.lightColor
        for(let i = 0; i < props.width; i++) {
            const msLeft = props.msStart + onePixelMsLength * i;
            const msRight = msLeft + onePixelMsLength;
            const mrv = waveform.rootMeanSquareBetween(msLeft, msRight);
            const length = mrv * props.height;
            const yStart = (props.height - length) / 2
            const yEnd = props.height - yStart;
            drawLine(i, yStart, i, yEnd, context);
        }
    });

    return  <div className="waveform-view" style={{flexShrink: 0, border: "0px", width: `100%`}}>
                <canvas ref={canvasRef} width={props.width} height={props.height} style={{width: "100%", height: `${props.height}px`}}/>
            </div>
    ;
};

export default PartialWaveformView;
