import { Segments } from "./Segments";

export type ControlPoint = {
  position: number;
  ratio: number;
}

export type ControlChange = ControlPoint[];
export type ControlChanges = ControlChange[];

const valueAt = (cc: ControlChange, position: number) => {
  const index = cc.findIndex(v => position <= v.position);
  if(index <= 0) return cc[0].ratio;
  const interop = position - cc[index - 1].position;
  return cc[index - 1].ratio * (1 - interop) + cc[index].ratio * interop;
}

export const devideControlChange = (cc: ControlChange, position: number) => {
  const front: ControlChange = [];
  const rear: ControlChange = [{position: 0, ratio: valueAt(cc, position)}];
  cc.forEach(cp => {
    if(cp.position < position) {
      front.push({position: cp.position / position, ratio: cp.ratio});
    } else {
      rear.push({position: (cp.position - position) / (1 - position), ratio: cp.ratio});
    }
  })
  front.push({position: 1, ratio: valueAt(cc, position)});
  return [front, rear];
}

export const addControlPoint = (cc: ControlChange, position: number) => {
  const r: ControlChange = [];
  let i = 0;
  for(; i < cc.length && cc[i].position < position; i++) {
    r.push(cc[i]);
  }
  r.push({position: position, ratio: valueAt(cc, position)});
  for(; i < cc.length; i++) {
    r.push(cc[i]);
  }
  return r;
}

export const moveControlPoint = (segments: Segments, sIndex: number) => (cpIndex: number, position: number, ratio: number) => {
  if(sIndex < 0 || segments.length <= sIndex) return segments;
  if(cpIndex < 0 || segments[sIndex].f0ControlChange.length <= cpIndex) return segments;
  const result: Segments = structuredClone(segments);
  if(cpIndex === 0 && sIndex !== 0) {
    result[sIndex].f0ControlChange[0] = {position: 0, ratio: ratio};
    result[sIndex - 1].f0ControlChange[segments[sIndex - 1].f0ControlChange.length - 1] = {position: 1, ratio: ratio}
  } else if(cpIndex === segments[sIndex].f0ControlChange.length - 1 && sIndex < segments.length - 1) {
    result[sIndex].f0ControlChange[segments[sIndex].f0ControlChange.length - 1] = {position: 1, ratio: ratio};
    result[sIndex + 1].f0ControlChange[0] = {position: 0, ratio: ratio};
  } else {
    result[sIndex].f0ControlChange[cpIndex] = {position: position, ratio: ratio};
  }
  return result;
}
