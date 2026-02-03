import { useMemo } from 'react'
import { useWebcam } from './hooks/useWebcam'
import { useChat } from './hooks/useChat'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { WebcamFeed } from './components/WebcamFeed'
import { DetectionControls } from './components/DetectionControls'
import { ChatInterface } from './components/ChatInterface'
import { DetectedFruits } from './components/DetectedFruits'
import { NutritionPanel } from './components/NutritionPanel'

function App() {
  const {
    webcamRef,
    isStreaming,
    connectionStatus,
    detectionResult,
    confidence,
    setConfidence,
    fpsLimit,
    setFpsLimit,
    processingTime,
    webcamReady,
    onWebcamReady,
    startStreaming,
    stopStreaming,
  } = useWebcam()

  const detections = detectionResult?.detections || []

  const detectedFruits = useMemo(() => {
    return detections.map((d) => d.fruit_name)
  }, [detections])

  const uniqueFruits = useMemo(() => {
    return [...new Set(detectedFruits)]
  }, [detectedFruits])

  const { messages, isLoading, sendMessage } = useChat(uniqueFruits)

  return (
    <div className="min-h-screen flex flex-col bg-background-dark text-white">
      <Header connectionStatus={connectionStatus} />

      <main className="flex-1 flex overflow-hidden p-6 gap-6 max-w-[1600px] mx-auto w-full">
        <div className="flex-[2] flex flex-col gap-4 min-w-0">
          <WebcamFeed
            webcamRef={webcamRef}
            isStreaming={isStreaming}
            detectionResult={detectionResult}
            onWebcamReady={onWebcamReady}
          />

          <DetectionControls
            isStreaming={isStreaming}
            webcamReady={webcamReady}
            confidence={confidence}
            setConfidence={setConfidence}
            fpsLimit={fpsLimit}
            setFpsLimit={setFpsLimit}
            onStart={startStreaming}
            onStop={stopStreaming}
          />

          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
            detectedFruits={uniqueFruits}
          />
        </div>

        <aside className="w-[380px] flex flex-col gap-6">
          <DetectedFruits detections={detections} />
          <NutritionPanel detectedFruits={detectedFruits} />
        </aside>
      </main>

      <Footer
        processingTime={processingTime}
        connectionStatus={connectionStatus}
      />
    </div>
  )
}

export default App
