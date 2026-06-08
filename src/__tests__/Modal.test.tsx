import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../components/Modal';

vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom')>();
  return { ...actual, createPortal: (node: React.ReactNode) => node };
});

const renderModal = (isOpen = true, onClose = vi.fn()) =>
  render(
    <Modal isOpen={isOpen} onClose={onClose} title="Test Modal">
      <button>Content Button</button>
    </Modal>
  );

describe('Modal', () => {
  it('does not call showModal when closed', () => {
    renderModal(false);
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
  });

  it('calls showModal when open', () => {
    renderModal(true);
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
  });

  it('renders title and children', () => {
    renderModal();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Content Button')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    renderModal(true, onClose);

    await userEvent.click(screen.getByRole('button', { name: /close modal/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the dialog backdrop', () => {
    const onClose = vi.fn();
    renderModal(true, onClose);

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has aria-labelledby pointing to the title', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-title');
  });
});
