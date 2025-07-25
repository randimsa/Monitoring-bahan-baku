// src/LoginPage.js
import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)

    if (error) {
      alert('Gagal kirim email: ' + error.message)
    } else {
      alert('Cek email untuk login link.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Login Monitoring Bahan Baku</h1>
        <form onSubmit={handleLogin}>
          <label className="block text-gray-600 text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Mengirim...' : 'Kirim Link Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
