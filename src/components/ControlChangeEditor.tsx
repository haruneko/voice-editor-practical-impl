import React, { useState } from "react";
import styled from "styled-components"

const ControlPointStyled = styled.div.attrs<{x: number, y: number}>((props) => {
  return {
    style: {left: `${props.x}px`, top: `${props.y}px`}
  };
})<{x: number, y:number}>`
  flex-shrink: 0;
  cursor: col-resize;
  transition: 0.1s ease;
  border: 5px;
  border-color: black;
  position: absolute;
`;

type ControlPointDraggableProps = {
  x: number;
  y: number;
  onPositionChanged: (x: number, y: number) => void;
}

const ControlPointDraggable: React.FC<ControlPointDraggableProps> = (props) => {
  return <div draggable={true}/>
}

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

const ContrlChangeEditor: React.FC<ControlChangeEditorProps> = (props) => {
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

export default ContrlChangeEditor;
