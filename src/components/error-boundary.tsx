"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
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
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="size-12 rounded-xl bg-severity-critical-bg flex items-center justify-center mb-4">
            <AlertTriangle className="size-6 text-severity-critical" />
          </div>
          <h2 className="text-[16px] font-semibold text-navy mb-1">Something went wrong</h2>
          <p className="text-[13px] text-slate-light mb-4 max-w-sm">
            {this.state.error?.message || "An unexpected error occurred. Please try again."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="inline-flex h-9 items-center gap-2 px-4 rounded-lg bg-indigo text-white text-[13px] font-medium hover:bg-indigo-light transition-all"
          >
            <RefreshCw className="size-3.5" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
