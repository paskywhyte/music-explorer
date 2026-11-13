import Button from 'react-bootstrap/Button'
import { FaCompactDisc } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/Status.jsx'

function NotFoundPage() {
  return (
    <EmptyState icon={<FaCompactDisc />} title="Page not found">
      <p>This page doesn't exist.</p>
      <Button as={Link} to="/" className="btn-accent">
        Back to search
      </Button>
    </EmptyState>
  )
}

export default NotFoundPage
