import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import type { ToastProps } from './core/Toast';
import { Toast } from './core/Toast';
import { generateId } from '../lib/generateId';
import { Portal } from './Portal';
import { AnimatePresence } from 'framer-motion';

type ToastEntry = {
  id?: string;
  message: ReactNode;
  timeout?: number | null;
  onClose?: ToastProps['onClose'];
} & Omit<ToastProps, 'onClose' | 'open' | 'children' | 'timeout'>;

type PrivateToastEntry = ToastEntry & {
  id: string;
  timeout: number | null;
};

interface State {
  toasts: PrivateToastEntry[];
  actions: Actions;
}

interface Actions {
  show: (d: ToastEntry) => void;
  hide: (id: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ToastContext = createContext<State>({} as State);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<State['toasts']>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const actions = useMemo<Actions>(
    () => ({
      show({ id, timeout = 4000, ...props }: ToastEntry) {
        id = id ?? generateId();
        if (timeout != null) {
          timeoutRef.current = setTimeout(() => this.hide(id), timeout);
        }
        setToasts((a) => {
          if (a.some((v) => v.id === id)) {
            // It's already visible with this id
            return a;
          }
          return [...a, { id, timeout, ...props }];
        });
        return id;
      },
      hide: (id: string) => {
        setToasts((all) => {
          const t = all.find((t) => t.id === id);
          t?.onClose?.();
          return all.filter((t) => t.id !== id);
        });
      },
    }),
    [],
  );

  const state: State = { toasts, actions };

  return (
    <ToastContext.Provider value={state}>
      {children}
      <Portal name="toasts">
        <div className="absolute right-0 bottom-0">
          <AnimatePresence>
            {toasts.map((props: PrivateToastEntry) => (
              <ToastInstance key={props.id} {...props} />
            ))}
          </AnimatePresence>
        </div>
      </Portal>
    </ToastContext.Provider>
  );
};

function ToastInstance({ id, message, timeout, ...props }: PrivateToastEntry) {
  const { actions } = useContext(ToastContext);
  return (
    <Toast
      open
      timeout={timeout}
      {...props}
      // We call onClose inside actions.hide instead of passing to toast so that
      // it gets called from external close calls as well
      onClose={() => actions.hide(id)}
    >
      {message}
    </Toast>
  );
}

export const useToast = () => useContext(ToastContext).actions;
