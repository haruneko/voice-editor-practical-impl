import React from "react"
import * as uzumejs from "uzumejs";
import { Segments } from "../data/Segments";
import { useSegments } from "../hooks/useSegments";
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
  const [segments, changeSegmentLength, devideSegment, addControlPoint, moveControlPoint] = useSegments(props.segments, props.onSegmentsChanged);
  const handleSegmentChange = (index: number, width: number) => {
    changeSegmentLength(index, width * props.msPerPixel);
  }
  const handleControlPointMove = (sIndex: number) => (index: number, position: number, ratio: number) => {
    moveControlPoint(sIndex)(index, position, ratio);
  }

  return (
    <>
      {
        segments.length > 0 &&
          <Splitter
              elements={segments.map(v => { return { width: v.msLength / props.msPerPixel } })}
              height={500}
              onElementChanged={handleSegmentChange}
              onElementDevided={devideSegment}
              resizable={true}>
            {
              segments.map((s, i) =>
                <>
                  <PartialWaveformView msStart={s.msBegin} msEnd={s.msEnd} fetcher={() => props.waveform} width={Math.floor(s.msLength / props.msPerPixel)} height={240}
                    lightColor="#888888" darkColor="#000000" axisColor="#000000" backgroundColor="#ffffff" key={`pwv-${i}`}/>
                  <div style={{height: "1px", backgroundColor: "black"}} />
                  <PartialControlChangeView width={Math.floor(s.msLength/props.msPerPixel)} height={240}
                    axisColor="#000000" backgroundColor="#ffffff" controlPointColor="#000000" key={`pccv-${i}`}
                    fetcher={() => s.f0ControlChange}
                    onControlPointAdd={addControlPoint(i)}
                    onControlPointMove={handleControlPointMove(i)}
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
