import { Heart } from 'lucide-react'

export default function DonateButton() {
  return (
    <button className="fixed bottom-4 right-4 bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 z-10">
      <Heart className="w-6 h-6" />
    </button>
  )
}

