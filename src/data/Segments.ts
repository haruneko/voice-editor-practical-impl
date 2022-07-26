import { ControlChange, devideControlChange } from "./ControlChanges";

export type Segment = {
  msBegin: number;
  msEnd: number;
  msLength: number;
  f0ControlChange: ControlChange;
}

export type Segments = Segment[];

export const devideSegment: (segment: Segment, position: number) => [front: Segment, rear: Segment] = (segment, position) => {
  const [f0Front, f0rear] = devideControlChange(segment.f0ControlChange, position);
  const front: Segment = {
    msBegin: segment.msBegin,
    msLength: segment.msLength * position,
    msEnd: segment.msBegin + (segment.msEnd - segment.msBegin) * position,
    f0ControlChange: f0Front
  }
  const rear: Segment = {
    msBegin: segment.msBegin + (segment.msEnd - segment.msBegin) * position,
    msLength: segment.msLength - segment.msLength * position,
    msEnd: segment.msEnd,
    f0ControlChange: f0rear
  }
  return [front, rear];
}
