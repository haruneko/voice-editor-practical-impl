import React from "react";
import * as uzumejs from "uzumejs";
import { ControlPoint, Segments } from "../data";
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
    if(props.segments.length() === 0) return;
    const s = Segments.from(props.segments);
    s.set(index, width * props.msPerPixel)
    if(props.onSegmentsChanged) { props.onSegmentsChanged(s); }
  }
  const handleSegmentDevision = (index: number, relativePosition: number) => {
    if(relativePosition <= 0 || 1 <= relativePosition) return;
    const s = Segments.from(props.segments);
    s.devideAt(index, relativePosition);
    if(props.onSegmentsChanged) { props.onSegmentsChanged(s); }
  }
  const handleControlPointChange = (ccIndex: number, which: "f0" | "gen") => (pIndex: number, point: ControlPoint) => {
    const s = Segments.from(props.segments);
    const cc = which === "f0"? s.at(ccIndex).f0ControlChange : s.at(ccIndex).f0ControlChange;
    cc.controlPoints[pIndex] = point;
    if(props.onSegmentsChanged) { props.onSegmentsChanged(s); }
  }
  const handleControlPointAdd = (index: number, which: "f0" | "gen") => (position: number) => {
    if(position <= 0 || 1 <= position) return;
    const s = Segments.from(props.segments);
    const cc = which === "f0"? s.at(index).f0ControlChange : s.at(index).f0ControlChange;
    cc.add({position: position, ratio: cc.at(position)});
    if(props.onSegmentsChanged) { props.onSegmentsChanged(s); }
  }
  const widthFrom = (msLength: number) => msLength / props.msPerPixel
  let left = 0;
  return (
    <>
      {
        props.segments.length() > 0 &&
          <Splitter
              segments={props.segments.data().map(v => { return { width: v.msLength / props.msPerPixel }; })}
              height={500}
              onSegmentChanged={handleSegmentChange}
              onSegmentDevided={handleSegmentDevision}
              >
            {
              props.segments.data().map((s, i) => {
                const curleft = left;
                left += widthFrom(s.msLength) + 1;
                return  <>
                          <PartialWaveformView
                            msStart={s.msBegin} msEnd={s.msEnd}
                            fetcher={() => props.waveform}
                            width={widthFrom(s.msLength)}
                            height={240}
                            lightColor={"#888888"} darkColor={"#000000"} axisColor={"#000000"} backgroundColor={"#ffffff"} key={`pw-${i}`}
                          />
                          <ControlChangeView
                            width={widthFrom(s.msLength)}
                            height={240}
                            left={curleft}
                            minimumValue={0.5}
                            maximumValue={2.0}
                            controlChange={s.f0ControlChange.controlPoints}
                            onControlChangeChanged={handleControlPointChange(i, "f0")}
                            onControlPointAdded={handleControlPointAdd(i, "f0")}
                            key={`cc-${i}`}
                          />
                        </>;
                }
              )
            }
          </Splitter>
      }
    </>
  );
}

export default VoiceEditor;
