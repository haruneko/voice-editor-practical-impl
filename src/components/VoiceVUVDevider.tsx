import React, { useState } from 'react'
import { Segments } from '../data/Segments';

type VoiceVUVDeviderProps = {
  segments: Segments;
  f0At: (ms: number) => number;
  devideSegments: (msPositions: Array<number>) => void
}

export const VoiceVUVDevider: React.FC<VoiceVUVDeviderProps> = (props) => {
  const [devided, setDevided] = useState(false);
  const handleClick = () => {
    const msPositions: Array<number> = [];
    let ms = 0;
    let prevF0: number | undefined = undefined;
    for(let i = 0; i < props.segments.length; i++) {
      for(let sms = props.segments[i].msBegin; sms < props.segments[i].msEnd; sms += 1.0) {
        const curF0 = props.f0At(sms);
        if(prevF0 !== undefined && ((curF0 === 0 && prevF0 !== 0) || (curF0 !== 0 && prevF0 ===0))) {
          msPositions.push(ms + sms / (props.segments[i].msEnd - props.segments[i].msBegin) * props.segments[i].msLength);
        }
        prevF0 = curF0;
      }
      ms += props.segments[i].msLength;
    }
    props.devideSegments(msPositions);
    setDevided(true);
  }
  return (
    <input type="button" onClick={handleClick} disabled={devided} value="有声・無声区間で分割"/>
  )
}

export default VoiceVUVDevider;