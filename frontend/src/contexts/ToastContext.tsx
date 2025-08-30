import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastOptions {
  action?: ToastAction;
  duration?: number;
  closeOnClick?: boolean;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  action?: ToastAction;
  duration?: number;
  closeOnClick?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (
    message: string, 
    type?: 'success' | 'error' | 'info',
    options?: ToastOptions
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (
    message: string, 
    type: 'success' | 'error' | 'info' = 'info',
    options: ToastOptions = {}
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const { action, duration = 7000, closeOnClick = true } = options;
    
    setToasts((prev) => [...prev, { 
      id, 
      message, 
      type, 
      action,
      duration,
      closeOnClick 
    }]);
    
    // Auto-remove after duration if no action is provided
    if (!action) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({
  toasts,
  removeToast,
}) => {
  if (toasts.length === 0) return null;

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-4 border-green-400';
      case 'error':
        return 'bg-red-50 border-l-4 border-red-400';
      case 'info':
      default:
        return 'bg-blue-50 border-l-4 border-blue-400';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`w-80 rounded-lg shadow-lg overflow-hidden ${getToastStyles(toast.type)}`}
          >
            <div 
              className="p-4"
              onClick={() => toast.closeOnClick && removeToast(toast.id)}
            >
              <div className="flex items-start">
                {getIcon(toast.type)}
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{toast.message}</p>
                  {toast.action && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.action?.onClick();
                        removeToast(toast.id);
                      }}
                      className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
              </div>
            </div>
            {!toast.action && (
              <div className="h-1 bg-gray-200">
                <motion.div
                  className="h-full bg-gray-400"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: (toast.duration || 7000) / 1000, ease: 'linear' }}
                  onAnimationComplete={() => removeToast(toast.id)}
                />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContext;
