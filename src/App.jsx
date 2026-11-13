import Container from 'react-bootstrap/Container'
import { Toaster } from 'react-hot-toast'
import { HashRouter, Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import { FavouritesProvider } from './context/FavouritesContext.jsx'
import { PlayerProvider } from './context/PlayerContext.jsx'
import AlbumPage from './pages/AlbumPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import SearchPage from './pages/SearchPage.jsx'

// HashRouter is used because GitHub Pages can't redirect unknown paths back to index.html
function App() {
  return (
    <HashRouter>
      <FavouritesProvider>
        <PlayerProvider>
          <NavBar />
          <Container as="main" className="py-4">
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/album/:albumId" element={<AlbumPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Container>
          <footer className="text-center small text-secondary py-4">
            Music data from the iTunes Search API
          </footer>
          <Toaster
            position="bottom-center"
            toastOptions={{ style: { background: '#2a2340', color: '#fff' } }}
          />
        </PlayerProvider>
      </FavouritesProvider>
    </HashRouter>
  )
}

export default App
