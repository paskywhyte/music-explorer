import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { FaRegHeart, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import AlbumCard from '../components/AlbumCard.jsx'
import { EmptyState } from '../components/Status.jsx'
import TrackRow from '../components/TrackRow.jsx'
import { useFavourites } from '../context/FavouritesContext.jsx'

// count how many saved items there are per genre, biggest first
function countGenres(items) {
  const counts = {}
  for (const item of items) {
    const genre = item.primaryGenreName ?? 'Unknown'
    counts[genre] = (counts[genre] ?? 0) + 1
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}

function FavouritesPage() {
  const { albums, tracks, count, clearAll } = useFavourites()
  const [genre, setGenre] = useState('all')
  const [showConfirm, setShowConfirm] = useState(false)

  if (count === 0) {
    return (
      <EmptyState icon={<FaRegHeart />} title="No favourites yet">
        <p>Tap the heart on any album or song to keep it here.</p>
        <Button as={Link} to="/" className="btn-accent">
          Search for music
        </Button>
      </EmptyState>
    )
  }

  const genres = countGenres([...albums, ...tracks])
  // if the selected genre disappears (last item removed), fall back to all
  const activeGenre = genres.some(([name]) => name === genre) ? genre : 'all'
  const matches = (item) => activeGenre === 'all' || (item.primaryGenreName ?? 'Unknown') === activeGenre
  const shownAlbums = albums.filter(matches)
  const shownTracks = tracks.filter(matches)

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
        <h1 className="h2 fw-bold mb-0 me-auto">Your favourites</h1>
        <Form.Select
          className="w-auto"
          aria-label="Filter by genre"
          value={activeGenre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="all">All genres</option>
          {genres.map(([name]) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Form.Select>
        <Button variant="outline-danger" onClick={() => setShowConfirm(true)}>
          <FaTrash className="me-2" />
          Clear all
        </Button>
      </div>

      <section className="genre-stats mb-4">
        <h2 className="h6 text-secondary text-uppercase mb-3">Your taste by genre</h2>
        {genres.slice(0, 5).map(([name, amount]) => (
          <div key={name} className="genre-stat">
            <span className="small">{name}</span>
            <ProgressBar now={(amount / count) * 100} aria-label={`${name}: ${amount} saved`} />
            <span className="small text-secondary">{amount}</span>
          </div>
        ))}
      </section>

      <Tabs defaultActiveKey={albums.length > 0 ? 'albums' : 'songs'} className="mb-3">
        <Tab eventKey="albums" title={`Albums (${shownAlbums.length})`}>
          {shownAlbums.length === 0 ? (
            <p className="text-secondary">No saved albums here.</p>
          ) : (
            <Row xs={2} md={3} lg={4} xl={6} className="g-3">
              {shownAlbums.map((album) => (
                <Col key={album.collectionId}>
                  <AlbumCard album={album} />
                </Col>
              ))}
            </Row>
          )}
        </Tab>
        <Tab eventKey="songs" title={`Songs (${shownTracks.length})`}>
          {shownTracks.length === 0 ? (
            <p className="text-secondary">No saved songs here.</p>
          ) : (
            <ul className="track-list">
              {shownTracks.map((track) => (
                <TrackRow key={track.trackId} track={track} />
              ))}
            </ul>
          )}
        </Tab>
      </Tabs>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5">Clear all favourites?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This removes {albums.length} albums and {tracks.length} songs. It can't be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              clearAll()
              setShowConfirm(false)
            }}
          >
            Clear all
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default FavouritesPage
