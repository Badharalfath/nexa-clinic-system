import { Component } from 'react';
import Icon from './Icon';

/**
 * ErrorBoundary — catches render errors so the app never shows a
 * blank white page. Shows a friendly recovery card instead.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Terjadi kesalahan tak terduga' };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, message: '' });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-icon">
            <Icon name="cross" size={26} />
          </div>
          <h2>Oops, terjadi kesalahan</h2>
          <p>{this.state.message}</p>
          <button className="btn btn-primary" onClick={this.handleReload}>
            <Icon name="refresh" size={15} /> Muat Ulang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
