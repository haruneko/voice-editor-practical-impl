import { useState } from "react";
import { addControlPoint, ControlChange, moveControlPoint } from "../data/ControlChanges";
import { devideSegment, Segment, Segments } from "../data/Segments";

export const useSegments: (_segments: Segments, onSegmentChanged?: (s: Segments) => void) => [
  Segments,
  (index: number, msLength: number) => void,
  (index: number, ratio: number) => void,
  (index: number) => (position: number) => void,
  (ccIndex: number) => (cpIndex: number, position: number, ratio: number) => void,
  (ccIndex: number) => (cpIndex: number, position: number, ratio: number) => void,
  "F0" | "GEN",
  (selectedControlChange: "F0" | "GEN") => void,
] = (_segments, onSegmentChanged) => {
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
    if(segments.length === 0) return;
    const s: Segments = [];
    for(let i = 0; i < segments.length; i++) {
      if(i === index) {
        const [front, rear] = devideSegment(segments[i], ratio);
        s.push(front, rear);
      } else {
        s.push({ ...segments[i] });
      }
      if(onSegmentChanged) onSegmentChanged(s);
      setSegments(s)
    }
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
  return [segments, changeSegmentLength, _devideSegment, _addControlPoint, _moveContorlPoint, _changeControlPoint, selectedControlChange, setSelectedControlChnage];
}