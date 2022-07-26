import { useState } from "react";
import { addControlPoint } from "../data/ControlChanges";
import { devideSegment, Segments } from "../data/Segments";

export const useSegments: (_segments: Segments, onSegmentChanged?: (s: Segments) => void) => [
  Segments,
  (index: number, msLength: number) => void,
  (index: number, ratio: number) => void,
  (index: number) => (position: number) => void
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
  return [segments, changeSegmentLength, _devideSegment, _addControlPoint];
}