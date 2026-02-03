import { memo, useState } from 'react'
import Webcam from 'react-webcam'

const VIDEO_CONSTRAINTS = {
  width: 640,
  height: 480,
  facingMode: 'user',
}

function WebcamFeedInner({ webcamRef, isStreaming, detectionResult, onWebcamReady }) {
  const [error, setError] = useState(null)
  const [cameraReady, setCameraReady] = useState(false)
  const annotatedFrame = detectionResult?.annotated_frame

  const handleUserMedia = () => {
    setCameraReady(true)
    setError(null)
    if (onWebcamReady) onWebcamReady()
  }

  const handleUserMediaError = (err) => {
    setCameraReady(false)
    setError(
      err?.name === 'NotAllowedError'
        ? 'Camera permission denied. Please allow camera access in your browser settings.'
        : err?.name === 'NotFoundError'
          ? 'No camera found. Please connect a camera and refresh.'
          : `Camera error: ${err?.message || 'Unknown error'}`
    )
  }

  return (
    <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video border border-border-dark group">
      {/* Webcam always mounted and visible to keep stream alive for getScreenshot() */}
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        screenshotQuality={0.7}
        videoConstraints={VIDEO_CONSTRAINTS}
        onUserMedia={handleUserMedia}
        onUserMediaError={handleUserMediaError}
        className="w-full h-full object-cover"
      />

      {/* Annotated frame layered on top when streaming - webcam stays mounted underneath */}
      {isStreaming && annotatedFrame && (
        <img
          src={`data:image/jpeg;base64,${annotatedFrame}`}
          alt="Detection feed"
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center px-6">
            <span className="material-symbols-outlined text-red-500 text-4xl mb-2 block">
              videocam_off
            </span>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {!cameraReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="text-center">
            <span className="material-symbols-outlined text-primary text-4xl mb-2 block animate-pulse">
              videocam
            </span>
            <p className="text-sm text-white/60">Initializing camera...</p>
          </div>
        </div>
      )}

      {/* Status badges */}
      {isStreaming && (
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md flex items-center gap-2 border border-white/10">
          <div className="size-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-white tracking-widest uppercase">
            Live Detection
          </span>
        </div>
      )}

      {!isStreaming && cameraReady && (
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
