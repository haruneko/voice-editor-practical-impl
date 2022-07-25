import React, { useState } from 'react';
import * as uzumejs from "uzumejs";
import VoiceSynthesizer from './components/VoiceSynthesizer';
import useUzume from "./hooks/useUzume"
import VoiceLoader from './components/VoiceLoader';
import VoiceEditor from './components/VoiceEditor';
import { Segments } from './data/Segments';
import { ControlChanges } from './data/ControlChanges';

type AppState = {
  waveform: uzumejs.Waveform;
  spectrogram: uzumejs.Spectrogram;
  msPerPixel: number;
  segments: Segments;
  f0ControlChanges: ControlChanges;
  genControlChanges: ControlChanges;
}

const App = () => {
  const [appState, setAppState] = useState<AppState>();
  const uzume = useUzume();

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
      } ],
      f0ControlChanges: [],
      genControlChanges: []
    });
    previousState?.waveform.delete();
    previousState?.spectrogram.delete();
  }
  const handleSegmentsChange = (segments: Segments) => {
    if(appState) setAppState({ ...appState, segments: segments });
  }
  return (
    <div className="App">
      <VoiceLoader onVoiceLoaded={handleVoiceLoad} />
      { appState && <VoiceSynthesizer segments={appState.segments} spectrogram={appState.spectrogram} mode={"play"}/> }
      { appState && <VoiceSynthesizer segments={appState.segments} spectrogram={appState.spectrogram} mode={"save"}/> }
      {
        appState &&
          <VoiceEditor waveform={appState.waveform} msPerPixel={2} segments={appState.segments} onSegmentsChanged={handleSegmentsChange}
          />
      }
    </div>
  );
}

export default App;
