import { useEffect, useState } from 'react'
import { subscribe } from '../serverWakeStore'
import './ServerWakeOverlay.css'

export function ServerWakeOverlay() {
  const [isWaking, setIsWaking] = useState(false)

  useEffect(() => {
    return subscribe(setIsWaking)
  }, [])

  if (!isWaking) return null

  return (
    <div className="server-wake-overlay" role="alert" aria-live="polite">
      <div className="server-wake-content">
        <div className="server-wake-spinner" aria-hidden="true" />
        <p className="server-wake-message">Waking server… please wait</p>
      </div>
    </div>
  )
}
