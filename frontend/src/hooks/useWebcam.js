import { useRef, useState, useCallback, useEffect } from 'react'
import { createDetectionSocket } from '../services/websocket'

export function useWebcam() {
  const webcamRef = useRef(null)
  const socketRef = useRef(null)
  const waitingForResponse = useRef(false)
  const intervalRef = useRef(null)

  const [isStreaming, setIsStreaming] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [detectionResult, setDetectionResult] = useState(null)
  const [confidence, setConfidence] = useState(0.75)
  const [fpsLimit, setFpsLimit] = useState(15)
  const [processingTime, setProcessingTime] = useState(0)
  const [webcamReady, setWebcamReady] = useState(false)

  const onWebcamReady = useCallback(() => {
    setWebcamReady(true)
  }, [])

  const startStreaming = useCallback(() => {
    if (!webcamReady) return

    socketRef.current = createDetectionSocket({
      onResult: (data) => {
        setDetectionResult(data)
        setProcessingTime(data.processing_time_ms || 0)
        waitingForResponse.current = false
      },
      onStatusChange: setConnectionStatus,
    })
    setIsStreaming(true)
  }, [webcamReady])

  const stopStreaming = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    socketRef.current?.disconnect()
    socketRef.current = null
    setIsStreaming(false)
    setDetectionResult(null)
    setConnectionStatus('disconnected')
    waitingForResponse.current = false
  }, [])

  useEffect(() => {
    if (!isStreaming || !webcamReady) return

    const captureInterval = Math.round(1000 / fpsLimit)

    intervalRef.current = setInterval(() => {
      if (waitingForResponse.current) return

      const webcam = webcamRef.current
      if (!webcam || !webcam.video || webcam.video.readyState !== 4) return

      const screenshot = webcam.getScreenshot()
      if (screenshot && socketRef.current) {
        const base64 = screenshot.split(',')[1]
        if (base64) {
          socketRef.current.sendFrame(base64, confidence)
          waitingForResponse.current = true
        }
      }
    }, captureInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isStreaming, confidence, fpsLimit, webcamReady])

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
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
  }
}
