import React, { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Landing from './pages/Landing';
import TOS from './pages/TOS';
import { soundFx } from './services/soundFx';
import { waterPhysics } from './services/waterPhysics';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Alphaxen Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#/';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col justify-center items-center px-6 py-16 relative overflow-hidden font-sans">
          <div className="bg-[#121522] border border-purple-500/30 p-10 sm:p-12 rounded-3xl max-w-lg w-full text-center space-y-6 shadow-2xl animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white uppercase tracking-tight font-syne">
                SESSION RECOVERED
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Alphaxen encountered an unexpected state. Click below to return to the foundry catalog.
              </p>
              {this.state.error && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 font-mono text-[10px] text-left overflow-x-auto max-h-32 custom-scrollbar">
                  <span className="font-bold block text-rose-300">Error: {this.state.error.message}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                <RefreshCw size={14} /> RELOAD FOUNDRY
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  useEffect(() => {
    soundFx.initGlobalListeners();
    waterPhysics.init();
  }, []);

  return (
    <GlobalErrorBoundary>
      <HashRouter>
        <Routes>
          {/* Core Alphaxen Type Foundry */}
          <Route path="/" element={<Landing />} />
          <Route path="/catalog" element={<Landing />} />
          <Route path="/shop" element={<Landing />} />
          <Route path="/fonts" element={<Landing />} />
          <Route path="/marketplace" element={<Landing />} />
          <Route path="/tester" element={<Landing />} />
          <Route path="/studio" element={<Landing />} />
          <Route path="/specimen" element={<Landing />} />

          {/* Terms, EULA & Legal */}
          <Route path="/tos" element={<TOS />} />
          <Route path="/terms" element={<TOS />} />
          <Route path="/privacy" element={<TOS />} />
          <Route path="/eula" element={<TOS />} />
          <Route path="/license" element={<TOS />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </GlobalErrorBoundary>
  );
};

export default App;
