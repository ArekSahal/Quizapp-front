import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-200 p-4 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <Link href="#" className="text-pink-600">Facebook</Link>
          <Link href="#" className="text-pink-600">Twitter</Link>
          <Link href="#" className="text-pink-600">Instagram</Link>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <Link href="/terms" className="text-sm text-gray-600 mb-2 md:mb-0">Terms of Service</Link>
          <Link href="/privacy" className="text-sm text-gray-600">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  )
}

