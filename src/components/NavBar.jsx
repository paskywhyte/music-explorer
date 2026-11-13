import Badge from 'react-bootstrap/Badge'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { FaHeart, FaMusic, FaSearch } from 'react-icons/fa'
import { Link, NavLink } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext.jsx'

function NavBar() {
  const { count } = useFavourites()

  return (
    <Navbar expand="sm" sticky="top" className="app-navbar" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <FaMusic className="brand-icon me-2" />
          Music Explorer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end eventKey="search">
              <FaSearch className="me-1" /> Search
            </Nav.Link>
            <Nav.Link as={NavLink} to="/favourites" eventKey="favourites">
              <FaHeart className="me-1" /> Favourites
              {count > 0 && (
                <Badge pill bg="" className="count-badge ms-2">
                  {count}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
