import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import ToggleButton from 'react-bootstrap/ToggleButton'
import { FaChevronRight, FaHeadphones, FaSearch } from 'react-icons/fa'
import { Link, useSearchParams } from 'react-router-dom'
import { searchMusic } from '../api/itunes.js'
import AlbumCard from '../components/AlbumCard.jsx'
import { EmptyState, ErrorMessage, Loader } from '../components/Status.jsx'
import TrackRow from '../components/TrackRow.jsx'
import { useAsync } from '../hooks/useAsync.js'

const TYPES = ['albums', 'artists', 'songs']
const SUGGESTIONS = ['Daft Punk', 'Fela Kuti', 'Sibelius', 'Nightwish', 'Miles Davis', 'Afrobeats']

function SearchPage() {
  // the search lives in the url (?q=...&type=...) so the back button and shared links work
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const type = TYPES.includes(searchParams.get('type')) ? searchParams.get('type') : 'albums'

  const [input, setInput] = useState(query)
  useEffect(() => setInput(query), [query])

  const { data: results, loading, error, retry } = useAsync(
    async () => (query ? searchMusic(query, type) : null),
    [query, type],
  )

  function runSearch(term, nextType = type) {
    const trimmed = term.trim()
    if (!trimmed) return
    setSearchParams({ q: trimmed, type: nextType })
  }

  function handleSubmit(event) {
    event.preventDefault()
    runSearch(input)
  }

  function changeType(nextType) {
    if (query) {
      setSearchParams({ q: query, type: nextType })
    } else {
      setSearchParams({ type: nextType })
    }
  }

  return (
    <>
      <section className="hero text-center mb-4">
        <h1 className="display-6 fw-bold">Find your next favourite record</h1>
        <p className="text-secondary mb-4">
          Search millions of albums, artists and songs, and listen to 30 second previews.
        </p>

        <Form onSubmit={handleSubmit} className="search-form mx-auto" role="search">
          <InputGroup size="lg">
            <Form.Control
              type="search"
              placeholder="Artist, album or song..."
              aria-label="Search music"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" className="btn-accent" disabled={!input.trim()}>
              <FaSearch className="me-sm-2" />
              <span className="d-none d-sm-inline">Search</span>
            </Button>
          </InputGroup>
        </Form>

        <ButtonGroup className="mt-3" aria-label="What to search for">
          {TYPES.map((t) => (
            <ToggleButton
              key={t}
              id={`type-${t}`}
              type="radio"
              name="search-type"
              variant="outline-light"
              size="sm"
              value={t}
              checked={type === t}
              onChange={() => changeType(t)}
              className="text-capitalize"
            >
              {t}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </section>

      {!query && (
        <EmptyState icon={<FaHeadphones />} title="Not sure where to start?">
          <p>Try one of these:</p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {SUGGESTIONS.map((s) => (
              <Button key={s} variant="outline-secondary" size="sm" onClick={() => runSearch(s)}>
                {s}
              </Button>
            ))}
          </div>
        </EmptyState>
      )}

      {query && loading && <Loader text={`Searching for "${query}"...`} />}
      {query && error && <ErrorMessage message={error} onRetry={retry} />}

      {query && !loading && !error && results && (
        <section aria-live="polite">
          <h2 className="h5 mb-3">
            {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
          </h2>

          {results.length === 0 && (
            <p className="text-secondary">
              Nothing found. Check the spelling or try searching for {type === 'albums' ? 'artists' : 'albums'} instead.
            </p>
          )}

          {type === 'albums' && (
            <Row xs={2} md={3} lg={4} xl={6} className="g-3">
              {results.map((album) => (
                <Col key={album.collectionId}>
                  <AlbumCard album={album} />
                </Col>
              ))}
            </Row>
          )}

          {type === 'artists' && (
            <ListGroup className="artist-list">
              {results.map((artist) => (
                <ListGroup.Item
                  key={artist.artistId}
                  action
                  as={Link}
                  to={`/artist/${artist.artistId}`}
                  className="d-flex align-items-center"
                >
                  <div className="me-auto">
                    <div className="fw-semibold">{artist.artistName}</div>
                    <div className="small text-secondary">{artist.primaryGenreName}</div>
                  </div>
                  <FaChevronRight className="text-secondary" />
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {type === 'songs' && (
            <ul className="track-list">
              {results.map((track) => (
                <TrackRow key={track.trackId} track={track} />
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  )
}

export default SearchPage
