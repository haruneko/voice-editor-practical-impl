import React, { useMemo, useState } from 'react';
import * as uzumejs from "uzumejs";
import VoiceEditor from "./components/VoiceEditor";
import VoiceSynthesizer from './components/VoiceSynthesizer';
import getUzume from "./getUzume"
import VoiceLoader from './components/VoiceLoader';
import { isPropertySignature } from 'typescript';

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

  const handleVoiceLoad = async (waveform: uzumejs.Waveform) => {
    const u = await getUzume();
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
  const handleSegmentsChange = (s: Segment[]) => {
    if(!appState) return;
    setAppState({...appState, segments: s});
  }
  return (
    <div className="App">
      <VoiceLoader onVoiceLoaded={handleVoiceLoad} />
      { appState && <VoiceSynthesizer segments={appState.segments} spectrogram={appState.spectrogram} mode={"play"}/> }
      { appState && <VoiceSynthesizer segments={appState.segments} spectrogram={appState.spectrogram} mode={"save"}/> }
      {
        appState && appState.waveform && appState.segments.length > 0 &&
          <VoiceEditor waveform={appState.waveform} msPerPixel={appState.msPerPixel} segments={appState.segments} onSegmentsChanged={handleSegmentsChange}/>
      }
    </div>
  );
}

export default App;
