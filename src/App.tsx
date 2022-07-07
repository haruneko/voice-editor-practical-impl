import React, { useMemo, useState } from 'react';
import * as uzumejs from "uzumejs";
import Waveform from "./components/Waveform";
import Splitter from "./components/Splitter"

// Required to let webpack 4 know it needs to copy the wasm file to our assets
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import uzumejsWasm from "!!file-loader?name=uzumewasm-[contenthash].wasm!uzumejs/resources/uzumewasm.wasm";

type Segment = {
  msBegin: number;
  msEnd: number;
  msLength: number;
}

const App = () => {
  const [waveform, setWaveform] = useState<uzumejs.Waveform>();
  const [segments, setSegments] = useState<Segment[]>();
  const uzume = useMemo(async () => await uzumejs.default({ locateFile: () => uzumejsWasm }), []);
  const context = useMemo(() =>  new AudioContext(), []);

  const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e?.target?.files?.item(0);
    if(file !== null && file !== undefined) {
      const buffer = await context.decodeAudioData(
        await file.arrayBuffer()
      );
      const u = await uzume;
      const maybeWaveform = u.CreateWaveformFrom(buffer.getChannelData(0), buffer.sampleRate);
      if(maybeWaveform !== null) {
        setWaveform(maybeWaveform);
        setSegments( [ {
            msBegin: 0,
            msEnd: maybeWaveform.msLength() / 2,
            msLength: maybeWaveform.msLength() / 2
          },{
            msBegin: maybeWaveform.msLength() / 2,
            msEnd: maybeWaveform.msLength(),
            msLength: maybeWaveform.msLength() / 2
          } ]
        );
      }
    }
  }
  const handleSegmentChange = (index: number, width: number) => {
    if(!segments || segments.length === 0) return;
    const s = Array.from(segments);
    s[index].msLength = width * 2;
    setSegments(s);
  }
  const handleSegmentDevision = (index: number, ratio: number) => {
    console.log(index, ratio);
    if(!segments || segments.length === 0) return;
    const s: Segment[] = [];
    for(let i = 0; i < segments.length; i++) {
      if(i === index) {
        const cur = segments[i];
        s.push({msBegin: cur.msBegin, msLength: cur.msLength * ratio, msEnd: cur.msBegin + (cur.msEnd - cur.msBegin) * ratio});
        s.push({msBegin: cur.msBegin + (cur.msEnd - cur.msBegin) * ratio, msLength: cur.msLength - cur.msLength * ratio, msEnd: cur.msEnd})
      } else {
        s.push(segments[i]);
      }
    }
    setSegments(s);
  }
  return (
    <div className="App">
      <input type="file" onChange={handleChangeFile} />
      {
        waveform && segments && segments.length > 0 &&
          <Splitter
              segments={segments.map(v => { return { width: v.msLength / 2 } })}
              height={241}
              onSegmentChanged={handleSegmentChange}
              onSegmentDevided={handleSegmentDevision}>
            {
              segments.map((s, i) =>
                <Waveform msStart={s.msBegin} msEnd={s.msEnd} fetcher={() => waveform} width={Math.floor(s.msLength/2)} height={240}
                  lightColor={"#888888"} darkColor={"#000000"} axisColor={"#000000"} backgroundColor={"#ffffff"} key={i}/>)
            }
          </Splitter>
      }
    </div>
  );
}

export default App;
