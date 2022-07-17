export type ControlPoint = {
  position: number;
  ratio: number;
}

export class ControlChange {
  constructor(leftValue: number, rightValue: number) {
    this.controlPoints.push({position: 0, ratio: leftValue});
    this.controlPoints.push({position: 1, ratio: rightValue});
  }

  at: (position: number) => number = (position) => {
    if(position < 0) {
      return this.at(0);
    } else if(position > 1) {
      return this.at(1);
    }
    const index = this.controlPoints.findIndex(v => position < v.position);
    if(index === 0) { return this.controlPoints[index].ratio; }
    const interop = (this.controlPoints[index].position - position) / (this.controlPoints[index].position - this.controlPoints[index - 1].position);
    return interop * this.controlPoints[index - 1].ratio + (1 - interop) * this.controlPoints[index].ratio;
  }
  add = (point: ControlPoint) => {
    if(this.controlPoints.find(v => v.position === point.position)) return;
    this.controlPoints.push(point);
    this.controlPoints.sort((a, b) => a.position - b.position);
  }
  remove = (index:number) => {
    if(this.controlPoints.length <= 2) return;
    this.controlPoints.splice(index, 1);
  }

  controlPoints: ControlPoint[] = [];
}
