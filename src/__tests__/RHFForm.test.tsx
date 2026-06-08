import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RHFForm } from '../components/forms/RHFForm';
import { useFormStore } from '../store/formStore';

beforeEach(() => {
  useFormStore.setState({ submissions: [] });
});

const renderForm = (onClose = vi.fn()) => render(<RHFForm onClose={onClose} />);

const getAgeInput = () => screen.getByRole('spinbutton', { name: /^age/i });
const getImageInput = () => screen.getByLabelText(/profile image/i);

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/^name/i), 'Bob');
  await user.clear(getAgeInput());
  await user.type(getAgeInput(), '28');
  await user.type(screen.getByLabelText(/^email/i), 'bob@example.com');
  await user.selectOptions(screen.getByLabelText(/^gender/i), 'male');
  await user.type(screen.getByLabelText(/^password/i), 'Secret1!');
  await user.type(screen.getByLabelText(/confirm password/i), 'Secret1!');
  await user.type(screen.getByLabelText(/^country/i), 'Germany');

  const file = new File(['data'], 'photo.jpeg', { type: 'image/jpeg' });
  await user.upload(getImageInput(), file);

  await user.click(screen.getByRole('checkbox'));
};

describe('RHFForm', () => {
  it('renders all required fields', () => {
    renderForm();
    expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
    expect(getAgeInput()).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^country/i)).toBeInTheDocument();
    expect(getImageInput()).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('submit button is disabled initially (live validation, no valid data)', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('shows live validation error for name not starting with uppercase', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/^name/i), 'bob');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/uppercase/i)).toBeInTheDocument();
    });
  });

  it('shows live validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/^email/i), 'invalidemail');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/^password/i), 'Secret1!');
    await user.type(screen.getByLabelText(/confirm password/i), 'Different1!');
    await user.tab();

    await waitFor(
      () => {
        expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('shows password strength indicator when typing', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/^password/i), 'test');

    expect(screen.getByText(/at least 1 number/i)).toBeInTheDocument();
  });

  it('enables submit button when all fields are valid', async () => {
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled();
    });
  });

  it('submits successfully with valid data and calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderForm(onClose);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      const { submissions } = useFormStore.getState();
      expect(submissions).toHaveLength(1);
      expect(submissions[0].name).toBe('Bob');
    });
  });
});
