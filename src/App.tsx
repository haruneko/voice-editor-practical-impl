import React, { useState } from 'react';
import * as uzumejs from "uzumejs";
import VoiceSynthesizer from './components/VoiceSynthesizer';
import useUzume from "./hooks/useUzume"
import VoiceLoader from './components/VoiceLoader';
import VoiceEditor from './components/VoiceEditor';
import { Segments } from './data/Segments';

type AppState = {
  waveform: uzumejs.Waveform;
  spectrogram: uzumejs.Spectrogram;
  msPerPixel: number;
  segments: Segments;
}

const App = () => {
  const [appState, setAppState] = useState<AppState>();
  const uzume = useUzume();

  const handleVoiceLoadStart = () => setAppState(undefined);
  const handleVoiceLoadEnd = async (waveform: uzumejs.Waveform) => {
    const u = await uzume;
    const previousState = appState;
    setAppState({
      waveform: waveform,
      spectrogram: new u.WaveformSpectrogram(waveform),
      msPerPixel: 4,
      segments: [ {
        msBegin: 0,
        msEnd: waveform.msLength(),
        msLength: waveform.msLength(),
        f0ControlChange: [{position: 0, ratio: 0}, {position: 1, ratio: 0}]
      } ],
    });
    previousState?.waveform.delete();
    previousState?.spectrogram.delete();
  }
  const handleSegmentsChange = (segments: Segments) => {
    if(appState) setAppState({ ...appState, segments: segments });
  }
  return (
    <div className="App">
      <VoiceLoader onVoiceLoadStart={handleVoiceLoadStart} onVoiceLoadEnd={handleVoiceLoadEnd} />
      { appState && <VoiceSynthesizer segments={appState.segments} spectrogram={appState.spectrogram} mode={"play"} key="button-play"/> }
      { appState && <VoiceSynthesizer segments={appState.segments} spectrogram={appState.spectrogram} mode={"save"} key="button-save"/> }
      {
        appState &&
          <VoiceEditor waveform={appState.waveform} msPerPixel={2} segments={appState.segments} onSegmentsChanged={handleSegmentsChange} key="editor"
          />
      }
    </div>
  );
}

export default App;
