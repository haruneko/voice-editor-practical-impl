import React, { useState } from "react"
import styled from "styled-components"

const ControlPointStyled = styled.div.attrs<{x: number, y: number}>((props) => {
  return {
    style: {left: `calc(${props.x * 100}% - 4px)`, top: `calc(${props.y * 100}% - 4px)`}
  };
})<{x: number, y: number, color: string}>`
  position: absolute;
  width: 0px;
  height: 0px;
  border: 4px;
  border-style: solid;
  border-color: ${(props) => props.color};
  &:hover{ cursor: grab };
  &:active{ cursor: grabbing };
`;

type ControlPointDraggableProps = {
  x: number;
  y: number;
  minX :number;
  maxX: number;
  minY: number;
  maxY: number;
  clientWidth: number;
  clientHeight: number;
  color: string;
  onPointChanged?: (x: number, y: number) => void;
  onPointDragged?: (x: number, y: number) => void;
}

const ControlPoinrDraggable: React.FC<ControlPointDraggableProps> = (props) => {
  const [previousPosition, setPreviousPosition] = useState<{x: number, y:number} | undefined>(undefined);
  const xWithMinMax: (_: number) => number = (x) => Math.max(props.minX, Math.min(props.maxX, x));
  const yWithMinMax: (_: number) => number = (y) => Math.max(props.minY, Math.min(props.maxY, y));
  const handleOnDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setPreviousPosition({x: e.pageX, y: e.pageY});
  }
  const handleOnDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if(previousPosition === undefined) return handleOnDragStart(e);
    if(props.onPointDragged !== undefined) props.onPointDragged(
      xWithMinMax(props.x + (e.pageX - previousPosition.x) / props.clientWidth),
      yWithMinMax(props.y + (e.pageY - previousPosition.y) / props.clientHeight));
    setPreviousPosition({x: e.pageX, y: e.pageY});
  }
  const handleOnDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if(previousPosition === undefined) return;
    if(props.onPointChanged !== undefined) props.onPointChanged(
      xWithMinMax(props.x + (e.pageX - previousPosition.x) / props.clientWidth),
      yWithMinMax(props.y + (e.pageY - previousPosition.y) / props.clientHeight));
    setPreviousPosition(undefined);
  }
  return  <ControlPointStyled draggable={true} x={xWithMinMax(props.x)} y={yWithMinMax(props.y)} color={props.color}
            onDragStart={handleOnDragStart}
            onDrag={handleOnDrag}
            onDragEnd={handleOnDragEnd}
          />
}

export default ControlPoinrDraggable;