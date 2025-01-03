'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'

export default function DummyLobbies() {
  const router = useRouter()
  const [savedQuizzes, setSavedQuizzes] = useState<string[]>([])

  useEffect(() => {
    const quizzes = Object.keys(localStorage).filter(key => key.startsWith('saved_quiz_'))
    setSavedQuizzes(quizzes.map(key => key.replace('saved_quiz_', '')))
  }, [])

  const joinLobby = (quizName: string) => {
    router.push(`/lobby?quizId=${encodeURIComponent(quizName)}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-8">
        <Link href="/" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out">
          <ArrowLeft className="w-6 h-6 text-pink-500" />
        </Link>
        <h1 className="text-3xl font-bold text-pink-700 ml-4">Dummy Lobbies</h1>
      </div>

      {savedQuizzes.length > 0 ? (
        <div className="space-y-4">
          {savedQuizzes.map((quizName) => (
            <div key={quizName} className="card">
              <h2 className="text-xl font-bold text-pink-700 mb-4">{quizName}</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-pink-500 mr-2" />
                  <span className="text-lg text-pink-700">{Math.floor(Math.random() * 10) + 1} Participants</span>
                </div>
                <button 
                  onClick={() => joinLobby(quizName)} 
                  className="btn-primary"
                >
                  Join Lobby
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-pink-700">No saved quizzes found. Create a quiz first!</p>
      )}
    </div>
  )
}

