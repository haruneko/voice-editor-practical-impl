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
