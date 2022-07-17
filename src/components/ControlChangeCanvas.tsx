import React, { useEffect, useRef } from "react"

type ControlChangeCanvasProps = {
  width: number;
  height: number;
}

const ControlChangeCanvas: React.FC<ControlChangeCanvasProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCanvas = useEffect(() => {
    if(canvasRef.current === null) return;
  })
  return <canvas ref={canvasRef} width={props.width} height={props.height}/>
}
