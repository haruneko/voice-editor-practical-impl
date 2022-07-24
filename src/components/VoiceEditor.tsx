import React, { useState } from "react"
import * as uzumejs from "uzumejs";
import { Segments, devide } from "../data";
import PartialControlChangeView from "./PartialControlChangeView";
import PartialWaveformView from "./PartialWaveformView";
import Splitter from "./Splitter";


type VoiceEditorProps = {
  waveform: uzumejs.Waveform;
  msPerPixel: number;
  segments: Segments;
  onSegmentsChanged?: (segments: Segments) => void;
}

const VoiceEditor: React.FC<VoiceEditorProps> = (props) => {
  const handleSegmentChange = (index: number, width: number) => {
    if(props.segments.length === 0) return;
    const s = Array.from(props.segments);
    s[index].msLength = width * props.msPerPixel;
    if(props.onSegmentsChanged) props.onSegmentsChanged(s);
  }
  const handleSegmentDevision = (index: number, ratio: number) => {
    if(props.segments.length === 0) return;
    const s: Segments = [];
    for(let i = 0; i < props.segments.length; i++) {
      if(i === index) {
        const [front, rear] = devide(props.segments[i], ratio);
        s.push(front, rear);
      } else {
        s.push(props.segments[i]);
      }
    }
    if(props.onSegmentsChanged) props.onSegmentsChanged(s);
  }
  return (
    <>
      {
        props.segments.length > 0 &&
          <Splitter
              segments={props.segments.map(v => { return { width: v.msLength / props.msPerPixel } })}
              height={500}
              onSegmentChanged={handleSegmentChange}
              onSegmentDevided={handleSegmentDevision}>
            {
              props.segments.map((s, i) =>
                <>
                  <PartialWaveformView msStart={s.msBegin} msEnd={s.msEnd} fetcher={() => props.waveform} width={Math.floor(s.msLength / props.msPerPixel)} height={240}
                    lightColor="#888888" darkColor="#000000" axisColor="#000000" backgroundColor="#ffffff" key={`pwv-${i}`}/>
                  <div style={{height: "1px", backgroundColor: "black"}} />
                  <PartialControlChangeView msStart={s.msBegin} msEnd={s.msEnd} width={Math.floor(s.msLength/props.msPerPixel)} height={240}
                    axisColor="#000000" backgroundColor="#ffffff" controlPointColor="#000000" key={`pccv-${i}`}
                    fetcher={() => [{position: 0, ratio: 0}, {position: 0.33, ratio: 0.75}, {position: 0.66, ratio: -0.75}, {position: 1, ratio: 0}]}
                    minRatio={-1} maxRatio={1}
                  />
                  <div style={{height: "1px", backgroundColor: "black"}} />
                </>
            )}
          </Splitter>
      }
    </>
  );
}

export default VoiceEditor;
