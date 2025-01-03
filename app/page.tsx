'use client'
import { Plus, PenSquare, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

function createDummyQuiz() {
  const dummyQuiz = {
    topic: "General Knowledge",
    questions: [
      {
        question: "What is the capital of France?",
        choices: ["London", "Berlin", "Paris", "Madrid"],
        correct_answer: "C",
        explanation: "Paris is the capital and most populous city of France.",
        source_link: "https://en.wikipedia.org/wiki/Paris"
      },
      {
        question: "Which planet is known as the Red Planet?",
        choices: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct_answer: "B",
        explanation: "Mars is often called the Red Planet due to its reddish appearance.",
        source_link: "https://en.wikipedia.org/wiki/Mars"
      },
      {
        question: "Who painted the Mona Lisa?",
        choices: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correct_answer: "C",
        explanation: "The Mona Lisa was painted by Italian Renaissance artist Leonardo da Vinci.",
        source_link: "https://en.wikipedia.org/wiki/Mona_Lisa"
      }
    ],
    timeLimit: 30,
    gpt_calls_used: 0,
    embedding_calls_used: 0
  };

  localStorage.setItem('saved_quiz_DummyQuiz', JSON.stringify(dummyQuiz));
}

export default function Home() {
  useEffect(() => {
    createDummyQuiz();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg">
        <div className="w-20 h-20 border-4 border-pink-500 rounded-full flex items-center justify-center">
          <span className="text-pink-500 text-xl font-bold">QuizMeUp</span>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-12 text-center">
        QuizMeUp
      </h1>

      <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-12 w-full max-w-lg">
        <Link 
          href="/create-quiz"
          className="group flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:bg-pink-600 transition-all duration-300 ease-in-out transform group-hover:scale-110">
            <Plus className="w-10 h-10 text-white" />
          </div>
          <span className="text-pink-700 font-medium text-lg">Create Quiz</span>
        </Link>

        <Link 
          href="/join-quiz"
          className="group flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:bg-pink-600 transition-all duration-300 ease-in-out transform group-hover:scale-110">
            <PenSquare className="w-10 h-10 text-white" />
          </div>
          <span className="text-pink-700 font-medium text-lg">Join Quiz</span>
        </Link>

        <Link 
          href="/dummy-lobbies"
          className="group flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:bg-pink-600 transition-all duration-300 ease-in-out transform group-hover:scale-110">
            <Users className="w-10 h-10 text-white" />
          </div>
          <span className="text-pink-700 font-medium text-lg">Join Dummy Lobby</span>
        </Link>
      </div>
    </div>
  )
}

