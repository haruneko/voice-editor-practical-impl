import React, { useState } from "react";
import styled from "styled-components"

const ControlPointStyled = styled.div.attrs<{x: number, y: number}>((props) => {
  return {
    style: {left: `calc(${props.x * 100}% - 4px)`, top: `calc(${props.y * 100}% - 4px)`}
  };
})<{x: number, y:number}>`
  flex-shrink: 0;
  cursor: col-resize;
  transition: 0.1s ease;
  border: 4px;
  border-color: black;
  border-style: solid;
  position: absolute;
  &:hover{ cursor: grab; }
  &:active{ cursor: grabbing; }
`;

type ControlPointDraggableProps = {
  x: number;
  y: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  clientWidth: number;
  clientHeight: number;
  onPositionChanged: (x: number, y: number) => void;
}

const ControlPointDraggable: React.FC<ControlPointDraggableProps> = (props) => {
  const [startPosition, setStartPosition] = useState({x: 0, y: 0});
  const [position, setPosition] = useState({x: props.x, y: props.y});

  const handleOnDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setStartPosition({x: e.pageX, y: e.pageY});
    e.stopPropagation();
  };
  const handleOnDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const position = {x: props.x + (e.pageX - startPosition.x) / props.clientWidth, y: props.y + (e.pageY - startPosition.y) / props.clientHeight};
    setPosition({x: xWithLimitation(position.x), y: yWithLimitation(position.y)});
  };
  const handleOnDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const position = {x: props.x + (e.pageX - startPosition.x) / props.clientWidth, y: props.y + (e.pageY - startPosition.y) / props.clientHeight};
    props.onPositionChanged(xWithLimitation(position.x), yWithLimitation(position.y));
    setPosition({x: props.x, y: props.y});
  };
  const xWithLimitation = (x: number) => Math.min(props.maxX, Math.max(props.minX, x));
  const yWithLimitation = (y: number) => Math.min(props.maxY, Math.max(props.minY, y));

  return <ControlPointStyled
            draggable={true}
            x={xWithLimitation(position.x)}
            y={yWithLimitation(position.y)}
            onDragStart={handleOnDragStart}
            onDrag={handleOnDrag}
            onDragEnd={handleOnDragEnd}
          />;
}

export default ControlPointDraggable;
