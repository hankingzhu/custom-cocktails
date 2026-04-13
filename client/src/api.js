export async function getRecommendations(payload) {
  let res
  try {
    res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch {
    throw new Error('Something went wrong — please try again.')
  }
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong — please try again.')
  }
  return data
}
