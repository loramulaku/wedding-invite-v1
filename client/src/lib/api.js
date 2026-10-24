import axios from 'axios'

// In dev, Vite proxies /api to the Express server (see vite.config.js).
// In production set VITE_API_URL, e.g. https://api.example.com/api
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15000,
})

export const errorMessage = (err, fallback = 'Something went wrong. Please try again.') =>
  err?.response?.data?.errors?.join(', ') || err?.response?.data?.error || fallback
