import { memo } from 'react'

function DetectionControlsInner({
  isStreaming,
  webcamReady,
  confidence,
  setConfidence,
  fpsLimit,
  setFpsLimit,
  onStart,
  onStop,
}) {
  const canStart = webcamReady && !isStreaming
  return (
    <div className="bg-card-dark rounded-xl p-4 border border-border-dark flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2 px-2">
        <h3 className="font-bold text-lg">Detection Controls</h3>
        <div className="flex gap-2">
          <button
            onClick={onStart}
            disabled={!canStart}
            className={`flex items-center justify-center rounded-lg h-9 px-4 text-sm font-bold transition-opacity ${
              !canStart
                ? 'bg-primary/40 text-background-dark/60 cursor-not-allowed'
                : 'bg-primary text-background-dark hover:bg-primary/90'
            }`}
          >
            <span className="material-symbols-outlined mr-2 text-sm">play_arrow</span>
            Start Stream
          </button>
          <button
            onClick={onStop}
            disabled={!isStreaming}
            className={`flex items-center justify-center rounded-lg h-9 px-4 text-sm font-bold transition-opacity ${
              !isStreaming
                ? 'bg-border-dark text-white/40 cursor-not-allowed'
                : 'bg-border-dark text-white hover:bg-border-dark/80'
            }`}
          >
            <span className="material-symbols-outlined mr-2 text-sm">stop</span>
            Stop
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2 p-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Confidence Threshold</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={confidence}
              onChange={(e) => setConfidence(parseFloat(e.target.value))}
              className="flex-1"
            />
            <p className="text-sm font-bold text-primary w-10 text-right">
              {confidence.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">FPS Limit</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={fpsLimit}
              onChange={(e) => setFpsLimit(parseInt(e.target.value, 10))}
              className="flex-1"
            />
            <p className="text-sm font-bold text-primary w-10 text-right">
              {fpsLimit}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const DetectionControls = memo(DetectionControlsInner)
