import './globals.css'
import { Inter } from 'next/font/google'
import DonateButton from '@/components/DonateButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'QuizMeUp',
  description: 'Create and join interactive quizzes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FDF2F8" />
      </head>
      <body className={`${inter.className} bg-gradient-to-b from-pink-100 to-pink-200 min-h-screen`}>
        {children}
        <DonateButton />
      </body>
    </html>
  )
}

