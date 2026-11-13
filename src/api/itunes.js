// Small wrapper around the iTunes Search API
// Docs: https://performance-partners.apple.com/search-api

const BASE_URL = 'https://itunes.apple.com'

// what the user picks in the UI -> what the API calls it
export const SEARCH_TYPES = {
  albums: 'album',
  artists: 'musicArtist',
  songs: 'song',
}

async function getJson(path, params) {
  const query = new URLSearchParams(params).toString()
  const response = await fetch(`${BASE_URL}/${path}?${query}`)

  if (!response.ok) {
    throw new Error(`The music service answered with an error (${response.status}).`)
  }

  const data = await response.json()
  return data.results
}

export async function searchMusic(term, type = 'albums') {
  return getJson('search', {
    term,
    media: 'music',
    entity: SEARCH_TYPES[type] ?? SEARCH_TYPES.albums,
    limit: 24,
  })
}

// The lookup endpoint returns the album itself first and then its songs
export async function getAlbum(albumId) {
  const results = await getJson('lookup', { id: albumId, entity: 'song', limit: 200 })
  const album = results.find((item) => item.wrapperType === 'collection')

  if (!album) {
    throw new Error('Could not find that album.')
  }

  const tracks = results
    .filter((item) => item.wrapperType === 'track')
    .sort((a, b) => a.discNumber - b.discNumber || a.trackNumber - b.trackNumber)

  return { album, tracks }
}

export async function getArtist(artistId) {
  const results = await getJson('lookup', { id: artistId, entity: 'album', limit: 100 })
  const artist = results.find((item) => item.wrapperType === 'artist')

  if (!artist) {
    throw new Error('Could not find that artist.')
  }

  const albums = results.filter((item) => item.wrapperType === 'collection')
  return { artist, albums }
}

// The API only gives a 100px cover, but the same url works with bigger sizes
export function artwork(url, size = 400) {
  if (!url) return ''
  return url.replace('100x100bb', `${size}x${size}bb`)
}

export function formatDuration(ms) {
  if (!ms) return ''
  const totalSeconds = Math.round(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

export function releaseYear(dateString) {
  return dateString ? new Date(dateString).getFullYear() : ''
}
