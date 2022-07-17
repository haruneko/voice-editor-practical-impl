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
  minimumValue: number;
  maximumValue: number;
  edittable?: boolean;
  onControlChangeChanged?: (_: ControlPoint[]) => void;
}

const ContrlChangeView: React.FC<ControlChangeEditorProps> = (props) => {
  const yOf = (ratio: number) =>
      1 - (Math.log(props.maximumValue) - Math.log(ratio)) / (Math.log(props.maximumValue) - Math.log(props.minimumValue));
  const ratioOf = (y: number) =>
      props.minimumValue * Math.exp(y * (Math.log(props.maximumValue) - Math.log(props.minimumValue)));
  const handlePointChange = (index: number) => (x: number, y: number) => {
    props.controlChange[index] = { position: x, ratio: ratioOf(y) };
    console.log(y, ratioOf(y), yOf(ratioOf(y)));
    if(props.onControlChangeChanged) { props.onControlChangeChanged(Array.from(props.controlChange)); }
  }
  const minOf = (index: number) => index <= 0 ? {x: 0, y: 0}: index >= props.controlChange.length - 1 ? {x: 1, y: 0}: {x: props.controlChange[index - 1].position, y: 0};
  const maxOf = (index: number) => index <= 0 ? {x: 0, y: 1}: index >= props.controlChange.length - 1 ? {x: 1, y: 1}: {x: props.controlChange[index + 1].position, y: 1};
  return  <>
            <div style={{position: "relative", width: "100%", height: `${props.height}px`}}>
              {props.controlChange.map((cp, i) => <ControlPointDraggable
                                                    x={cp.position}
                                                    y={yOf(cp.ratio)}
                                                    minX={minOf(i).x}
                                                    minY={minOf(i).y}
                                                    maxX={maxOf(i).x}
                                                    maxY={maxOf(i).y}
                                                    clientWidth={props.width}
                                                    clientHeight={props.height}
                                                    onPositionChanged={handlePointChange(i)}
                                                    key={`cpd-${i}`}/>)}
            </div>
          </>
}

export default ContrlChangeView;
