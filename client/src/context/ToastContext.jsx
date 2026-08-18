import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info')
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-2xl backdrop-blur-md border transition-all duration-300 transform translate-y-0 ${
              t.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-950/50' :
              t.type === 'error' ? 'bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-950/50' :
              t.type === 'warning' ? 'bg-amber-950/90 border-amber-500/40 text-amber-100 shadow-amber-950/50' :
              'bg-slate-900/90 border-cyan-500/40 text-cyan-100 shadow-cyan-950/50'
            }`}
          >
            <div className="flex items-center gap-3">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {t.type === 'error' && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-cyan-400 shrink-0" />}
              <span className="text-sm font-medium leading-snug">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
