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

type Voice = {
  waveform: uzumejs.Waveform;
  segments: Segment[];
};

const App = () => {
  const [voice, setVoice] = useState<Voice>();
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
        setVoice( { waveform: maybeWaveform,
          segments: [ {
            msBegin: 0,
            msEnd: maybeWaveform.msLength() / 2,
            msLength: maybeWaveform.msLength() / 2
          },{
            msBegin: maybeWaveform.msLength() / 2,
            msEnd: maybeWaveform.msLength(),
            msLength: maybeWaveform.msLength() / 2
          } ] }
        );
      }
    }
  }

  return (
    <div className="App">
      <input type="file" onChange={handleChangeFile} />
      {
        voice &&
          <Splitter segments={voice.segments.map(v => { return { width: v.msLength / 2 } })} height={241}>
            {
              voice.segments.map((s, i) =>
                <Waveform msStart={s.msBegin} msEnd={s.msEnd} fetcher={() => voice.waveform} width={Math.floor(s.msLength/2)} height={240}
                  lightColor={"#888888"} darkColor={"#000000"} axisColor={"#000000"} backgroundColor={"#ffffff"} key={i}/>)
            }
          </Splitter>
      }
    </div>
  );
}

export default App;
