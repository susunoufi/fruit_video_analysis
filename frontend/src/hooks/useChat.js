import { useState, useCallback, useRef } from 'react'
import { sendChatMessage } from '../services/api'

export function useChat(detectedFruits) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef(null)

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return

    const userMessage = { role: 'user', content }
    const currentMessages = [...messages, userMessage]
    setMessages(currentMessages)
    setIsLoading(true)

    try {
      abortControllerRef.current = new AbortController()

      const response = await sendChatMessage(
        content,
        detectedFruits,
        messages,
        abortControllerRef.current.signal,
      )

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages([...currentMessages, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            if (data.startsWith('[ERROR]')) {
              assistantContent += 'An error occurred. Please try again.'
            } else {
              assistantContent += data
            }
            const updatedContent = assistantContent
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { role: 'assistant', content: updatedContent },
            ])
          }
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Sorry, an error occurred. Please try again.',
          },
        ])
      }
    } finally {
      setIsLoading(false)
    }
  }, [detectedFruits, messages, isLoading])

  const clearChat = useCallback(() => setMessages([]), [])

  return { messages, isLoading, sendMessage, clearChat }
}
