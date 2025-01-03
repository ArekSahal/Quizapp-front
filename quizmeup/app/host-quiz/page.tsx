'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Users } from 'lucide-react'
import Link from 'next/link'
import { QuizData, QuizQuestion } from '../types/quiz'

export default function HostQuiz() {
  const router = useRouter()
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [participants, setParticipants] = useState<string[]>([])
  const [answeredCount, setAnsweredCount] = useState(0)

  useEffect(() => {
    const storedQuiz = localStorage.getItem('currentQuiz')
    const storedParticipants = localStorage.getItem('quizParticipants')
    if (storedQuiz) {
      setQuizData(JSON.parse(storedQuiz))
    }
    if (storedParticipants) {
      setParticipants(JSON.parse(storedParticipants))
    }
  }, [])

  useEffect(() => {
    // Simulating participants answering (replace with actual backend logic)
    const interval = setInterval(() => {
      setAnsweredCount(prev => {
        const newCount = Math.min(prev + 1, participants.length)
        if (newCount === participants.length) {
          clearInterval(interval)
        }
        return newCount
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [participants.length])

  const nextQuestion = () => {
    if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setAnsweredCount(0)
    } else {
      router.push('/host-results')
    }
  }

  if (!quizData) {
    return <div>Loading...</div>
  }

  const currentQuestion = quizData.questions[currentQuestionIndex]

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-8">
        <Link href="/host-lobby" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out">
          <ArrowLeft className="w-6 h-6 text-pink-500" />
        </Link>
        <h1 className="text-3xl font-bold text-pink-700 ml-4">Question {currentQuestionIndex + 1}</h1>
      </div>

      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-medium text-pink-700">Participants Answered</span>
          <div className="flex items-center text-pink-500">
            <Users className="w-6 h-6 mr-2" />
            <span className="text-2xl font-bold">{answeredCount}/{participants.length}</span>
          </div>
        </div>
        <div className="h-3 bg-pink-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-pink-500 rounded-full transition-all duration-1000 ease-linear" 
            style={{ width: `${(answeredCount / participants.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-pink-700 mb-6">{currentQuestion.question}</h2>
        <div className="space-y-4">
          {currentQuestion.choices.map((choice, index) => (
            <div 
              key={index}
              className={`p-4 rounded-2xl ${
                String.fromCharCode(65 + index) === currentQuestion.correct_answer
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-gray-100'
              }`}
            >
              <span className="text-lg text-pink-700">{choice}</span>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={nextQuestion}
        className="btn-primary w-full flex items-center justify-center"
      >
        {currentQuestionIndex < quizData.questions.length - 1 ? (
          <>
            Next Question
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        ) : (
          'View Results'
        )}
      </button>
    </div>
  )
}

