import React, { useState } from "react"
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
  const [segments, changeSegmentLength, devideSegment, addControlPoint, moveControlPoint, changeControlPoint, selectedControlChange, setSelectedControlChnage] = useSegments(props.segments, props.onSegmentsChanged);
  const handleSegmentChange = (index: number, width: number) => {
    changeSegmentLength(index, width * props.msPerPixel);
  }
  const handleControlPointMove = (sIndex: number) => (index: number, position: number, ratio: number) => moveControlPoint(sIndex)(index, position, ratio);
  const handleControlPointChange = (sIndex: number) => (index: number, position: number, ratio: number) => changeControlPoint(sIndex)(index, position, ratio);
  const handleCCSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    if(e.target.value !== "F0" && e.target.value !== "GEN") return;
    setSelectedControlChnage(e.target.value);
  }

  let left = 0;
  return (
    <>
      <div>
        <select value={selectedControlChange} onChange={handleCCSelectChange}>
          <option value="F0">F0</option>
          <option value="GEN">GEN</option>
        </select>
      </div>
      {
        segments.length > 0 &&
          <Splitter
              elements={segments.map(v => { return { width: v.msLength / props.msPerPixel } })}
              height={500}
              onElementChanged={handleSegmentChange}
              onElementDevided={devideSegment}
              resizable={true}>
            {
              segments.map((s, i) => {
              const result = (
                <>
                  <PartialWaveformView msStart={s.msBegin} msEnd={s.msEnd} fetcher={() => props.waveform} width={Math.floor(s.msLength / props.msPerPixel)} height={240}
                    lightColor="#888888" darkColor="#000000" axisColor="#000000" backgroundColor="#ffffff" key={`pwv-${i}`}/>
                  <div style={{height: "1px", backgroundColor: "black"}} key={`border-wave-and-cc-${i}`}/>
                  <PartialControlChangeView width={Math.floor(s.msLength/props.msPerPixel)} height={240}
                    axisColor="#000000" backgroundColor="#ffffff" controlPointColor="#000000" key={`pccv-${i}`}
                    fetcher={() => selectedControlChange === "F0" ? s.f0ControlChange : s.genControlChange}
                    onControlPointAdd={addControlPoint(i)}
                    onControlPointMove={handleControlPointMove(i)}
                    onControlPointChange={handleControlPointChange(i)}
                    minRatio={-1} maxRatio={1} left={left}
                  />
                  <div style={{height: "1px", backgroundColor: "black"}} key={`border-bottom-${i}`}/>
                </>
              )
              left += s.msLength / props.msPerPixel + 1;
              return result;
              }
            )}
          </Splitter>
      }
    </>
  );
}

export default VoiceEditor;
