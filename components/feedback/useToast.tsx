import React, { useState, createContext, useContext, useCallback } from 'react';

const SuccessIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

const ErrorIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

const InfoIcon: React.FC = () => (
     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const IndividualToast: React.FC<{ toast: Toast; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  React.useEffect(() => {
    const dismissTimer = setTimeout(() => {
      setIsExiting(true);
      const removeTimer = setTimeout(() => onDismiss(toast.id), 300); // Match animation duration
      return () => clearTimeout(removeTimer);
    }, 3000);

    return () => clearTimeout(dismissTimer);
  }, [toast.id, onDismiss]);

  const icons: Record<ToastType, React.ReactNode> = {
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    info: <InfoIcon />,
  };
  
   const baseClasses = "flex items-center gap-3 w-full max-w-xs p-4 text-white rounded-lg shadow-lg transition-all duration-300";
   const colorClasses: Record<ToastType, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-brand-dark',
  };

  const animationClass = isExiting ? 'animate-fade-out-down' : 'animate-fade-in-up';

  return (
    <div className={`${baseClasses} ${colorClasses[toast.type]} ${animationClass}`}>
      <div>{icons[toast.type]}</div>
      <div className="text-sm font-medium">{toast.message}</div>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    setToasts(prevToasts => [...prevToasts, { id: Date.now(), message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);
  
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-2 w-full px-4 pointer-events-none">
        {toasts.map(toast => (
          <IndividualToast key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
       <style>{`
        @keyframes fadeIn-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fadeIn-up 0.3s ease-out forwards; }
        
        @keyframes fadeOut-down {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(20px) scale(0.95); }
        }
        .animate-fade-out-down { animation: fadeOut-down 0.3s ease-in forwards; }
      `}</style>
    </ToastContext.Provider>
  );
};
