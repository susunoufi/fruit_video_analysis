import { memo } from 'react'

function FooterInner({ processingTime, connectionStatus }) {
  return (
    <footer className="bg-background-dark border-t border-border-dark px-10 py-2 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm opacity-60">memory</span>
          <span className="text-[10px] font-mono opacity-60 uppercase">
            YOLOv8n (CPU)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm opacity-60">speed</span>
          <span className="text-[10px] font-mono opacity-60 uppercase">
            Inference: {processingTime.toFixed(1)}ms
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono opacity-60 uppercase">
          {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
        </span>
        <div
          className={`size-1.5 rounded-full ${
            connectionStatus === 'connected' ? 'bg-primary' : 'bg-red-500'
          }`}
        />
      </div>
    </footer>
  )
}

export const Footer = memo(FooterInner)
