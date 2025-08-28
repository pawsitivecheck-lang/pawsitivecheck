import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "2rem",
          textAlign: "center",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5"
        }}>
          <h1 style={{ color: "#d32f2f", marginBottom: "1rem" }}>
            🐾 PawsitiveCheck - Error Recovery Mode
          </h1>
          <p style={{ color: "#666", marginBottom: "1rem" }}>
            The app encountered an error but has been caught safely.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Reload App
          </button>
          {this.state.error && (
            <details style={{ marginTop: "1rem", textAlign: "left" }}>
              <summary>Error Details</summary>
              <pre style={{ 
                background: "#fff", 
                padding: "1rem", 
                borderRadius: "4px",
                overflow: "auto",
                fontSize: "0.8rem"
              }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;