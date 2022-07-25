import React from "react";
import SplitterWrapper from "./SplitterWrapper"

type SplitterProps = {
  elements: { width: number; }[];
  height: number;
  resizable?: boolean;
  onElementChanged?: (index: number, width: number) => void
  onElementDevided?: (index: number, x: number) => void
}

const Splitter = (props: React.PropsWithChildren<SplitterProps>) => {
  const handleWidthChanged = (index: number) => (width: number) => {
    if(props.onElementChanged) {
      props.onElementChanged(index, width < 1 ? 1: width);
    }
  }
  const handleDevided = (index: number) => (x: number) => {
    if(props.onElementDevided) {
      props.onElementDevided(index, x < 0 ? 0 : x > 1 ? 1 : x);
    }
  }
  let x = 0;
  return  <div style={{overflowX: "scroll", display: "flex", position: "relative"}}>
            {props.children && Array.isArray(props.children) && props.children.length === props.elements.length &&
              props.children.map((v, i) => {
                x += props.elements[i].width;
                return <SplitterWrapper
                    x={x}
                    width={props.elements[i].width}
                    height={props.height}
                    onWidthChanged={handleWidthChanged(i)}
                    onDevidedAt={handleDevided(i)}
                    key={i}
                    resizable={props.resizable}
                  >{v}</SplitterWrapper>
              })
            }
          </div>
  ;
}

export default Splitter;