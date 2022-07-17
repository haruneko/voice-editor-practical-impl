import React from "react";
import ControlPointDraggable from "./ControlPointDraggable";

type ControlPoint = {
  position: number;
  ratio: number;
}

type ControlChangeEditorProps = {
  controlChange: ControlPoint[];
  width: number;
  height: number;
  scale : "log" | "linear";
  minimumValue: number;
  maximumValue: number;
  edittable?: boolean;
  onControlChangeChanged?: (_: ControlPoint[]) => void;
}

const ContrlChangeView: React.FC<ControlChangeEditorProps> = (props) => {
  const xOf = (position: number) => props.width * position;
  const yOf = (ratio: number) => {
    if(props.scale === "linear") {
      return (props.maximumValue - ratio) / (props.maximumValue - props.minimumValue) * props.height;
    } else if (props.scale === "log") {
      return (Math.log(props.maximumValue) - Math.log(ratio)) / (Math.log(props.maximumValue) - Math.log(props.minimumValue)) * props.height;
    }
    return 0.0;
  }
  const positionOf = (x: number) => x / props.width;
  const ratioOf = (y: number) => {
    if(props.scale === "linear") {
      const interop = y / props.height;
      return props.maximumValue * (1 - interop) + props.minimumValue * interop;
    } else if (props.scale === "log") {
      return props.minimumValue * Math.exp(y / props.height * (Math.log(props.maximumValue) - Math.log(props.minimumValue)));
    }
    return 0.0;
  }
  const handlePointChange = (index: number) => (x: number, y: number) => {
    props.controlChange[index] = { position: positionOf(x), ratio: ratioOf(y) };
    if(props.onControlChangeChanged) { props.onControlChangeChanged(Array.from(props.controlChange)); }
  }
  return  <>
            <div style={{position: "absolute", width: `${props.width}px`, height: `${props.height}px`}}>
              {props.controlChange.map((cp, i) => <ControlPointDraggable x={xOf(cp.position)} y={yOf(cp.ratio)} onPositionChanged={handlePointChange(i)}/>)}
            </div>
          </>
}

export default ContrlChangeView;
