import React, { useCallback, useState } from "react";
import styled from "styled-components"

type SplitterSegment = {
  width: number;
}

const SplitterGutter = styled.div.attrs<{height:number, right: number}>((props) => ({
  style: { left: `$(props.right - 2)px` }
}))<{height:number, right: number}>`
  flex-shrink: 0;
  width: 5px;
  height: ${(props) => `${props.height}px`};
  cursor: col-resize;
  transition: 0.1s ease;
  background-color: rgba(0, 0, 0, 0);
`;

const SplitterContent = styled.div.attrs<{width: number, height: number}>((props) => {
  return {
    style: {width: `${props.width}px`}
  };
})<{width: number, height: number}>`
  height: ${(props) => `${props.height}px`};
  flex-shrink: 0;
  border: 0px;
`;

type SplitterWrapperProps = {
  width: number;
  height: number;
  right: number;
  onWidthChanged?: (width: number) => void;
  onDevidedAt?: (x: number) => void;
}

const SplitterWrapper = (props: React.PropsWithChildren<SplitterWrapperProps>) => {
    const [gutterPosition, setGutterPosition] = useState<{right: number, width: number, previousX: number}>({right: props.right, width: props.width, previousX: 0});

    const handleOnDragStart=({ clientX }: React.DragEvent<HTMLDivElement>) => {
      setGutterPosition({right: gutterPosition.right, width: gutterPosition.width, previousX: clientX});
    }
    const handleOnDrag = ({ clientX }: React.DragEvent<HTMLDivElement>) => {
      const diff = clientX - gutterPosition.previousX;
      setGutterPosition({right: gutterPosition.right + diff, width: gutterPosition.width + diff, previousX: clientX});
    };

  return  <>
              <SplitterContent className="splitter-content" width={gutterPosition.width} height={props.height}>
                {props.children}
              </SplitterContent>
              <SplitterGutter right={gutterPosition.right} height={props.height} draggable={true} onDrag={handleOnDrag} onDragStart={handleOnDragStart}/>
            </>
}

const Splitter = (props: React.PropsWithChildren<{segments: SplitterSegment[]; height: number}>) => {
    let right = 0;
    const handleWidthChanged = (index: number) => (width: number) => {

    }
    return  <div style={{overflowX: "scroll", display: "flex"}}>
              {props.children && Array.isArray(props.children) && props.children.length === props.segments.length &&
                props.children.map((v, i) => {
                  right += props.segments[i].width;
                  return <SplitterWrapper right={right} width={props.segments[i].width} height={props.height} onWidthChanged={handleWidthChanged(i)} key={i}>{v}</SplitterWrapper>
                })
              }
            </div>
    ;
}

export default Splitter;