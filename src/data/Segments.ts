
export type Segment = {
  msBegin: number;
  msEnd: number;
  msLength: number;
}

export type Segments = Segment[];

export const devideSegment: (segment: Segment, position: number) => [front: Segment, rear: Segment] = (segment, position) => {
  const front: Segment = {
    msBegin: segment.msBegin,
    msLength: segment.msLength * position,
    msEnd: segment.msBegin + (segment.msEnd - segment.msBegin) * position
  }
  const rear: Segment = {
    msBegin: segment.msBegin + (segment.msEnd - segment.msBegin) * position,
    msLength: segment.msLength - segment.msLength * position,
    msEnd: segment.msEnd
  }
  return [front, rear];
}
