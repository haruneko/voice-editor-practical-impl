import React, { useState } from 'react';
import * as uzumejs from "uzumejs";
import VoiceSynthesizer from './components/VoiceSynthesizer';
import getUzume from "./getUzume"
import VoiceLoader from './components/VoiceLoader';
import VoiceEditor from './components/VoiceEditor';

type ControlPoint = {
  position: number;
  ratio: number;
}

type ControlPoints = ControlPoint[];

type Segment = {
  msBegin: number;
  msEnd: number;
  msLength: number;
  f0ControlPoints: ControlPoints;
  genControlPoints: ControlPoints;
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
        msLength: waveform.msLength(),
        f0ControlPoints: [{position: 0, ratio: 1}, {position: 1, ratio: 1}],
        genControlPoints: [{position: 0, ratio: 1}, {position: 1, ratio: 1}]
      } ]
    });
    previousState?.waveform.delete();
    previousState?.spectrogram.delete();
  }
  const handleSegmentsChange = (segments: Segment[]) => {
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
