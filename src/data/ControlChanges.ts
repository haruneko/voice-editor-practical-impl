import { Segment, Segments } from "./Segments";

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

export const moveControlPoint = (segments: Segments, sIndex: number, selectedControlChange: "F0" | "GEN") => (cpIndex: number, position: number, ratio: number) => {
  if(sIndex < 0 || segments.length <= sIndex) return segments;
  const currentCC = (s: Segment) => selectedControlChange === "F0" ? s.f0ControlChange : s.genControlChange
  if(cpIndex < 0 || currentCC(segments[sIndex]).length <= cpIndex) return segments;
  const result: Segments = structuredClone(segments);
  if(cpIndex === 0 && sIndex !== 0) {
    currentCC(result[sIndex])[0] = {position: 0, ratio: ratio};
    currentCC(result[sIndex - 1])[currentCC(segments[sIndex - 1]).length - 1] = {position: 1, ratio: ratio}
  } else if(cpIndex === currentCC(segments[sIndex]).length - 1 && sIndex < segments.length - 1) {
    currentCC(result[sIndex])[currentCC(segments[sIndex]).length - 1] = {position: 1, ratio: ratio};
    currentCC(result[sIndex + 1])[0] = {position: 0, ratio: ratio};
  } else {
    currentCC(result[sIndex])[cpIndex] = {position: position, ratio: ratio};
  }
  return result;
}
