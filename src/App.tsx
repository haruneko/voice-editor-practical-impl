import React, { useState } from 'react';
import * as uzumejs from "uzumejs";
import VoiceSynthesizer from './components/VoiceSynthesizer';
import Splitter from "./components/Splitter"
import Waveform from "./components/Waveform";
import getUzume from "./getUzume"
import VoiceLoader from './components/VoiceLoader';

type Segment = {
  msBegin: number;
  msEnd: number;
  msLength: number;
}

type AppState = {
  waveform: uzumejs.Waveform;
  spectrogram: uzumejs.Spectrogram;
  msPerPixel: number;
  segments: Segment[];
}

const App = () => {
  const [appState, setAppState] = useState<AppState>();
  const uzume = getUzume();

  const handleVoiceLoad = async (waveform: uzumejs.Waveform) => {
    const u = await uzume;
    const previousState = appState;
    setAppState({
      waveform: waveform,
      spectrogram: new u.WaveformSpectrogram(waveform),
      msPerPixel: 4,
      segments: [ {
        msBegin: 0,
        msEnd: waveform.msLength(),
        msLength: waveform.msLength()
      } ]
    });
    previousState?.waveform.delete();
    previousState?.spectrogram.delete();
  }
  const handleSegmentChange = (index: number, width: number) => {
    if(!appState || appState.segments.length === 0) return;
    const s = Array.from(appState.segments);
    s[index].msLength = width * appState.msPerPixel;
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
      <VoiceLoader onVoiceLoaded={handleVoiceLoad} />
      { appState && <VoiceSynthesizer segments={appState.segments} spectrogram={appState.spectrogram} mode={"play"}/> }
      { appState && <VoiceSynthesizer segments={appState.segments} spectrogram={appState.spectrogram} mode={"save"}/> }
      {
        appState && appState.waveform && appState.segments.length > 0 &&
          <Splitter
              segments={appState.segments.map(v => { return { width: v.msLength / appState.msPerPixel } })}
              height={241}
              onSegmentChanged={handleSegmentChange}
              onSegmentDevided={handleSegmentDevision}>
            {
              appState.segments.map((s, i) =>
                <Waveform msStart={s.msBegin} msEnd={s.msEnd} fetcher={() => appState.waveform} width={Math.floor(s.msLength/appState.msPerPixel)} height={240}
                  lightColor={"#888888"} darkColor={"#000000"} axisColor={"#000000"} backgroundColor={"#ffffff"} key={i}/>)
            }
          </Splitter>
      }
    </div>
  );
}

export default App;
