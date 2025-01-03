import { Suspense } from 'react'
import HostLobbyContent from './HostLobbyContent'

export default function HostLobby() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading lobby...</div>}>
      <HostLobbyContent />
    </Suspense>
  )
}

