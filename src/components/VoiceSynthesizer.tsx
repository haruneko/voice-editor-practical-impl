import React, { useState } from "react"
import * as uzumejs from "uzumejs"
import audioBufferToWav from "audiobuffer-to-wav"
import useUzume from "../hooks/useUzume"

type Segment = {
  msBegin: number;
  msEnd: number;
  msLength: number;
}

type VoiceSynthesizerProps = {
  segments: Segment[];
  spectrogram: uzumejs.Spectrogram;
  mode: "play" | "save"
}

const calculateWaveArray = (u: uzumejs.UzumeJs, props: VoiceSynthesizerProps) => {
  const toBeDeleted = new Array<{delete: () => void}>();
  const ltams = props.segments.map(v => new u.LinearTimeAxisMap(v.msBegin, v.msEnd, v.msLength))
  const sss = ltams.map(v => new u.StretchedPartialSpectrogram(props.spectrogram, v));
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

const VocalSynthesizer: React.FC<VoiceSynthesizerProps> = (props) => {
  const [disabled, setDisabled] = useState(false);
  const uzume = useUzume();
  const context = new AudioContext();

  const handlePlayStart = async () => {
    if(!props || props.segments.length === 0) return;
    setDisabled(true);
    const u = await uzume;
    const buf = calculateWaveArray(u, props);
    if(context.state === "suspended") {
      context.resume();
    }
    const sourceNode = context.createBufferSource();
    sourceNode.buffer = new AudioBuffer({length: buf.length, sampleRate: 44100});
    sourceNode.buffer.copyToChannel(buf, 0);
    sourceNode.connect(context.destination);
    sourceNode.start();
    setDisabled(false);
  }
  const handleWaveSave = async () => {
    if(!props || props.segments.length === 0) return;
    setDisabled(true);
    const u = await uzume;
    const buf = calculateWaveArray(u, props);
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
    setDisabled(false);
  }
  return props.mode === "play" ?
      <input type="button" onClick={handlePlayStart} value="再生" disabled={disabled}/> :
      <input type="button" onClick={handleWaveSave} value="保存" disabled={disabled}/>;
}

export default VocalSynthesizer;