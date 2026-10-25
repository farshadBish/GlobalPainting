import { io } from 'socket.io-client'

export const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3000'

export const socket = io(SERVER_URL, { path: '/ws' })

// The whole saved canvas as an array of points
export async function fetchCanvas(signal) {
  const response = await fetch(SERVER_URL, { signal })
  if (!response.ok) throw new Error(`Loading the canvas failed: ${response.status}`)
  return response.json()
}
