import React from "react";
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

export default ControlPointDraggable;
