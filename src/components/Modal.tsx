import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export function Modal({ isOpen, onClose, title, children, triggerRef }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
      triggerRef?.current?.focus();
    };

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose, triggerRef]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      className="m-auto rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-0 backdrop:bg-black/50"
    >
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 id="modal-title" className="text-base font-semibold text-gray-900">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>
      <div className="px-4 py-3">{children}</div>
    </dialog>,
    document.body
  );
}
