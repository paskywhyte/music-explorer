import { FaHeart, FaPause, FaPlay, FaRegHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { artwork, formatDuration } from '../api/itunes.js'
import { useFavourites } from '../context/FavouritesContext.jsx'
import { usePlayer } from '../context/PlayerContext.jsx'

// number: show a track number (album page). Otherwise the cover is shown (search / favourites).
function TrackRow({ track, number }) {
  const { playingId, togglePreview } = usePlayer()
  const { isTrackSaved, toggleTrack } = useFavourites()
  const playing = playingId === track.trackId
  const saved = isTrackSaved(track.trackId)

  return (
    <li className={`track-row ${playing ? 'is-playing' : ''}`}>
      <button
        type="button"
        className="play-btn"
        onClick={() => togglePreview(track)}
        disabled={!track.previewUrl}
        aria-label={playing ? `Pause ${track.trackName}` : `Play preview of ${track.trackName}`}
        title={track.previewUrl ? 'Play 30 second preview' : 'No preview available'}
      >
        {playing ? <FaPause /> : <FaPlay />}
      </button>

      {number !== undefined ? (
        <span className="track-number">{number}</span>
      ) : (
        <img
          className="track-cover"
          src={artwork(track.artworkUrl100, 100)}
          alt=""
          loading="lazy"
        />
      )}

      <div className="track-info">
        <div className="track-name">{track.trackName}</div>
        {number === undefined && (
          <div className="small text-secondary text-truncate">
            {track.artistName}
            {track.collectionId && (
              <>
                {' · '}
                <Link to={`/album/${track.collectionId}`}>{track.collectionName}</Link>
              </>
            )}
          </div>
        )}
      </div>

      <span className="track-time small text-secondary">
        {formatDuration(track.trackTimeMillis)}
      </span>

      <button
        type="button"
        className={`heart-btn ${saved ? 'is-saved' : ''}`}
        onClick={() => toggleTrack(track)}
        aria-label={saved ? 'Remove song from favourites' : 'Save song to favourites'}
        aria-pressed={saved}
      >
        {saved ? <FaHeart /> : <FaRegHeart />}
      </button>
    </li>
  )
}

export default TrackRow
