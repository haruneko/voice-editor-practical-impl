import React, { useState } from 'react';
import * as uzumejs from "uzumejs";
import { ControlChange, Segments } from "./data";
import VoiceEditor from "./components/VoiceEditor";
import VoiceSynthesizer from './components/VoiceSynthesizer';
import getUzume from "./getUzume";
import VoiceLoader from './components/VoiceLoader';


type AppState = {
  waveform: uzumejs.Waveform;
  spectrogram: uzumejs.Spectrogram;
  msPerPixel: number;
  segments: Segments;
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
      segments: new Segments([ {
        msBegin: 0,
        msEnd: waveform.msLength(),
        msLength: waveform.msLength(),
        f0ControlChange: new ControlChange(1, 1),
        genControlChange: new ControlChange(1, 1)
      } ])
    });
    previousState?.waveform.delete();
    previousState?.spectrogram.delete();
  }
  const handleSegmentsChange = (s: Segments) => {
    if(!appState) return;
    setAppState({...appState, segments: s});
  }
  return (
    <div className="App">
      <VoiceLoader onVoiceLoaded={handleVoiceLoad} />
      { appState && <VoiceSynthesizer segments={appState.segments} spectrogram={appState.spectrogram} mode={"play"}/> }
      { appState && <VoiceSynthesizer segments={appState.segments} spectrogram={appState.spectrogram} mode={"save"}/> }
      {
        appState && appState.waveform && appState.segments.length() > 0 &&
          <VoiceEditor waveform={appState.waveform} msPerPixel={appState.msPerPixel} segments={appState.segments} onSegmentsChanged={handleSegmentsChange}/>
      }
    </div>
  );
}

export default App;
