import React, { useState } from "react";
import SplitterWrapper from "./SplitterWrapper"

type SplitterSegment = {
  width: number;
}

const Splitter = (props: React.PropsWithChildren<{segments: SplitterSegment[]; height: number}>) => {
  const [segments, setSegments] = useState<SplitterSegment[]>(props.segments);
  const handleWidthChanged = (index: number) => (width: number) => {
    const s = Array.from(segments);
    s[index].width = width < 1 ? 1 : width;
    setSegments(s);
  }
  const handleDevided = (index: number) => (x: number) => {
    console.log(JSON.stringify({index:index, x:x}));
  }
  let x = 0;
  return  <div style={{overflowX: "scroll", display: "flex", position: "relative"}}>
            {props.children && Array.isArray(props.children) && props.children.length === props.segments.length &&
              props.children.map((v, i) => {
                x += segments[i].width;
                return <SplitterWrapper
                    x={x}
                    width={segments[i].width}
                    height={props.height}
                    onWidthChanged={handleWidthChanged(i)}
                    onDevidedAt={handleDevided(i)}
                    key={i}
                  >{v}</SplitterWrapper>
              })
            }
          </div>
  ;
}

export default Splitter;