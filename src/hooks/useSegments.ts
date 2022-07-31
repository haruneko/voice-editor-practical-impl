import { useState } from "react";
import { addControlPoint, ControlChange, moveControlPoint } from "../data/ControlChanges";
import { devideSegment, Segment, Segments } from "../data/Segments";

type SegmentsContents = {
  segments: Segments;
  changeSegmentLength: (index: number, msLength: number) => void;
  devideSegment: (index: number, ratio: number) => void;
  addControlPoint: (index: number) => (position: number) => void;
  moveControlPoint: (ccIndex: number) => (cpIndex: number, position: number, ratio: number) => void;
  changeControlPoint: (ccIndex: number) => (cpIndex: number, position: number, ratio: number) => void;
  selectedControlChange: "F0" | "GEN";
  setSelectedControlChnage: (selectedControlChange: "F0" | "GEN") => void
  devideSegments: (msPositions: Array<number>) => void
}

export const useSegments: (_segments: Segments, onSegmentChanged?: (s: Segments) => void) => SegmentsContents = (_segments, onSegmentChanged) => {
  const [selectedControlChange, setSelectedControlChnage] = useState<"F0" | "GEN">("F0");
  const [segments, setSegments] = useState(_segments)
  const currentCC = (s: Segment) => selectedControlChange === "F0" ? s.f0ControlChange : s.genControlChange
  const setCC = (s: Segment, cc: ControlChange) => {if(selectedControlChange === "F0") s.f0ControlChange = cc; else s.genControlChange = cc;}
  const changeSegmentLength = (index: number, msLength: number) => {
    if(index < 0 || segments.length <= index) return;
    const s = Array.from(segments);
    s[index].msLength = msLength;
    if(onSegmentChanged) onSegmentChanged(s);
    setSegments(s)
  }
  const _devideSegment = (index: number, ratio: number) => {
    let ms = 0;
    for(let i = 0; i < index; i++) ms += segments[i].msLength;
    devideSegments([ms + segments[index].msLength * ratio]);
  }
  const _addControlPoint = (index: number) => (position: number) => {
    if(segments.length === 0) return;
    const s: Segments = structuredClone(segments);
    const cc = addControlPoint(currentCC(s[index]), position);
    setCC(s[index], cc);
    if(onSegmentChanged) onSegmentChanged(s);
    setSegments(s);
  }
  const _moveContorlPoint = (sIndex: number) => {
    const f = moveControlPoint(segments, sIndex, selectedControlChange);
    return (cpIndex: number, position: number, ratio: number) => {
      const s = f(cpIndex, position, ratio);
      setSegments(s);
      return s;
    }
  }
  const _changeControlPoint = (sIndex: number) => {
    const f = _moveContorlPoint(sIndex);
    return (cpIndex: number, position: number, ratio: number) => {
      const s: Segments = f(cpIndex, position, ratio);
      if(onSegmentChanged) onSegmentChanged(s);
      setSegments(s)
    }
  }
  const devide = (index: number, ratio: number, segments: Segments) => {
    if(index < 0 || segments.length <= index) return segments;
    const s: Segments = [];
    for(let i = 0; i < segments.length; i++) {
      if(i === index) {
        const [front, rear] = devideSegment(segments[i], ratio);
        s.push(front, rear);
      } else {
        s.push({ ...segments[i] });
      }
    }
    return s;
  }
  const devideSegments = (msPoints: Array<number>) => {
    if(segments.length === 0) return;
    const s: Segments = msPoints.reduce((prevSeg, curMs) => {
      let i = 0;
      let ms = 0;
      for(; i < prevSeg.length; i++) {
        if(ms <= curMs && curMs < ms + prevSeg[i].msLength) break;
        ms += prevSeg[i].msLength;
      }
      if(i < 0 || prevSeg.length <= i) return prevSeg;
      return devide(i, (curMs - ms) / prevSeg[i].msLength, prevSeg);
    }, segments)
    if(onSegmentChanged) onSegmentChanged(s);
    setSegments(s)
  }
  return {
    segments:segments,
    changeSegmentLength: changeSegmentLength,
    devideSegment: _devideSegment,
    addControlPoint: _addControlPoint,
    moveControlPoint: _moveContorlPoint,
    changeControlPoint: _changeControlPoint,
    selectedControlChange: selectedControlChange,
    setSelectedControlChnage: setSelectedControlChnage,
    devideSegments: devideSegments
  };
}