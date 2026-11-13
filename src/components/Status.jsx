import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

export function Loader({ text = 'Loading...' }) {
  return (
    <div className="text-center py-5" role="status">
      <Spinner animation="border" className="loader-spinner" />
      <p className="text-secondary mt-3 mb-0">{text}</p>
    </div>
  )
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-3">
      <span className="me-auto">{message}</span>
      {onRetry && (
        <Button variant="outline-light" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Alert>
  )
}

export function EmptyState({ icon, title, children }) {
  return (
    <div className="empty-state text-center py-5">
      <div className="empty-icon mb-3">{icon}</div>
      <h2 className="h5">{title}</h2>
      <div className="text-secondary">{children}</div>
    </div>
  )
}
