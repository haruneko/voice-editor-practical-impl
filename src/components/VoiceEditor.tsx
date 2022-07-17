import React from "react";
import * as uzumejs from "uzumejs"
import { Segments } from "../data"
import Splitter from "./Splitter";
import PartialWaveformView from "./PartialWaveformView";

type VoiceEditorProps = {
  waveform: uzumejs.Waveform;
  msPerPixel: number;
  segments: Segments;
  onSegmentsChanged?: (segments: Segments) => void;
}

const VoiceEditor: React.FC<VoiceEditorProps> = (props) => {
  const handleSegmentChange = (index: number, width: number) => {
    if(!props || props.segments.length() === 0) return;
    const s = Segments.from(props.segments);
    s.set(index, width * props.msPerPixel)
    if(props.onSegmentsChanged) { props.onSegmentsChanged(s); }
  }
  const handleSegmentDevision = (index: number, relativePosition: number) => {
    if(!props || props.segments.length() === 0) return;
    const s = Segments.from(props.segments);
    s.devideAt(index, relativePosition);
    if(props.onSegmentsChanged) { props.onSegmentsChanged(s); }
  }
  return (
    <>
      {
        props.segments.length() > 0 &&
          <Splitter
              segments={props.segments.data().map(v => { return { width: v.msLength / props.msPerPixel }; })}
              height={241}
              onSegmentChanged={handleSegmentChange}
              onSegmentDevided={handleSegmentDevision}>
            {
              props.segments.data().map((s, i) =>
                <PartialWaveformView msStart={s.msBegin} msEnd={s.msEnd} fetcher={() => props.waveform} width={Math.floor(s.msLength/props.msPerPixel)} height={240}
                  lightColor={"#888888"} darkColor={"#000000"} axisColor={"#000000"} backgroundColor={"#ffffff"} key={i}/>)
            }
          </Splitter>
      }
    </>
  );
}

export default VoiceEditor;
