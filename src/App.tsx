import React, { useMemo, useState } from 'react';
import * as uzumejs from "uzumejs";
import audioBufferToWav from "audiobuffer-to-wav"
import Waveform from "./components/Waveform";
import Splitter from "./components/Splitter"
import useUzume from "./getUzume"

type Segment = {
  msBegin: number;
  msEnd: number;
  msLength: number;
}

type AppState = {
  waveform: uzumejs.Waveform;
  spectrogram: uzumejs.WaveformSpectrogram;
  segments: Segment[];
}

const App = () => {
  const [appState, setAppState] = useState<AppState>();
  const uzume = useUzume();
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
        const previousState = appState;
        setAppState({
          waveform: maybeWaveform,
          spectrogram: new u.WaveformSpectrogram(maybeWaveform),
          segments: [ {
            msBegin: 0,
            msEnd: maybeWaveform.msLength(),
            msLength: maybeWaveform.msLength()
          } ]
        });
        previousState?.waveform.delete();
        previousState?.spectrogram.delete();
      }
    }
  }
  const calculateWaveArray = async () => {
    if(!appState || appState.segments.length === 0) return new Float32Array();
    const u = await uzume;
    const toBeDeleted = new Array<{delete: () => void}>();
    const ltams = appState.segments.map(v => new u.LinearTimeAxisMap(v.msBegin, v.msEnd, v.msLength))
    const sss = ltams.map(v => new u.StretchedPartialSpectrogram(appState.spectrogram, v));
    const sv = sss.reduce((prev: uzumejs.SpectrogramVector, cur) => { prev.push_back(cur); return prev;}, new u.SpectrogramVector());
    const asa = u.ArraySpectrogramAggregator.from(sv);
    const synth = new u.SynthesizeWaveformWithWORLD();
    const out = new u.Waveform(Math.floor(asa.msLength() / 1000.0 * 44100), 44100);
    synth.synthesize(out, asa);
    const result = u.ArrayFromWaveform(out);
    ltams.forEach(v => toBeDeleted.push(v));
    sss.forEach(v => toBeDeleted.push(v));
    toBeDeleted.push(sv, asa, synth, out);
    toBeDeleted.forEach(v => v.delete());
    return result;
  }
  const handlePlayStart = async() => {
    if(!appState || appState.segments.length === 0) return;

    const buf = await calculateWaveArray();

    if(context.state === "suspended") {
      context.resume();
    }
    const sourceNode = context.createBufferSource();
    sourceNode.buffer = new AudioBuffer({length: buf.length, sampleRate: 44100});
    sourceNode.buffer.copyToChannel(buf, 0);
    sourceNode.connect(context.destination);
    sourceNode.start();
  }
  const handleWaveSave = async () => {
    if(!appState || appState.segments.length === 0) return;
    const buf = await calculateWaveArray();
    const abuf = new AudioBuffer({length: buf.length, sampleRate: 44100});
    abuf.copyToChannel(buf, 0)
    const wavBuf = audioBufferToWav(abuf);
    const dataURI = URL.createObjectURL(new Blob([wavBuf], { type: "audio/wav" }));
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.download = 'output.wav';
    a.href = dataURI;
    a.click();
    a.remove();
    URL.revokeObjectURL(dataURI);
  }
  const handleSegmentChange = (index: number, width: number) => {
    if(!appState || appState.segments.length === 0) return;
    const s = Array.from(appState.segments);
    s[index].msLength = width * 2;
    setAppState({...appState, segments: s});
  }
  const handleSegmentDevision = (index: number, ratio: number) => {
    if(!appState || appState.segments.length === 0) return;
    const s: Segment[] = [];
    for(let i = 0; i < appState.segments.length; i++) {
      if(i === index) {
        const cur = appState.segments[i];
        s.push({msBegin: cur.msBegin, msLength: cur.msLength * ratio, msEnd: cur.msBegin + (cur.msEnd - cur.msBegin) * ratio});
        s.push({msBegin: cur.msBegin + (cur.msEnd - cur.msBegin) * ratio, msLength: cur.msLength - cur.msLength * ratio, msEnd: cur.msEnd})
      } else {
        s.push(appState.segments[i]);
      }
    }
    setAppState({...appState, segments: s});
  }
  return (
    <div className="App">
      <input type="file" onChange={handleChangeFile} />
      <input type="button" onClick={handlePlayStart} value="再生" />
      <input type="button" onClick={handleWaveSave} value="保存" />
      {
        appState && appState.waveform && appState.segments.length > 0 &&
          <Splitter
              segments={appState.segments.map(v => { return { width: v.msLength / 2 } })}
              height={241}
              onSegmentChanged={handleSegmentChange}
              onSegmentDevided={handleSegmentDevision}>
            {
              appState.segments.map((s, i) =>
                <Waveform msStart={s.msBegin} msEnd={s.msEnd} fetcher={() => appState.waveform} width={Math.floor(s.msLength/2)} height={240}
                  lightColor={"#888888"} darkColor={"#000000"} axisColor={"#000000"} backgroundColor={"#ffffff"} key={i}/>)
            }
          </Splitter>
      }
    </div>
  );
}

export default App;
