import React, { useState } from "react"
import { Waveform } from "uzumejs"
import useUzume from "../hooks/useUzume"

type VoiceLoaderProps = {
  onVoiceLoadStart?: () => void;
  onVoiceLoadEnd?: (waveform: Waveform) => void;
}

const VoiceLoader: React.FC<VoiceLoaderProps> = (props) => {
  const [disabled, setDisabled] = useState(false);
  const uzume = useUzume();
  const context = new AudioContext();
  const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e?.target?.files?.item(0);
    if(file !== null && file !== undefined) {
      setDisabled(true);
      if(props.onVoiceLoadStart) props.onVoiceLoadStart();
      const buffer = await context.decodeAudioData(
        await file.arrayBuffer()
      );
      const u = await uzume;
      const maybeWaveform = u.CreateWaveformFrom(buffer.getChannelData(0), buffer.sampleRate);
      if(maybeWaveform !== null) {
        if(props.onVoiceLoadEnd) props.onVoiceLoadEnd(maybeWaveform);
      }
      setDisabled(false);
    }
  }
  return <input type="file" onChange={handleChangeFile} disabled={disabled}/>
}

export default VoiceLoader;
