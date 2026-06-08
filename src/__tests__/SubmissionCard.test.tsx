import { render, screen, act } from '@testing-library/react';
import { SubmissionCard } from '../components/SubmissionCard';
import { useFormStore } from '../store/formStore';

const makeSubmission = (overrides = {}) => ({
  id: 'test-id',
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  gender: 'female',
  termsAccepted: true as const,
  password: 'Secret1!',
  country: 'France',
  image: null,
  submittedAt: Date.now(),
  isNew: false,
  ...overrides,
});

beforeEach(() => {
  useFormStore.setState({ submissions: [] });
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('SubmissionCard', () => {
  it('renders name, age, email, gender and country', () => {
    render(<SubmissionCard submission={makeSubmission()} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
    expect(screen.getByText(/alice@example\.com/)).toBeInTheDocument();
    expect(screen.getByText(/female/i)).toBeInTheDocument();
    expect(screen.getByText(/France/)).toBeInTheDocument();
  });

  it('shows image when provided', () => {
    const submission = makeSubmission({ image: 'data:image/png;base64,abc' });
    render(<SubmissionCard submission={submission} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('shows initial letter avatar when no image', () => {
    render(<SubmissionCard submission={makeSubmission({ image: null })} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('shows "New" badge when isNew is true', () => {
    render(<SubmissionCard submission={makeSubmission({ isNew: true })} />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('does not show "New" badge when isNew is false', () => {
    render(<SubmissionCard submission={makeSubmission({ isNew: false })} />);
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('calls markAsOld after 3 seconds when isNew is true', async () => {
    useFormStore.setState({
      submissions: [makeSubmission({ isNew: true })],
    });

    render(
      <SubmissionCard
        submission={useFormStore.getState().submissions[0]}
      />
    );

    expect(screen.getByText('New')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(useFormStore.getState().submissions[0].isNew).toBe(false);
  });
});
