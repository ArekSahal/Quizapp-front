'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Play, Users } from 'lucide-react'
import Link from 'next/link'
import { QuizData } from '../types/quiz'

export default function Lobby() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quizId = searchParams.get('quizId')
  const [isHost, setIsHost] = useState(false)
  const [lobbyCode, setLobbyCode] = useState('')
  const [participants, setParticipants] = useState<string[]>([])
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [timeLimit, setTimeLimit] = useState(30)
  const [username, setUsername] = useState('')
  const [hasJoined, setHasJoined] = useState(false)

  useEffect(() => {
    if (quizId) {
      const storedQuiz = localStorage.getItem(`saved_quiz_${quizId}`)
      if (storedQuiz) {
        setQuizData(JSON.parse(storedQuiz))
        setIsHost(false) // Set to false for dummy lobbies
      }
    }
    setLobbyCode(Math.random().toString(36).substring(2, 8).toUpperCase())
  }, [quizId])

  useEffect(() => {
    const interval = setInterval(() => {
      if (participants.length < 10) {
        setParticipants(prev => [...prev, `Participant ${prev.length + 1}`])
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const startQuiz = () => {
    if (quizData) {
      localStorage.setItem('currentQuiz', JSON.stringify({ ...quizData, timeLimit }))
      router.push('/quiz')
    }
  }

  const joinLobby = () => {
    if (username.trim()) {
      setParticipants(prev => [...prev, username])
      setHasJoined(true)
      localStorage.setItem('quizUsername', username)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-8">
        <Link href={isHost ? "/create-quiz" : "/dummy-lobbies"} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out">
          <ArrowLeft className="w-6 h-6 text-pink-500" />
        </Link>
        <h1 className="text-3xl font-bold text-pink-700 ml-4">Quiz Lobby</h1>
      </div>

      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium text-pink-700">Lobby Code</span>
          <span className="text-3xl font-bold text-pink-500">{lobbyCode}</span>
        </div>
        <div className="h-px bg-pink-100 my-6" />
        <div className="flex items-center">
          <Users className="w-6 h-6 text-pink-500 mr-3" />
          <span className="text-lg text-pink-700">{participants.length} Participants</span>
        </div>
      </div>

      {!isHost && !hasJoined && (
        <div className="card mb-8">
          <label htmlFor="username" className="block text-sm font-medium text-pink-700 mb-2">Enter your username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input mb-4"
            placeholder="Your username"
          />
          <button 
            onClick={joinLobby}
            className="btn-primary w-full"
            disabled={!username.trim()}
          >
            Join Lobby
          </button>
        </div>
      )}

      {(isHost || hasJoined) && (
        <>
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-pink-700 mb-6">Participants</h2>
            <div className="space-y-4">
              {participants.map((participant, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-4 bg-pink-50 rounded-2xl transition-all duration-300 ease-in-out hover:bg-pink-100"
                >
                  <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-medium text-pink-700">
                      {participant.charAt(0)}
                    </span>
                  </div>
                  <span className="text-lg text-pink-700">{participant}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card mb-8">
            <label htmlFor="timeLimit" className="block text-sm font-medium text-pink-700 mb-2">Time Limit (seconds, 0 for no limit)</label>
            <input
              type="number"
              id="timeLimit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value, 10))}
              className="input mb-4"
              min="0"
            />
          </div>

          <button 
            onClick={startQuiz} 
            className="btn-primary w-full flex items-center justify-center"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Quiz
          </button>
        </>
      )}
    </div>
  )
}

