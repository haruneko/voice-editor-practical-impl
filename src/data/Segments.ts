export type ControlPoint = {
  position: number;
  ratio: number;
}

export type ControlPoints = ControlPoint[];

export type Segment = {
  msBegin: number;
  msEnd: number;
  msLength: number;
  f0ControlPoints: ControlPoints;
  genControlPoints: ControlPoints;
}

export type Segments = Segment[];

const valueAt = (cps: ControlPoints, position: number) => {
  const index = cps.findIndex(v => position <= v.position);
  if(index <= 0) return cps[0].ratio;
  const interop = position - cps[index - 1].position;
  return cps[index - 1].ratio * (1 - interop) + cps[index].ratio * interop;
}

const devideControlPoints = (cps: ControlPoints, position: number) => {
  const front: ControlPoints = [];
  const rear: ControlPoints = [{position: 0, ratio: valueAt(cps, position)}];
  cps.forEach(cp => {
    if(cp.position < position) {
      front.push({position: cp.position / position, ratio: cp.ratio});
    } else {
      rear.push({position: (cp.position - position) / (1 - position), ratio: cp.ratio});
    }
  })
  front.push({position: 1, ratio: valueAt(cps, position)});
  return [front, rear];
}

export const devideSegment: (segment: Segment, position: number) => [front: Segment, rear: Segment] = (segment, position) => {
  const [frontF0, rearF0] = devideControlPoints(segment.f0ControlPoints, position);
  const [frontGen, rearGen] = devideControlPoints(segment.genControlPoints, position);
  const front: Segment = {
    msBegin: segment.msBegin,
    msLength: segment.msLength * position,
    msEnd: segment.msBegin + (segment.msEnd - segment.msBegin) * position,
    f0ControlPoints: frontF0,
    genControlPoints: frontGen
  }
  const rear: Segment = {
    msBegin: segment.msBegin + (segment.msEnd - segment.msBegin) * position,
    msLength: segment.msLength - segment.msLength * position,
    msEnd: segment.msEnd,
    f0ControlPoints: rearF0,
    genControlPoints: rearGen
  }
  return [front, rear];
}

export const pointMoved = (segments: Segments, sIndex: number, pIndex: number, ccType: "f0" | "gen", position: number, ratio: number) => {
  const ret = Array.from(segments);
  const cps = ccType === "f0" ? segments[sIndex].f0ControlPoints : segments[sIndex].genControlPoints;
  cps[pIndex] = {position : position, ratio: ratio};
  return ret;
}