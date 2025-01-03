'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, Home, Edit2 } from 'lucide-react'
import Link from 'next/link'
import { QuizData } from '../types/quiz'

interface ParticipantResult {
  name: string;
  score: number;
  answers: string[];
}

export default function HostResults() {
  const router = useRouter()
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [results, setResults] = useState<ParticipantResult[]>([])

  useEffect(() => {
    const storedQuiz = localStorage.getItem('currentQuiz')
    const storedParticipants = localStorage.getItem('quizParticipants')
    if (storedQuiz && storedParticipants) {
      const quiz = JSON.parse(storedQuiz)
      setQuizData(quiz)
      const participants = JSON.parse(storedParticipants)
      
      // Simulating results (replace with actual backend logic)
      const simulatedResults = participants.map((name: string) => ({
        name,
        score: Math.floor(Math.random() * (quiz.questions.length + 1)),
        answers: quiz.questions.map(() => String.fromCharCode(65 + Math.floor(Math.random() * 4)))
      }))
      setResults(simulatedResults)
    }
  }, [])

  const updateScore = (index: number, newScore: number) => {
    setResults(prev => {
      const updated = [...prev]
      updated[index].score = newScore
      return updated
    })
  }

  const downloadResults = () => {
    if (quizData && results.length > 0) {
      let resultsText = `Quiz Results:

`
      results.forEach((result, index) => {
        resultsText += `Participant: ${result.name}
Score: ${result.score}/${quizData.questions.length}
Answers: ${result.answers.join(', ')}

`
      })

      const blob = new Blob([resultsText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'quiz_results.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (!quizData || results.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-8">
        <Link href="/host-quiz" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out">
          <ArrowLeft className="w-6 h-6 text-pink-500" />
        </Link>
        <h1 className="text-3xl font-bold text-pink-700 ml-4">Quiz Results</h1>
      </div>

      <div className="space-y-8 mb-8">
        {results.map((result, index) => (
          <div key={index} className="card">
            <h2 className="text-2xl font-bold text-pink-700 mb-4">{result.name}</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-pink-700">Score:</span>
              <div className="flex items-center">
                <input
                  type="number"
                  value={result.score}
                  onChange={(e) => updateScore(index, parseInt(e.target.value))}
                  className="w-16 text-right input mr-2"
                  min="0"
                  max={quizData.questions.length}
                />
                <span className="text-lg text-pink-700">/ {quizData.questions.length}</span>
                <button className="ml-2 p-2 bg-pink-100 rounded-full hover:bg-pink-200 transition-colors">
                  <Edit2 className="w-5 h-5 text-pink-500" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {result.answers.map((answer, qIndex) => (
                <div key={qIndex} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Question {qIndex + 1}:</span>
                  <span className={`text-sm font-medium ${answer === quizData.questions[qIndex].correct_answer ? 'text-green-500' : 'text-red-500'}`}>
                    {answer}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <button 
          onClick={downloadResults}
          className="btn-primary w-full flex items-center justify-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Results
        </button>
        
        <Link 
          href="/"
          className="btn-secondary w-full flex items-center justify-center"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

