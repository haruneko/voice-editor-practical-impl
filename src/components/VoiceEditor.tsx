import React from "react";
import * as uzumejs from "uzumejs"
import Splitter from "./Splitter";
import Waveform from "./Waveform";

type Segment = {
  msBegin: number;
  msEnd: number;
  msLength: number;
}

type VoiceEditorProps = {
  waveform: uzumejs.Waveform;
  msPerPixel: number;
  segments: Segment[];
  onSegmentsChanged?: (segments: Segment[]) => void;
}

const VoiceEditor: React.FC<VoiceEditorProps> = (props) => {
  const handleSegmentChange = (index: number, width: number) => {
    if(!props || props.segments.length === 0) return;
    const s = Array.from(props.segments);
    s[index].msLength = width * props.msPerPixel;
    if(props.onSegmentsChanged) { props.onSegmentsChanged(s); }
  }
  const handleSegmentDevision = (index: number, ratio: number) => {
    if(!props || props.segments.length === 0) return;
    const s: Segment[] = [];
    for(let i = 0; i < props.segments.length; i++) {
      if(i === index) {
        const cur = props.segments[i];
        s.push({msBegin: cur.msBegin, msLength: cur.msLength * ratio, msEnd: cur.msBegin + (cur.msEnd - cur.msBegin) * ratio});
        s.push({msBegin: cur.msBegin + (cur.msEnd - cur.msBegin) * ratio, msLength: cur.msLength - cur.msLength * ratio, msEnd: cur.msEnd})
      } else {
        s.push(props.segments[i]);
      }
    }
    if(props.onSegmentsChanged) { props.onSegmentsChanged(s); }
  }
  return (
    <>
      {
        props && props.waveform && props.segments.length > 0 &&
          <Splitter
              segments={props.segments.map(v => { return { width: v.msLength / props.msPerPixel }; })}
              height={241}
              onSegmentChanged={handleSegmentChange}
              onSegmentDevided={handleSegmentDevision}>
            {
              props.segments.map((s, i) =>
                <Waveform msStart={s.msBegin} msEnd={s.msEnd} fetcher={() => props.waveform} width={Math.floor(s.msLength/props.msPerPixel)} height={240}
                  lightColor={"#888888"} darkColor={"#000000"} axisColor={"#000000"} backgroundColor={"#ffffff"} key={i}/>)
            }
          </Splitter>
      }
    </>
  );
}

export default VoiceEditor;
