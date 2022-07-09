import React, { useState } from "react";
import styled from "styled-components"

const SplitterGutter = styled.div.attrs<{x: number, height: number}>((props) => {
  return {
    style: {left: `${props.x - 2}px`}
  };
})<{x: number, height:number}>`
  flex-shrink: 0;
  width: 5px;
  height: ${(props) => `${props.height}px`};
  cursor: col-resize;
  transition: 0.1s ease;
  background-color: rgba(0, 0, 0, 0);
  position: absolute;
`;

const SplitterContent = styled.div.attrs<{width: number, height: number}>((props) => {
  return {
    style: {width: `${props.width}px`}
  };
})<{width: number, height: number}>`
  height: ${(props) => `${props.height}px`};
  flex-shrink: 0;
  border-right: 1px solid black;
`;

type SplitterWrapperProps = {
  width: number;
  height: number;
  x: number;
  resizable?: boolean;
  onWidthChanged?: (width: number) => void;
  onDevidedAt?: (ratio: number) => void;
}

const SplitterWrapper = (props: React.PropsWithChildren<SplitterWrapperProps>) => {
  const [dragStartX, setDragStartX] = useState(0);
  const [diff, setDiff] = useState(0);

  const handleOnDragStart=({ clientX }: React.DragEvent<HTMLDivElement>) => {
    setDragStartX(clientX);
  }
  const handleOnDrag = ({ clientX }: React.DragEvent<HTMLDivElement>) => {
    setDiff(clientX - dragStartX);
  };
  const handleOnDragEnd = ({ clientX }: React.DragEvent<HTMLDivElement>) => {
    if(props.onWidthChanged) {
      props.onWidthChanged(props.width + (clientX - dragStartX));
    };
    setDiff(0)
  }
  const handleOnDoubleClicked = (e: React.MouseEvent<HTMLDivElement>) => {
    if(props.onDevidedAt) {
      props.onDevidedAt((props.width - (props.x - e.clientX)) / props.width);
    }
  };
  return  <>
            <SplitterContent
                className="splitter-content"
                width={props.width + diff}
                height={props.height}
                onDoubleClick={props.resizable ? handleOnDoubleClicked : undefined}>
              {props.children}
            </SplitterContent>
            {props.resizable &&
              <SplitterGutter className="splitter-gutter" x={props.x + diff} height={props.height} draggable={true} onDrag={handleOnDrag} onDragStart={handleOnDragStart} onDragEnd={handleOnDragEnd}/>
            }
          </>
}

export default SplitterWrapper;