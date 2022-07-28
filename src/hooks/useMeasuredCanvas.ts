import React, { useEffect } from "react"

type MeasuredCanvasProps = {
  width: number;
  height: number;
  backgroundColor: string;
  axisColor: string;
}

const drawLine = (x1: number, y1: number, x2: number, y2: number, context: CanvasRenderingContext2D) => {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}


export const useMeasuredCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>, props: MeasuredCanvasProps) => {
  useEffect(() => {
    if(canvasRef.current === null) return;
    const context = canvasRef.current.getContext("2d");
    if(context === null) return;
    context.fillStyle = props.backgroundColor;
    context.fillRect(0, 0, props.width, props.height);

    context.lineWidth = 1;
    context.strokeStyle = props.axisColor;
    for(let i = 1; i <= 3; i++) {
        const y = props.height / 4 * i;
        if(i !== 2) {
            context.setLineDash([3, 2]);
        } else {
            context.setLineDash([]);
        }
        drawLine(0, y, props.width, y, context);
    }
    context.setLineDash([]);
})
}
export default useMeasuredCanvas;
