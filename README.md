# Music Explorer

A small React app for searching music and saving the stuff you like. You can search for albums, artists and songs, open an album to see its track list, listen to 30 second previews and keep a list of favourites.

Final project for the web development course.

**Live demo:** https://paskywhyte.github.io/music-explorer/

## Features

- **Search** (`/`) – search albums, artists or songs. The search term is stored in the URL so the back button and shared links work.
- **Album page** (`/album/:id`) – cover, info, full track list and 30 second audio previews.
- **Artist page** (`/artist/:id`) – the artist's discography, with sorting and a filter to hide singles and EPs.
- **Favourites** (`/favourites`) – saved albums and songs, a genre filter and a small "taste by genre" breakdown. Favourites are kept in localStorage so they are still there after a refresh.

## Tech

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) for navigation between the screens (HashRouter, because GitHub Pages doesn't support client side routes)
- [Bootstrap](https://getbootstrap.com/) and [React Bootstrap](https://react-bootstrap.github.io/) for layout and components
- [React Icons](https://react-icons.github.io/react-icons/) for icons
- [React Hot Toast](https://react-hot-toast.com/) for the small notifications
- [iTunes Search API](https://performance-partners.apple.com/search-api) for the music data (free, no API key needed)

The API calls are in `src/api/itunes.js` and use `fetch` with `async/await`.

## Running the project

You need [Node.js](https://nodejs.org/) 20 or newer.

```bash
# 1. clone the repository
git clone https://github.com/paskywhyte/music-explorer.git
cd music-explorer

# 2. install dependencies
npm install

# 3. start the development server
npm run dev
```

Then open the address shown in the terminal (usually http://localhost:5173).

Other commands:

```bash
npm run build     # production build into dist/
npm run preview   # preview the production build locally
npm run lint      # run the linter
npm run deploy    # build and publish dist/ to the gh-pages branch
```

## Deploying to GitHub Pages

```bash
npm run deploy
```

This builds the app and pushes the `dist` folder to a `gh-pages` branch. After the first deploy, go to the repository **Settings → Pages** and choose the `gh-pages` branch as the source. The site will be at `https://paskywhyte.github.io/music-explorer/`.

## Project structure

```
src/
  api/itunes.js          API calls and small helpers
  hooks/useAsync.js      loading / error / data state for API calls
  context/               favourites (localStorage) and the audio preview player
  components/            NavBar, AlbumCard, TrackRow, loader / error / empty states
  pages/                 SearchPage, AlbumPage, ArtistPage, FavouritesPage, NotFoundPage
  App.jsx                routes
```

## Notes

- Previews are 30 second clips provided by the API. Some songs don't have one, in that case the play button is disabled.
- The iTunes API has a rate limit (about 20 requests per minute), so very fast repeated searches can fail for a moment. The app shows an error with a "Try again" button when that happens.
