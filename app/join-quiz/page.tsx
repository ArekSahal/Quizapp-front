'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function JoinQuiz() {
  const router = useRouter()
  const [lobbyCode, setLobbyCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleJoinQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Here you would typically check with your backend if the lobby exists
    // For this example, we'll simulate a check with a random condition
    const lobbyExists = Math.random() > 0.5

    if (lobbyExists) {
      // If the lobby exists, redirect to the lobby page
      router.push(`/lobby?code=${lobbyCode}`)
    } else {
      // If the lobby doesn't exist, show an error message
      setError('There is no such lobby. Please check the code and try again.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-8">
        <Link href="/" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out">
          <ArrowLeft className="w-6 h-6 text-pink-500" />
        </Link>
        <h1 className="text-3xl font-bold text-pink-700 ml-4">Join Quiz</h1>
      </div>

      <form onSubmit={handleJoinQuiz} className="space-y-6">
        <div className="card">
          <label htmlFor="lobbyCode" className="block text-sm font-medium text-pink-700 mb-2">
            Enter Lobby Code
          </label>
          <input
            type="text"
            id="lobbyCode"
            value={lobbyCode}
            onChange={(e) => setLobbyCode(e.target.value)}
            className="input"
            placeholder="Enter lobby code"
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Join Quiz
        </button>

        {error && (
          <div className="text-red-500 text-center mt-4">{error}</div>
        )}
      </form>
    </div>
  )
}

