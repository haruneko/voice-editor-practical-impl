import React, { useRef } from "react";

type SplitterSegment = {
  width: number;
}

const SplitterWrapper = (props: React.PropsWithChildren<{width: number, height: number}>) => {
    const gutterRef = useRef<HTMLDivElement>(null);

    return  <>
              <div className="splitter-wrapper" style={{flexShrink: 0, border: "0px", width: `${props.width}px`, height: `${props.height}px`}}>
                {props.children}
              </div>
              <div className="splitter-gutter" style={{flexShrink: 0, width: "1px", height: `${props.height}px`, backgroundColor: "#ff0000"}} ref={gutterRef} />
            </>
}

const Splitter = (props: React.PropsWithChildren<{segments: SplitterSegment[]; height: number}>) => {
    return  <div style={{overflowX: "scroll", display: "flex"}}>
              {props.children && Array.isArray(props.children) && props.children.length === props.segments.length &&
                props.children.map((v, i) => {
                  return <SplitterWrapper width={props.segments[i].width} height={props.height}>{v}</SplitterWrapper>
                })
              }
            </div>
    ;
}

export default Splitter;