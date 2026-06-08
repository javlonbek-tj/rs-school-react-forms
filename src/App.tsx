import { useRef, useState } from 'react';
import { Modal } from './components/Modal';
import { UncontrolledForm } from './components/forms/UncontrolledForm';
import { RHFForm } from './components/forms/RHFForm';
import { SubmissionCard } from './components/SubmissionCard';
import { useFormStore } from './store/formStore';

type ModalType = 'uncontrolled' | 'rhf' | null;

export default function App() {
  const [open, setOpen] = useState<ModalType>(null);
  const ucBtnRef = useRef<HTMLButtonElement>(null);
  const rhfBtnRef = useRef<HTMLButtonElement>(null);

  const submissions = useFormStore((s) => s.submissions);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">React Forms</h1>
        <div className="flex gap-3">
          <button
            ref={ucBtnRef}
            type="button"
            onClick={() => setOpen('uncontrolled')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Uncontrolled Form
          </button>
          <button
            ref={rhfBtnRef}
            type="button"
            onClick={() => setOpen('rhf')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            React Hook Form
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {submissions.length === 0 ? (
          <p className="text-center text-gray-400 mt-20">
            No submissions yet. Open a form to get started.
          </p>
        ) : (
          <>
            <h2 className="text-base font-semibold text-gray-700 mb-4">
              Submissions ({submissions.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {submissions.map((s) => (
                <SubmissionCard key={s.id} submission={s} />
              ))}
            </div>
          </>
        )}
      </main>

      <Modal
        isOpen={open === 'uncontrolled'}
        onClose={() => setOpen(null)}
        title="Uncontrolled Form"
        triggerRef={ucBtnRef}
      >
        {open === 'uncontrolled' && <UncontrolledForm onClose={() => setOpen(null)} />}
      </Modal>

      <Modal
        isOpen={open === 'rhf'}
        onClose={() => setOpen(null)}
        title="React Hook Form"
        triggerRef={rhfBtnRef}
      >
        {open === 'rhf' && <RHFForm onClose={() => setOpen(null)} />}
      </Modal>
    </div>
  );
}
