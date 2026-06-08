import { create } from 'zustand';

export interface FormSubmission {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: string;
  termsAccepted: boolean;
  password: string;
  country: string;
  image: string | null;
  submittedAt: number;
  isNew: boolean;
}

interface FormStore {
  countries: string[];
  submissions: FormSubmission[];
  addSubmission: (data: Omit<FormSubmission, 'id' | 'submittedAt' | 'isNew'>) => void;
  markAsOld: (id: string) => void;
}

export const COUNTRIES = [
  'France',
  'Germany',
  'Poland',
  'United Kingdom',
  'United States',
];

export const useFormStore = create<FormStore>((set) => ({
  countries: COUNTRIES,
  submissions: [],
  addSubmission: (data) =>
    set((state) => ({
      submissions: [
        {
          ...data,
          id: crypto.randomUUID(),
          submittedAt: Date.now(),
          isNew: true,
        },
        ...state.submissions,
      ],
    })),
  markAsOld: (id) =>
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, isNew: false } : s
      ),
    })),
}));
