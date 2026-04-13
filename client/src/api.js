export async function getRecommendations(payload) {
  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong — please try again.')
  }
  return data
}
