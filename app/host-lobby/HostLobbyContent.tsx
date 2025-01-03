'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Play, Users, Copy } from 'lucide-react'
import Link from 'next/link'
import { QuizData } from '@/app/types/quiz'

export default function HostLobbyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quizId = searchParams.get('quizId')
  const [lobbyCode, setLobbyCode] = useState('')
  const [participants, setParticipants] = useState<string[]>([])
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [timeLimit, setTimeLimit] = useState(30)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (quizId) {
      const storedQuiz = localStorage.getItem(`saved_quiz_${quizId}`)
      if (storedQuiz) {
        setQuizData(JSON.parse(storedQuiz))
        setTimeLimit(JSON.parse(storedQuiz).timeLimit)
      } else {
        router.push('/create-quiz')
      }
    }
    setLobbyCode(Math.random().toString(36).substring(2, 8).toUpperCase())
    setParticipants(['Participant 1', 'Participant 2', 'Participant 3', 'Participant 4', 'Participant 5'])
    setIsLoading(false)
  }, [quizId, router])

  const copyLobbyCode = () => {
    navigator.clipboard.writeText(lobbyCode)
    alert('Lobby code copied to clipboard!')
  }

  const startQuiz = () => {
    if (quizData) {
      localStorage.setItem('currentQuiz', JSON.stringify(quizData))
      localStorage.setItem('quizParticipants', JSON.stringify(participants))
      router.push('/host-quiz')
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading lobby...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-8">
        <Link href="/create-quiz" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out">
          <ArrowLeft className="w-6 h-6 text-pink-500" />
        </Link>
        <h1 className="text-3xl font-bold text-pink-700 ml-4">Host Lobby</h1>
      </div>

      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium text-pink-700">Lobby Code</span>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-pink-500 mr-2">{lobbyCode}</span>
            <button onClick={copyLobbyCode} className="p-2 bg-pink-100 rounded-full hover:bg-pink-200 transition-colors">
              <Copy className="w-5 h-5 text-pink-500" />
            </button>
          </div>
        </div>
        <div className="h-px bg-pink-100 my-6" />
        <div className="flex items-center">
          <Users className="w-6 h-6 text-pink-500 mr-3" />
          <span className="text-lg text-pink-700">{participants.length} Participants</span>
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-bold text-pink-700 mb-4">Participants</h2>
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

      <button 
        onClick={startQuiz} 
        className="btn-primary w-full flex items-center justify-center"
        disabled={participants.length === 0}
      >
        <Play className="w-5 h-5 mr-2" />
        Start Quiz
      </button>
    </div>
  )
}

