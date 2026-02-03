import { memo } from 'react'
import Webcam from 'react-webcam'

const VIDEO_CONSTRAINTS = {
  width: 640,
  height: 480,
  facingMode: 'environment',
}

function WebcamFeedInner({ webcamRef, isStreaming, detectionResult }) {
  const annotatedFrame = detectionResult?.annotated_frame

  return (
    <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video border border-border-dark group">
      {isStreaming && annotatedFrame ? (
        <img
          src={`data:image/jpeg;base64,${annotatedFrame}`}
          alt="Detection feed"
          className="w-full h-full object-cover"
        />
      ) : (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.7}
          videoConstraints={VIDEO_CONSTRAINTS}
          className="w-full h-full object-cover"
        />
      )}

      {isStreaming && (
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md flex items-center gap-2 border border-white/10">
          <div className="size-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-white tracking-widest uppercase">
            Live Detection
          </span>
        </div>
      )}

      {!isStreaming && (
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md flex items-center gap-2 border border-white/10">
          <div className="size-2 bg-yellow-500 rounded-full" />
          <span className="text-xs font-mono text-white tracking-widest uppercase">
            Preview
          </span>
        </div>
      )}
    </div>
  )
}

export const WebcamFeed = memo(WebcamFeedInner)
