import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FaArrowLeft, FaExternalLinkAlt, FaHeart, FaRegHeart } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { artwork, formatDuration, getAlbum, releaseYear } from '../api/itunes.js'
import { ErrorMessage, Loader } from '../components/Status.jsx'
import TrackRow from '../components/TrackRow.jsx'
import { useFavourites } from '../context/FavouritesContext.jsx'
import { useAsync } from '../hooks/useAsync.js'

function AlbumPage() {
  const { albumId } = useParams()
  const navigate = useNavigate()
  const { isAlbumSaved, toggleAlbum } = useFavourites()
  const { data, loading, error, retry } = useAsync(() => getAlbum(albumId), [albumId])

  if (loading) return <Loader text="Loading album..." />
  if (error) return <ErrorMessage message={error} onRetry={retry} />

  const { album, tracks } = data
  const saved = isAlbumSaved(album.collectionId)
  const totalTime = tracks.reduce((sum, t) => sum + (t.trackTimeMillis ?? 0), 0)

  return (
    <>
      <Button variant="link" className="back-link px-0 mb-3" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" />
        Back
      </Button>

      <Row className="g-4 align-items-end mb-4">
        <Col xs={12} sm={5} md={4} lg={3}>
          <img
            className="album-cover img-fluid"
            src={artwork(album.artworkUrl100, 600)}
            alt={`Cover of ${album.collectionName}`}
          />
        </Col>
        <Col>
          <Badge bg="" className="genre-badge mb-2">
            {album.primaryGenreName}
          </Badge>
          <h1 className="h2 fw-bold">{album.collectionName}</h1>
          <p className="lead mb-1">
            <Link to={`/artist/${album.artistId}`}>{album.artistName}</Link>
          </p>
          <p className="text-secondary">
            {releaseYear(album.releaseDate)} · {tracks.length} songs · {formatDuration(totalTime)} min
          </p>
          <div className="d-flex flex-wrap gap-2">
            <Button className={saved ? 'btn-accent' : ''} variant={saved ? '' : 'outline-light'} onClick={() => toggleAlbum(album)}>
              {saved ? <FaHeart className="me-2" /> : <FaRegHeart className="me-2" />}
              {saved ? 'Saved' : 'Save album'}
            </Button>
            <Button variant="outline-secondary" href={album.collectionViewUrl} target="_blank" rel="noreferrer">
              Open in Apple Music <FaExternalLinkAlt className="ms-2 small" />
            </Button>
          </div>
        </Col>
      </Row>

      <h2 className="h5 mb-3">Songs</h2>
      {tracks.length === 0 ? (
        <p className="text-secondary">No track list available for this album.</p>
      ) : (
        <ul className="track-list">
          {tracks.map((track) => (
            <TrackRow key={track.trackId} track={track} number={track.trackNumber} />
          ))}
        </ul>
      )}

      {album.copyright && <p className="small text-secondary mt-4">{album.copyright}</p>}
    </>
  )
}

export default AlbumPage
