import { createContext, useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

// One shared audio element for the whole app, so two previews never play at once
const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const audioRef = useRef(null)
  const [playingId, setPlayingId] = useState(null)

  useEffect(() => {
    const audio = new Audio()
    audio.addEventListener('ended', () => setPlayingId(null))
    audioRef.current = audio
    return () => audio.pause()
  }, [])

  async function togglePreview(track) {
    const audio = audioRef.current
    if (!audio || !track.previewUrl) return

    if (playingId === track.trackId) {
      audio.pause()
      setPlayingId(null)
      return
    }

    try {
      audio.src = track.previewUrl
      setPlayingId(track.trackId)
      await audio.play()
    } catch {
      setPlayingId(null)
      toast.error('Could not play this preview')
    }
  }

  return (
    <PlayerContext.Provider value={{ playingId, togglePreview }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  return useContext(PlayerContext)
}
