import { act } from 'react';
import { useFormStore } from '../store/formStore';

const makeSubmission = (overrides = {}) => ({
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  gender: 'female',
  termsAccepted: true,
  password: 'Secret1!',
  country: 'France',
  image: null,
  ...overrides,
});

beforeEach(() => {
  useFormStore.setState({ submissions: [] });
});

describe('formStore', () => {
  it('has a countries list with entries', () => {
    const { countries } = useFormStore.getState();
    expect(countries.length).toBeGreaterThan(0);
    expect(countries).toContain('United States');
  });

  it('adds a submission with isNew=true', () => {
    act(() => {
      useFormStore.getState().addSubmission(makeSubmission());
    });

    const { submissions } = useFormStore.getState();
    expect(submissions).toHaveLength(1);
    expect(submissions[0].isNew).toBe(true);
    expect(submissions[0].name).toBe('Alice');
  });

  it('prepends new submissions (newest first)', () => {
    act(() => {
      useFormStore.getState().addSubmission(makeSubmission({ name: 'First' }));
      useFormStore.getState().addSubmission(makeSubmission({ name: 'Second' }));
    });

    const { submissions } = useFormStore.getState();
    expect(submissions[0].name).toBe('Second');
    expect(submissions[1].name).toBe('First');
  });

  it('assigns a unique id and submittedAt timestamp', () => {
    act(() => {
      useFormStore.getState().addSubmission(makeSubmission());
    });

    const { submissions } = useFormStore.getState();
    expect(submissions[0].id).toBeTruthy();
    expect(typeof submissions[0].submittedAt).toBe('number');
  });

  it('markAsOld sets isNew to false for the specified id', () => {
    act(() => {
      useFormStore.getState().addSubmission(makeSubmission());
    });

    const id = useFormStore.getState().submissions[0].id;

    act(() => {
      useFormStore.getState().markAsOld(id);
    });

    expect(useFormStore.getState().submissions[0].isNew).toBe(false);
  });

  it('markAsOld does not affect other submissions', () => {
    act(() => {
      useFormStore.getState().addSubmission(makeSubmission({ name: 'A' }));
      useFormStore.getState().addSubmission(makeSubmission({ name: 'B' }));
    });

    const { submissions } = useFormStore.getState();
    const idA = submissions[1].id;

    act(() => {
      useFormStore.getState().markAsOld(idA);
    });

    expect(useFormStore.getState().submissions[0].isNew).toBe(true);
    expect(useFormStore.getState().submissions[1].isNew).toBe(false);
  });
});
