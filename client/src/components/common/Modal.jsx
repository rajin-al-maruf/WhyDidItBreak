import { useEffect } from 'react';
import { XIcon, AlertCircleIcon } from './Icons';

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  isLoading = false,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/95 p-6 shadow-2xl backdrop-blur-md transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {isDanger && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertCircleIcon className="h-5 w-5" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
              {description && (
                <p className="mt-1 text-sm text-zinc-400">{description}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition disabled:opacity-50"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
                isDanger
                  ? 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700'
                  : 'bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-700'
              }`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
