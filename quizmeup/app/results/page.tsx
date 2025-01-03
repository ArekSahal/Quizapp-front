'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, Home, Trophy, Check, X } from 'lucide-react'
import Link from 'next/link'
import { QuizData } from '../types/quiz'

interface QuizResults {
  score: number;
  totalQuestions: number;
  responses: {[key: number]: { answer: string, isCorrect: boolean }};
}

export default function Results() {
  const router = useRouter()
  const [results, setResults] = useState<QuizResults | null>(null)
  const [quizData, setQuizData] = useState<QuizData | null>(null)

  useEffect(() => {
    const storedResults = localStorage.getItem('quizResults')
    const storedQuiz = localStorage.getItem('currentQuiz')
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    }
    if (storedQuiz) {
      setQuizData(JSON.parse(storedQuiz))
    } else {
      router.push('/create-quiz')
    }
  }, [router])

  const downloadResults = () => {
    if (results && quizData) {
      let resultsText = `Quiz Results:
Score: ${results.score}/${results.totalQuestions}
Percentage: ${((results.score / results.totalQuestions) * 100).toFixed(2)}%

Questions and Answers:
`
      quizData.questions.forEach((question, index) => {
        resultsText += `
${index + 1}. ${question.question}
Correct Answer: ${question.choices[question.correct_answer.charCodeAt(0) - 65]}
Explanation: ${question.explanation}
Source: ${question.source_link}

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

  if (!results || !quizData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-8">
        <Link href="/" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out">
          <ArrowLeft className="w-6 h-6 text-pink-500" />
        </Link>
        <h1 className="text-3xl font-bold text-pink-700 ml-4">Quiz Results</h1>
      </div>

      <div className="card mb-8">
        <div className="flex items-center justify-center mb-8">
          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-pink-500" />
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-pink-700 mb-4">Your Score</h2>
          <p className="text-5xl font-bold text-pink-500 mb-2">{results.score}/{results.totalQuestions}</p>
          <p className="text-xl text-pink-700">
            {((results.score / results.totalQuestions) * 100).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="space-y-8 mb-8">
        <h3 className="text-2xl font-bold text-pink-700">Question Review</h3>
        {quizData.questions.map((question, index) => (
          <div key={index} className="card">
            <h4 className="text-lg font-semibold text-pink-700 mb-4">{index + 1}. {question.question}</h4>
            <ul className="space-y-2 mb-4">
              {question.choices.map((choice, choiceIndex) => {
                const choiceLetter = String.fromCharCode(65 + choiceIndex);
                const isCorrect = choiceLetter === question.correct_answer;
                const isUserChoice = results.responses[index]?.answer === choiceLetter;
                return (
                  <li key={choiceIndex} className="flex items-center">
                    {isCorrect ? (
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                    ) : isUserChoice ? (
                      <X className="w-5 h-5 text-red-500 mr-2" />
                    ) : (
                      <span className="w-5 h-5 mr-2" />
                    )}
                    <span className={`${isCorrect ? "font-semibold" : ""} ${isUserChoice ? "underline" : ""}`}>
                      {choice}
                    </span>
                    {isUserChoice && <span className="ml-2 text-sm text-pink-500">(Your answer)</span>}
                  </li>
                );
              })}
            </ul>
            <p className="text-sm text-gray-600 mb-2">{question.explanation}</p>
            <a href={question.source_link} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-500 hover:underline">Source</a>
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

