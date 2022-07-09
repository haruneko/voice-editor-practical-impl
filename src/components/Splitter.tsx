import React from "react";
import SplitterWrapper from "./SplitterWrapper"

type SplitterProps = {
  segments: { width: number; }[];
  height: number;
  onSegmentChanged?: (index: number, width: number) => void
  onSegmentDevided?: (index: number, x: number) => void
}

const Splitter = (props: React.PropsWithChildren<SplitterProps>) => {
  const handleWidthChanged = (index: number) => (width: number) => {
    if(props.onSegmentChanged) {
      props.onSegmentChanged(index, width < 1 ? 1: width);
    }
  }
  const handleDevided = (index: number) => (x: number) => {
    if(props.onSegmentDevided) {
      props.onSegmentDevided(index, x < 0 ? 0 : x > 1 ? 1 : x);
    }
  }
  let x = 0;
  return  <div style={{overflowX: "scroll", display: "flex", position: "relative"}}>
            {props.children && Array.isArray(props.children) && props.children.length === props.segments.length &&
              props.children.map((v, i) => {
                x += props.segments[i].width;
                return <SplitterWrapper
                    x={x}
                    width={props.segments[i].width}
                    height={props.height}
                    onWidthChanged={handleWidthChanged(i)}
                    onDevidedAt={handleDevided(i)}
                    key={i}
                    resizable={true}
                  >{v}</SplitterWrapper>
              })
            }
          </div>
  ;
}

export default Splitter;