import Card from 'react-bootstrap/Card'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { artwork, releaseYear } from '../api/itunes.js'
import { useFavourites } from '../context/FavouritesContext.jsx'

function AlbumCard({ album, showArtist = true }) {
  const { isAlbumSaved, toggleAlbum } = useFavourites()
  const saved = isAlbumSaved(album.collectionId)

  return (
    <Card className="album-card h-100">
      <Link to={`/album/${album.collectionId}`} className="cover-link">
        <Card.Img
          variant="top"
          src={artwork(album.artworkUrl100, 400)}
          alt={`Cover of ${album.collectionName}`}
          loading="lazy"
        />
      </Link>
      <button
        type="button"
        className={`heart-btn heart-on-cover ${saved ? 'is-saved' : ''}`}
        onClick={() => toggleAlbum(album)}
        aria-label={saved ? 'Remove album from favourites' : 'Save album to favourites'}
        aria-pressed={saved}
      >
        {saved ? <FaHeart /> : <FaRegHeart />}
      </button>
      <Card.Body>
        <Card.Title className="h6 mb-1">
          <Link to={`/album/${album.collectionId}`} className="stretched-title">
            {album.collectionName}
          </Link>
        </Card.Title>
        <Card.Text className="small text-secondary mb-0">
          {showArtist && album.artistId && (
            <>
              <Link to={`/artist/${album.artistId}`}>{album.artistName}</Link>
              {' · '}
            </>
          )}
          {showArtist && !album.artistId && <>{album.artistName} · </>}
          {releaseYear(album.releaseDate)}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default AlbumCard
