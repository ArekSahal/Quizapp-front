'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Loader2, X, Edit2, Check, Trash2, Save, FolderOpen, Play, Zap } from 'lucide-react'
import Link from 'next/link'
import { QuizData, QuizQuestion } from '../types/quiz'

export default function CreateQuiz() {
  const router = useRouter()
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [formData, setFormData] = useState({
    topic: '',
    numberOfQuestions: 5,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null)
  const [savedQuizzes, setSavedQuizzes] = useState<string[]>([])
  const [timeLimit, setTimeLimit] = useState(30) // Added timeLimit state

  useEffect(() => {
    const quizzes = Object.keys(localStorage).filter(key => key.startsWith('saved_quiz_'))
    setSavedQuizzes(quizzes.map(key => key.replace('saved_quiz_', '')))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['numberOfQuestions'].includes(name) ? parseInt(value, 10) : value
    }))
  }

  const generateQuiz = async (generateAll: boolean = false) => {
    setIsLoading(true);
    setError(null);
    
    const apiUrl = 'https://quizapp-production-571b.up.railway.app/generate_quiz';
    const payload = {
      topic: formData.topic,
      target_question_count: generateAll ? formData.numberOfQuestions : formData.numberOfQuestions - (quizData?.questions.length || 0),
      max_api_calls: 100,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status code: ${response.status}`);
      }

      const data: QuizData = await response.json();
      setQuizData(prev => {
        if (prev && !generateAll) {
          return {
            ...prev,
            questions: [...prev.questions, ...data.questions],
            gpt_calls_used: (prev.gpt_calls_used || 0) + (data.gpt_calls_used || 0),
            embedding_calls_used: (prev.embedding_calls_used || 0) + (data.embedding_calls_used || 0),
          }
        }
        return {
          ...data,
        };
      });
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
      console.error('Error details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addManualQuestion = () => {
    if (quizData) {
      const newQuestion: QuizQuestion = {
        question: '',
        choices: ['', '', '', ''],
        correct_answer: 'A',
        explanation: '',
        source_link: '',
      };
      setQuizData({
        ...quizData,
        questions: [...quizData.questions, newQuestion],
      });
      setEditingQuestion(quizData.questions.length);
    } else {
      setQuizData({
        topic: formData.topic,
        questions: [{
          question: '',
          choices: ['', '', '', ''],
          correct_answer: 'A',
          explanation: '',
          source_link: '',
        }],
        gpt_calls_used: 0,
        embedding_calls_used: 0,
        timeLimit: timeLimit, // Use the state variable for timeLimit
      });
      setEditingQuestion(0);
    }
  };

  const removeQuestion = (index: number) => {
    if (quizData) {
      const newQuestions = [...quizData.questions];
      newQuestions.splice(index, 1);
      setQuizData({ ...quizData, questions: newQuestions });
    }
  };

  const startEditingQuestion = (index: number) => {
    setEditingQuestion(index);
  };

  const handleEditQuestion = (index: number, field: keyof QuizQuestion, value: string) => {
    if (quizData) {
      const newQuestions = [...quizData.questions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      setQuizData({ ...quizData, questions: newQuestions });
    }
  };

  const handleEditChoice = (questionIndex: number, choiceIndex: number, value: string) => {
    if (quizData) {
      const newQuestions = [...quizData.questions];
      newQuestions[questionIndex].choices[choiceIndex] = value;
      setQuizData({ ...quizData, questions: newQuestions });
    }
  };

  const saveEditedQuestion = () => {
    setEditingQuestion(null);
  };

  const saveQuiz = () => {
    if (quizData) {
      const quizName = prompt('Enter a name for this quiz:');
      if (quizName) {
        localStorage.setItem(`saved_quiz_${quizName}`, JSON.stringify(quizData));
        setSavedQuizzes(prev => [...prev, quizName]);
      }
    }
  };

  const loadQuiz = (quizName: string) => {
    const savedQuiz = localStorage.getItem(`saved_quiz_${quizName}`);
    if (savedQuiz) {
      setQuizData(JSON.parse(savedQuiz));
    }
  };

  const saveAndContinue = () => {
    if (quizData) {
      const quizName = quizData.topic || 'Untitled Quiz'
      localStorage.setItem(`saved_quiz_${quizName}`, JSON.stringify(quizData))
      router.push(`/host-lobby?quizId=${encodeURIComponent(quizName)}`)
    }
  }

  const finishQuizAutomatically = () => {
    if (quizData && quizData.questions.length < formData.numberOfQuestions) {
      generateQuiz();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-8">
        <Link href="/" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out">
          <ArrowLeft className="w-6 h-6 text-pink-500" />
        </Link>
        <h1 className="text-3xl font-bold text-pink-700 ml-4">Create Quiz</h1>
      </div>

      <div className="space-y-6">
        <div className="card">
          <label htmlFor="topic" className="block text-sm font-medium text-pink-700 mb-2">Quiz Topic</label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
            className="input"
            placeholder="Enter quiz topic"
          />
        </div>

        <div className="card">
          <label htmlFor="numberOfQuestions" className="block text-sm font-medium text-pink-700 mb-2">Number of Questions</label>
          <input
            type="number"
            id="numberOfQuestions"
            name="numberOfQuestions"
            value={formData.numberOfQuestions}
            onChange={handleInputChange}
            className="input"
            min="1"
            max="20"
          />
        </div>


        <div className="flex space-x-4">
          <button 
            onClick={addManualQuestion} 
            className="btn-primary flex-1 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Question Manually
          </button>
          <button 
            onClick={() => generateQuiz(true)} 
            className="btn-secondary flex-1 flex items-center justify-center"
            disabled={isLoading || !formData.topic}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Zap className="w-5 h-5 mr-2" />
            )}
            Generate Entire Quiz
          </button>
        </div>

        {quizData && quizData.questions.length > 0 && quizData.questions.length < formData.numberOfQuestions && (
          <button 
            onClick={finishQuizAutomatically} 
            className="btn-secondary w-full flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 mr-2" />
            )}
            Generate Remaining Questions
          </button>
        )}

        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}

        {quizData && (
          <div className="flex space-x-4">
            <button onClick={saveQuiz} className="btn-secondary flex-1 flex items-center justify-center">
              <Save className="w-5 h-5 mr-2" />
              Save Quiz
            </button>
            <button onClick={() => setQuizData(null)} className="btn-secondary flex-1 flex items-center justify-center">
              <X className="w-5 h-5 mr-2" />
              Clear Quiz
            </button>
          </div>
        )}

        {savedQuizzes.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold text-pink-700 mb-4">Load Saved Quiz</h2>
            <div className="space-y-2">
              {savedQuizzes.map((quizName) => (
                <button
                  key={quizName}
                  onClick={() => loadQuiz(quizName)}
                  className="btn-secondary w-full flex items-center justify-between"
                >
                  <span>{quizName}</span>
                  <FolderOpen className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {quizData && quizData.questions.length > 0 && (
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-pink-700">Preview</h2>
          {quizData.questions.map((question, index) => (
            <div key={index} className="card">
              {editingQuestion === index ? (
                <>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleEditQuestion(index, 'question', e.target.value)}
                    className="input mb-4"
                    placeholder="Enter question"
                  />
                  <ul className="space-y-3 mb-4">
                    {question.choices.map((choice, choiceIndex) => (
                      <li key={choiceIndex} className="flex items-center">
                        <input
                          type="text"
                          value={choice}
                          onChange={(e) => handleEditChoice(index, choiceIndex, e.target.value)}
                          className="input mr-2"
                          placeholder={`Choice ${String.fromCharCode(65 + choiceIndex)}`}
                        />
                        <input
                          type="radio"
                          checked={String.fromCharCode(65 + choiceIndex) === question.correct_answer}
                          onChange={() => handleEditQuestion(index, 'correct_answer', String.fromCharCode(65 + choiceIndex))}
                          className="mr-2"
                          id={`correct_${index}_${choiceIndex}`}
                        />
                        <label htmlFor={`correct_${index}_${choiceIndex}`}>Correct</label>
                      </li>
                    ))}
                  </ul>
                  <textarea
                    value={question.explanation}
                    onChange={(e) => handleEditQuestion(index, 'explanation', e.target.value)}
                    className="input mb-4"
                    rows={3}
                    placeholder="Enter explanation"
                  />
                  <input
                    type="text"
                    value={question.source_link}
                    onChange={(e) => handleEditQuestion(index, 'source_link', e.target.value)}
                    className="input mb-4"
                    placeholder="Enter source link"
                  />
                  <button onClick={saveEditedQuestion} className="btn-primary">
                    <Check className="w-5 h-5 mr-2" />
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <p className="font-medium text-pink-700 mb-4">{question.question}</p>
                  <ul className="space-y-3 mb-4">
                    {question.choices.map((choice, choiceIndex) => (
                      <li key={choiceIndex} className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                          String.fromCharCode(65 + choiceIndex) === question.correct_answer
                            ? 'bg-pink-500 border-pink-500'
                            : 'border-pink-500'
                        }`}></div>
                        <span>{choice}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-600 mb-2">{question.explanation}</p>
                  <a href={question.source_link} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-500 hover:underline mb-4 inline-block">Source</a>
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => startEditingQuestion(index)} className="btn-secondary p-2">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => removeQuestion(index)} className="btn-secondary p-2">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          <button 
            onClick={saveAndContinue} 
            className="btn-primary w-full flex items-center justify-center"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Host Lobby
          </button>
        </div>
      )}
    </div>
  )
}

