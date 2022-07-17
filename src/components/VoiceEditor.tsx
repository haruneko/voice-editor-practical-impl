import React from "react";
import * as uzumejs from "uzumejs";
import { Segments } from "../data";
import Splitter from "./Splitter";
import ControlChangeView from "./ControlChangeView";
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
  const widthFrom = (msLength: number) => msLength / props.msPerPixel
  return (
    <>
      {
        props.segments.length() > 0 &&
          <Splitter
              segments={props.segments.data().map(v => { return { width: v.msLength / props.msPerPixel }; })}
              height={500}
              onSegmentChanged={handleSegmentChange}
              onSegmentDevided={handleSegmentDevision}>
            {
              props.segments.data().map((s, i) =>
                <>
                  <PartialWaveformView
                    msStart={s.msBegin} msEnd={s.msEnd}
                    fetcher={() => props.waveform}
                    width={widthFrom(s.msLength)}
                    height={240}
                    lightColor={"#888888"} darkColor={"#000000"} axisColor={"#000000"} backgroundColor={"#ffffff"} key={`pw-${i}`}/>
                  <ControlChangeView
                    width={widthFrom(s.msLength)}
                    height={240}
                    minimumValue={0.5}
                    maximumValue={2.0}
                    controlChange={[{position: 0, ratio: 1}, {position: 1, ratio: 1}]}
                    key={`cc-${i}`}
                  />
                </>
              )
            }
          </Splitter>
      }
    </>
  );
}

export default VoiceEditor;
