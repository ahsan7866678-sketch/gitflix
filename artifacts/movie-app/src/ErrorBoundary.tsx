import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#141414] text-white">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-3xl font-bold text-[#e50914] mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">{this.state.error?.message ?? "An unexpected error occurred."}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#e50914] hover:bg-[#c4070f] text-white px-6 py-2 rounded font-semibold transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
