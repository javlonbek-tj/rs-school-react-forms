import { useEffect } from 'react';
import type { FormSubmission } from '../store/formStore';
import { useFormStore } from '../store/formStore';

interface SubmissionCardProps {
  submission: FormSubmission;
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const markAsOld = useFormStore((s) => s.markAsOld);

  useEffect(() => {
    if (!submission.isNew) return;
    const timer = setTimeout(() => markAsOld(submission.id), 3000);
    return () => clearTimeout(timer);
  }, [submission.id, submission.isNew, markAsOld]);

  return (
    <div
      className={`bg-white rounded-lg shadow border-2 overflow-hidden transition-all ${
        submission.isNew ? 'border-blue-500' : 'border-transparent'
      }`}
    >
      {submission.image ? (
        <img src={submission.image} alt="Profile" className="w-full h-36 object-cover" />
      ) : (
        <div className="w-full h-36 bg-blue-50 flex items-center justify-center">
          <span className="text-4xl font-bold text-blue-300">
            {submission.name[0]?.toUpperCase()}
          </span>
        </div>
      )}

      <div className="p-3 text-sm space-y-0.5">
        {submission.isNew && (
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            New
          </span>
        )}
        <p className="font-semibold text-gray-900">{submission.name}</p>
        <p className="text-gray-500">Age: {submission.age}</p>
        <p className="text-gray-500 truncate">Email: {submission.email}</p>
        <p className="text-gray-500 capitalize">Gender: {submission.gender}</p>
        <p className="text-gray-500">Country: {submission.country}</p>
      </div>
    </div>
  );
}
