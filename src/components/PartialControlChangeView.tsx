import React, { useCallback, useEffect, useRef } from "react"
import ControlPoinrDraggable from "./ControlPointDraggable";

type ControlPoint = {
  position: number;
  ratio: number;
}

type PartialControlChangeViewProps = {
  fetcher: () => ControlPoint[];
  width: number;
  height: number;
  maxRatio: number;
  minRatio: number;
  axisColor: string;
  controlPointColor: string;
  backgroundColor: string;
  onControlPointMove?: (index: number, position: number, ratio: number) => void
  onControlPointChange?: (index: number, position: number, ratio: number) => void
}

const PartialControlChangeView: React.FC<PartialControlChangeViewProps> = (props) => {
  const controlPoints = props.fetcher();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const yPercentageOf = useCallback((ratio: number) => 1.0 - (ratio - props.minRatio) / (props.maxRatio - props.minRatio), [props.maxRatio, props.minRatio]);
  const ratioOf = (y: number) => props.maxRatio * (1 - y) + props.minRatio * y;

  useEffect(() => {
    if(canvasRef.current === null) return;
    const context = canvasRef.current.getContext("2d");
    if(context === null) return;
    context.fillStyle = props.backgroundColor;
    context.fillRect(0, 0, props.width, props.height);
    context.strokeStyle = props.axisColor;
    context.beginPath();
    context.moveTo(controlPoints[0].position * props.width, yPercentageOf(controlPoints[0].ratio) * props.height);
    controlPoints.forEach((p, i) => { if(i !== 0) context.lineTo(p.position * props.width, yPercentageOf(p.ratio) * props.height); })
    context.stroke();
  }, [controlPoints, props.axisColor, props.backgroundColor, props.height, props.width, yPercentageOf]);
  const handlePointMove = (index: number) => (x: number, y: number) => {
    if(props.onControlPointMove) props.onControlPointMove(index, x, ratioOf(y))
  }
  const handlePointChange = (index: number) => (x: number, y: number) => {
    if(props.onControlPointChange) props.onControlPointChange(index, x, ratioOf(y))
  }
  const handlePointAdd = (e: React.DragEvent<HTMLDivElement>) => {
    const x = e.clientX / props.width;
  }
  return (
    <div className="waveform-view" style={{flexShrink: 0, position: "relative", border: "0px", width: `100%`, height: `${props.height}px`}}>
      <canvas width={props.width} height = {props.height} ref={canvasRef} style={{width: "100%", height: `${props.height}px`}}/>
      { controlPoints.map((p, i) =>
        <ControlPoinrDraggable
          x={p.position}
          y={yPercentageOf(p.ratio)}
          minX={i <= 0 ? p.position : controlPoints[i - 1].position}
          minY={0}
          maxX={i >= controlPoints.length - 1 ? p.position : controlPoints[i + 1].position}
          maxY={1}
          clientWidth={props.width}
          clientHeight={props.height}
          color="black"
          onPointDragged={handlePointMove(i)}
          onPointChanged={handlePointChange(i)}
          key={`cpd-${i}`}
        />
      )}
    </div>
  );
}

export default PartialControlChangeView;
