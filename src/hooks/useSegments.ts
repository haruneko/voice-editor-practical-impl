import { useState } from "react";
import { addControlPoint, moveControlPoint } from "../data/ControlChanges";
import { devideSegment, Segments } from "../data/Segments";

export const useSegments: (_segments: Segments, onSegmentChanged?: (s: Segments) => void) => [
  Segments,
  (index: number, msLength: number) => void,
  (index: number, ratio: number) => void,
  (index: number) => (position: number) => void,
  (ccIndex: number) => (cpIndex: number, position: number, ratio: number) => void,
  (ccIndex: number) => (cpIndex: number, position: number, ratio: number) => void,
] = (_segments, onSegmentChanged) => {
  const [segments, setSegments] = useState(_segments)
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
    const cc = addControlPoint(s[index].f0ControlChange, position);
    s[index].f0ControlChange = cc;
    if(onSegmentChanged) onSegmentChanged(s);
    setSegments(s);
  }
  const _moveContorlPoint = (sIndex: number) => {
    const f = moveControlPoint(segments, sIndex);
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
  return [segments, changeSegmentLength, _devideSegment, _addControlPoint, _moveContorlPoint, _changeControlPoint];
}