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
  if (!res.ok) {
    let errorMessage = 'Something went wrong — please try again.'
    try {
      const data = await res.json()
      if (data.error) errorMessage = data.error
    } catch { /* non-JSON error body — use default */ }
    throw new Error(errorMessage)
  }
  const data = await res.json()
  return data
}
