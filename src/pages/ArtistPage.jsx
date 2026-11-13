import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { getArtist } from '../api/itunes.js'
import AlbumCard from '../components/AlbumCard.jsx'
import { ErrorMessage, Loader } from '../components/Status.jsx'
import { useAsync } from '../hooks/useAsync.js'

// iTunes marks singles and EPs in the title, e.g. "One More Time - Single"
const isSingleOrEp = (album) => / - (Single|EP)$/i.test(album.collectionName)

function ArtistPage() {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const [sortOrder, setSortOrder] = useState('newest')
  const [hideSingles, setHideSingles] = useState(true)
  const { data, loading, error, retry } = useAsync(() => getArtist(artistId), [artistId])

  if (loading) return <Loader text="Loading artist..." />
  if (error) return <ErrorMessage message={error} onRetry={retry} />

  const { artist, albums } = data

  const visibleAlbums = albums
    .filter((album) => !hideSingles || !isSingleOrEp(album))
    .sort((a, b) => {
      const diff = new Date(a.releaseDate) - new Date(b.releaseDate)
      return sortOrder === 'newest' ? -diff : diff
    })

  return (
    <>
      <Button variant="link" className="back-link px-0 mb-3" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" />
        Back
      </Button>

      <header className="mb-4">
        <h1 className="display-6 fw-bold mb-1">{artist.artistName}</h1>
        <p className="text-secondary mb-0">
          {artist.primaryGenreName} · {albums.length} releases
        </p>
      </header>

      <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
        <h2 className="h5 mb-0 me-auto">Discography</h2>
        <Form.Check
          type="switch"
          id="hide-singles"
          label="Hide singles and EPs"
          checked={hideSingles}
          onChange={(e) => setHideSingles(e.target.checked)}
        />
        <Form.Select
          size="sm"
          className="w-auto"
          aria-label="Sort albums"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </Form.Select>
      </div>

      {visibleAlbums.length === 0 ? (
        <p className="text-secondary">
          No albums to show.{' '}
          {hideSingles && albums.length > 0 && 'Turn off the filter to see singles and EPs.'}
        </p>
      ) : (
        <Row xs={2} md={3} lg={4} xl={6} className="g-3">
          {visibleAlbums.map((album) => (
            <Col key={album.collectionId}>
              <AlbumCard album={album} showArtist={false} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}

export default ArtistPage
