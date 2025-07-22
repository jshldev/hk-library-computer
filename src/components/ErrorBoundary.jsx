// src/components/ErrorBoundary.jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>發生錯誤</h2>
          <p>{this.state.error?.message || "無法顯示內容，請稍後再試。"}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
