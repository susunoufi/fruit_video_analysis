import { memo, useState, useRef, useEffect } from 'react'

function ChatInterfaceInner({ messages, isLoading, onSendMessage, detectedFruits }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSendMessage(input.trim())
    setInput('')
  }

  const fruitsContext = detectedFruits.length > 0
    ? detectedFruits.map((f) => `${f} (1)`).join(', ')
    : 'No fruits detected'

  return (
    <div className="flex-1 min-h-[300px] flex flex-col bg-card-dark rounded-xl border border-border-dark overflow-hidden shadow-lg">
      <div className="bg-border-dark/50 p-3 px-6 border-b border-border-dark flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">smart_toy</span>
          </div>
          <div>
            <p className="text-sm font-bold leading-none">AI Nutrition Expert</p>
            <span className="text-[10px] uppercase tracking-tighter text-primary/70">
              Powered by GPT-4
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          <span className="text-[11px] font-bold text-primary">
            Context: {fruitsContext}
          </span>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="size-8 rounded-full bg-border-dark flex-shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">smart_toy</span>
            </div>
            <div className="bg-border-dark p-3 rounded-xl rounded-tl-none">
              <p className="text-sm">
                Hello! I'm your AI nutrition expert. I can analyze the fruits detected by your camera and provide detailed nutritional information, health benefits, and dietary recommendations. Start the detection and ask me anything!
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 max-w-[80%] ${
              msg.role === 'user' ? 'self-end flex-row-reverse' : ''
            }`}
          >
            <div
              className={`size-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user'
                  ? 'bg-primary text-background-dark'
                  : 'bg-border-dark'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {msg.role === 'user' ? 'person' : 'smart_toy'}
              </span>
            </div>
            <div
              className={`p-3 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-primary/10 border border-primary/20 rounded-tr-none'
                  : 'bg-border-dark rounded-tl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="size-8 rounded-full bg-border-dark flex-shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">smart_toy</span>
            </div>
            <div className="bg-border-dark p-3 rounded-xl rounded-tl-none">
              <div className="flex gap-1">
                <div className="size-2 bg-primary/60 rounded-full animate-bounce" />
                <div className="size-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="size-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 bg-background-dark/30 border-t border-border-dark"
      >
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-border-dark border border-border-dark rounded-lg py-3 px-4 pr-12 focus:ring-primary focus:border-primary text-sm text-white placeholder:text-white/40 outline-none"
            placeholder="Ask your AI nutritionist..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1.5 size-8 bg-primary text-background-dark rounded-md flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export const ChatInterface = memo(ChatInterfaceInner)
