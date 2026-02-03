const API_BASE = '/api'

export async function fetchNutrition(fruitName) {
  const response = await fetch(`${API_BASE}/nutrition/${encodeURIComponent(fruitName)}`)
  if (!response.ok) {
    throw new Error(`Nutrition fetch failed: ${response.status}`)
  }
  const data = await response.json()
  return data.data
}

export async function fetchBulkNutrition(fruitNames) {
  if (!fruitNames.length) return {}
  const query = fruitNames.map(encodeURIComponent).join(',')
  const response = await fetch(`${API_BASE}/nutrition/bulk?fruits=${query}`)
  if (!response.ok) {
    throw new Error(`Bulk nutrition fetch failed: ${response.status}`)
  }
  const data = await response.json()
  return data.data
}

export async function sendChatMessage(message, detectedFruits, history, signal) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      detected_fruits: detectedFruits,
      history,
    }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.status}`)
  }

  return response
}
