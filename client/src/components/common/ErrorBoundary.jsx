import { Component } from 'react'
import styles from './ErrorBoundary.module.css'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <svg width="40" height="40" viewBox="0 0 24 24"
              fill="none" stroke="var(--color-danger)"
              strokeWidth="1.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <circle cx="12" cy="16" r="0.5" fill="var(--color-danger)"/>
            </svg>
          </div>
          <h1 className={styles.title}>Something went wrong</h1>
          <p className={styles.msg}>
            An unexpected error occurred. Your data is safe.
          </p>
          {import.meta.env.DEV && (
            <pre className={styles.stack}>
              {this.state.error?.message}
            </pre>
          )}
          <div className={styles.actions}>
            <button
              className={styles.primaryBtn}
              onClick={this.handleReset}
            >
              Back to home
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      </div>
    )
  }
}
