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

export const moveControlPoint = (ccs: ControlChanges, ccIndex: number) => (cpIndex: number) => (position: number, ratio: number) => {
  if(ccIndex < 0 || ccs.length <= ccIndex) return;
  if(cpIndex < 0 || ccs[ccIndex].length <= cpIndex) return;
  const result = structuredClone(ccs);
  if(cpIndex === 0 && ccIndex !== 0) {
    result[ccIndex][0] = {position: 0, ratio: ratio};
    result[ccIndex - 1][ccs[ccIndex - 1].length - 1] = {position: 1, ratio: ratio}
  } else if(cpIndex === ccs[ccIndex].length - 1 && ccIndex < ccs.length - 1) {
    result[ccIndex][ccs[ccIndex].length - 1] = {position: 1, ratio: ratio};
    result[ccIndex + 1][0] = {position: 0, ratio: ratio};
  } else {
    result[ccIndex][cpIndex] = {position: position, ratio: ratio};
  }
  return result;
}
