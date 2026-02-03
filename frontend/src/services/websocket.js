const RECONNECT_BASE_DELAY = 1000
const RECONNECT_MAX_DELAY = 30000

export function createDetectionSocket({ onResult, onStatusChange }) {
  let ws = null
  let reconnectDelay = RECONNECT_BASE_DELAY
  let shouldReconnect = true

  function connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    ws = new WebSocket(`${protocol}//${window.location.host}/ws/detect`)

    ws.onopen = () => {
      onStatusChange('connected')
      reconnectDelay = RECONNECT_BASE_DELAY
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onResult(data)
      } catch {
        // ignore malformed messages
      }
    }

    ws.onclose = () => {
      onStatusChange('disconnected')
      if (shouldReconnect) {
        setTimeout(connect, reconnectDelay)
        reconnectDelay = Math.min(reconnectDelay * 2, RECONNECT_MAX_DELAY)
      }
    }

    ws.onerror = () => {
      ws.close()
    }
  }

  function sendFrame(frameBase64, confidence) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ frame: frameBase64, confidence }))
    }
  }

  function disconnect() {
    shouldReconnect = false
    ws?.close()
  }

  connect()
  return { sendFrame, disconnect }
}
