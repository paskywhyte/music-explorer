import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'music-explorer-favourites'
const FavouritesContext = createContext(null)

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return { albums: saved?.albums ?? [], tracks: saved?.tracks ?? [] }
  } catch {
    return { albums: [], tracks: [] }
  }
}

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState(loadSaved)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
    } catch {
      // storage can be blocked (private mode), the app still works without it
    }
  }, [favourites])

  const isAlbumSaved = (id) => favourites.albums.some((a) => a.collectionId === id)
  const isTrackSaved = (id) => favourites.tracks.some((t) => t.trackId === id)

  function toggleAlbum(album) {
    if (isAlbumSaved(album.collectionId)) {
      setFavourites((prev) => ({
        ...prev,
        albums: prev.albums.filter((a) => a.collectionId !== album.collectionId),
      }))
      toast('Album removed from favourites')
      return
    }
    // only keep the fields the app actually shows
    const saved = {
      collectionId: album.collectionId,
      collectionName: album.collectionName,
      artistId: album.artistId,
      artistName: album.artistName,
      artworkUrl100: album.artworkUrl100,
      primaryGenreName: album.primaryGenreName,
      releaseDate: album.releaseDate,
    }
    setFavourites((prev) => ({ ...prev, albums: [saved, ...prev.albums] }))
    toast.success('Album saved to favourites')
  }

  function toggleTrack(track) {
    if (isTrackSaved(track.trackId)) {
      setFavourites((prev) => ({
        ...prev,
        tracks: prev.tracks.filter((t) => t.trackId !== track.trackId),
      }))
      toast('Song removed from favourites')
      return
    }
    const saved = {
      trackId: track.trackId,
      trackName: track.trackName,
      artistId: track.artistId,
      artistName: track.artistName,
      collectionId: track.collectionId,
      collectionName: track.collectionName,
      artworkUrl100: track.artworkUrl100,
      previewUrl: track.previewUrl,
      trackTimeMillis: track.trackTimeMillis,
      primaryGenreName: track.primaryGenreName,
    }
    setFavourites((prev) => ({ ...prev, tracks: [saved, ...prev.tracks] }))
    toast.success('Song saved to favourites')
  }

  function clearAll() {
    setFavourites({ albums: [], tracks: [] })
    toast('Favourites cleared')
  }

  const value = {
    albums: favourites.albums,
    tracks: favourites.tracks,
    count: favourites.albums.length + favourites.tracks.length,
    isAlbumSaved,
    isTrackSaved,
    toggleAlbum,
    toggleTrack,
    clearAll,
  }

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>
}

export function useFavourites() {
  return useContext(FavouritesContext)
}
