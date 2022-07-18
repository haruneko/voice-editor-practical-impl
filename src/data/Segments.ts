import { ControlChange } from "../data";

export type Segment = {
  msBegin: number;
  msEnd: number;
  msLength: number;
  f0ControlChange: ControlChange;
  genControlChange: ControlChange;
}

export class Segments  {
  constructor(private segments: Segment[]) { }
  static from = (other: Segments) => {
    const result = new Segments(Array.from(other.segments));
    result.segments.forEach(s => {
      s.f0ControlChange = ControlChange.from(s.f0ControlChange);
      s.genControlChange = ControlChange.from(s.genControlChange);
    })
    return result;
  }

  at = (index: number) => this.segments[index];
  set = (index: number, msLength: number) => this.segments[index].msLength = msLength;
  length = () => this.segments.length;
  data = () => this.segments;

  devideAt = (index: number, relativePosition: number) => {
    if(index < 0 || this.segments.length <= index || relativePosition <= 0 || 1 <= relativePosition) return;
    const s: Segment[] = [];
    for(let i = 0; i < this.segments.length; i++) {
      if(i === index) {
        const cur = this.segments[i];
        const [f0Front, f0Rear] = cur.f0ControlChange.devideAt(relativePosition);
        const [genFront, genRear] = cur.genControlChange.devideAt(relativePosition);
        s.push({
          msBegin: cur.msBegin,
          msLength: cur.msLength * relativePosition,
          msEnd: cur.msBegin + (cur.msEnd - cur.msBegin) * relativePosition,
          f0ControlChange: f0Front,
          genControlChange: genFront
        });
        s.push({
          msBegin: cur.msBegin + (cur.msEnd - cur.msBegin) * relativePosition,
          msLength: cur.msLength - cur.msLength * relativePosition,
          msEnd: cur.msEnd,
          f0ControlChange: f0Rear,
          genControlChange: genRear
        })
      } else {
        s.push(this.segments[i]);
      }
    }
    this.segments = s;
  }
}

export default Segment;
