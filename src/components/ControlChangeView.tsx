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
  left: number
  minimumValue: number;
  maximumValue: number;
  edittable?: boolean;
  onControlChangeChanged?: (index: number, point: ControlPoint) => void;
  onControlPointAdded?: (position: number) => void;
}

const ContrlChangeView: React.FC<ControlChangeEditorProps> = (props) => {
  const yOf = (ratio: number) =>
      1 - (Math.log(props.maximumValue) - Math.log(ratio)) / (Math.log(props.maximumValue) - Math.log(props.minimumValue));
  const ratioOf = (y: number) =>
      props.minimumValue * Math.exp(y * (Math.log(props.maximumValue) - Math.log(props.minimumValue)));
  const handlePointChange = (index: number) => (x: number, y: number) => {
    if(props.onControlChangeChanged) { props.onControlChangeChanged(index, { position: x, ratio: ratioOf(y) }); }
  }
  const handlePointAdd = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if(props.onControlPointAdded) { props.onControlPointAdded((e.clientX - props.left) / props.width); }
  }
  const minOf = (index: number) => index <= 0 ? {x: 0, y: 0}: index >= props.controlChange.length - 1 ? {x: 1, y: 0}: {x: props.controlChange[index - 1].position, y: 0};
  const maxOf = (index: number) => index <= 0 ? {x: 0, y: 1}: index >= props.controlChange.length - 1 ? {x: 1, y: 1}: {x: props.controlChange[index + 1].position, y: 1};
  return  <>
            <div style={{position: "relative", width: "100%", height: `${props.height}px`}} onDoubleClick={handlePointAdd}>
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
