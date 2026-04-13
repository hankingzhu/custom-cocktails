import express from 'express'
import cors from 'cors'

export function createApp() {
  const app = express()
  app.use(cors())
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  return app
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const PORT = process.env.PORT || 3001
  createApp().listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
