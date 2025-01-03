import { Suspense } from 'react'
import LobbyContent from './LobbyContent'

export default function Lobby() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading lobby...</div>}>
      <LobbyContent />
    </Suspense>
  )
}

