export type Segment = {
  msBegin: number;
  msEnd: number;
  msLength: number;
}

export class Segments  {
  constructor(private segments: Segment[]) { }
  static from = (other: Segments) => new Segments(other.segments);

  at = (index: number) => this.segments[index];
  set = (index: number, msLength: number) => this.segments[index].msLength = msLength;
  length = () => this.segments.length;
  data = () => this.segments;

  devideAt = (index: number, relativePosition: number) => {
    if(index < 0 || this.segments.length <= index) return;
    const s: Segment[] = [];
    for(let i = 0; i < this.segments.length; i++) {
      if(i === index) {
        const cur = this.segments[i];
        s.push({
          msBegin: cur.msBegin,
          msLength: cur.msLength * relativePosition,
          msEnd: cur.msBegin + (cur.msEnd - cur.msBegin) * relativePosition
        });
        s.push({
          msBegin: cur.msBegin + (cur.msEnd - cur.msBegin) * relativePosition,
          msLength: cur.msLength - cur.msLength * relativePosition,
          msEnd: cur.msEnd
        })
      } else {
        s.push(this.segments[i]);
      }
    }
    this.segments = s;
  }
}

export default Segment;
