'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Timer } from 'lucide-react'
import Link from 'next/link'
import { QuizData, QuizQuestion } from '../types/quiz'

export default function Quiz() {
  const router = useRouter()
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [responses, setResponses] = useState<{[key: number]: { answer: string, isCorrect: boolean }}>({})
  const [isHost, setIsHost] = useState(false)

  const calculateResults = useCallback(() => {
    if (!quizData) return { score: 0, totalQuestions: 0, responses: {} }
    
    const correctAnswers = Object.values(responses).filter(r => r.isCorrect).length;

    return {
      score: correctAnswers,
      totalQuestions: quizData.questions.length,
      responses
    }
  }, [quizData, responses]);

  const nextQuestion = useCallback(() => {
    if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setTimeLeft(quizData.timeLimit || 30)
    } else {
      const results = calculateResults()
      localStorage.setItem('quizResults', JSON.stringify(results))
      router.push('/results')
    }
  }, [quizData, currentQuestionIndex, calculateResults, router])

  useEffect(() => {
    const storedQuiz = localStorage.getItem('currentQuiz')
    if (storedQuiz) {
      const parsedQuiz = JSON.parse(storedQuiz)
      setQuizData(parsedQuiz)
      setTimeLeft(parsedQuiz.timeLimit || 30)
    } else {
      router.push('/create-quiz')
    }
  }, [router])

  useEffect(() => {
    if (quizData && quizData.timeLimit > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            nextQuestion()
            return quizData.timeLimit
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentQuestionIndex, quizData, nextQuestion])

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const answer = e.target.value;
    setResponses(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        answer,
        isCorrect: answer === currentQuestion.correct_answer
      }
    }))
  }


  if (!quizData) {
    return <div>Loading...</div>
  }

  const currentQuestion = quizData.questions[currentQuestionIndex]

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-8">
        <Link href="/create-quiz" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out">
          <ArrowLeft className="w-6 h-6 text-pink-500" />
        </Link>
        <h1 className="text-3xl font-bold text-pink-700 ml-4">Question {currentQuestionIndex + 1}</h1>
      </div>

      {quizData.timeLimit > 0 && (
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium text-pink-700">Time Remaining</span>
            <div className="flex items-center text-pink-500">
              <Timer className="w-6 h-6 mr-2" />
              <span className="text-2xl font-bold">{timeLeft}s</span>
            </div>
          </div>
          <div className="h-3 bg-pink-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-pink-500 rounded-full transition-all duration-1000 ease-linear" 
              style={{ width: `${(timeLeft / quizData.timeLimit) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-pink-700 mb-6">{currentQuestion.question}</h2>
        <div className="space-y-4">
          {currentQuestion.choices.map((choice, index) => (
            <label 
              key={index}
              className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ease-in-out ${
                responses[currentQuestionIndex]?.answer === String.fromCharCode(65 + index)
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-transparent bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={String.fromCharCode(65 + index)}
                checked={responses[currentQuestionIndex]?.answer === String.fromCharCode(65 + index)}
                onChange={handleAnswerChange}
                className="sr-only"
              />
              <span className="text-lg text-pink-700">{choice}</span>
            </label>
          ))}
        </div>
      </div>

      <button 
        onClick={nextQuestion}
        className="btn-primary w-full"
      >
        {currentQuestionIndex < quizData.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </button>
    </div>
  )
}

