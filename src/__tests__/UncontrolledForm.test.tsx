import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UncontrolledForm } from '../components/forms/UncontrolledForm';
import { useFormStore } from '../store/formStore';

beforeEach(() => {
  useFormStore.setState({ submissions: [] });
});

const renderForm = (onClose = vi.fn()) =>
  render(<UncontrolledForm onClose={onClose} />);

const getForm = () => screen.getByRole('button', { name: /submit/i }).closest('form')!;
const getAgeInput = () => screen.getByRole('spinbutton', { name: /^age/i });
const getImageInput = () => screen.getByLabelText(/profile image/i);

const submitForm = () => fireEvent.submit(getForm());

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/^name/i), 'Alice');
  await user.clear(getAgeInput());
  await user.type(getAgeInput(), '25');
  await user.type(screen.getByLabelText(/^email/i), 'alice@example.com');
  await user.selectOptions(screen.getByLabelText(/^gender/i), 'female');
  await user.type(screen.getByLabelText(/^password/i), 'Secret1!');
  await user.type(screen.getByLabelText(/confirm password/i), 'Secret1!');
  await user.type(screen.getByLabelText(/^country/i), 'France');

  const file = new File(['data'], 'photo.png', { type: 'image/png' });
  await user.upload(getImageInput(), file);

  await user.click(screen.getByRole('checkbox'));
};

describe('UncontrolledForm', () => {
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

  it('shows validation errors on submit with empty form', async () => {
    renderForm();

    submitForm();

    await waitFor(
      () => expect(screen.getByText('Name is required')).toBeInTheDocument(),
      { timeout: 3000 }
    );
  });

  it('shows error when name does not start with uppercase', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/^name/i), 'alice');
    submitForm();

    await waitFor(() => expect(screen.getByText(/uppercase/i)).toBeInTheDocument());
  });

  it('shows error for invalid email', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/^email/i), 'notanemail');
    submitForm();

    await waitFor(() => expect(screen.getByText(/invalid email/i)).toBeInTheDocument());
  });

  it('shows error when passwords do not match', async () => {
    renderForm();

    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'Secret1!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Different1!' } });
    submitForm();

    await waitFor(() => expect(screen.getByText(/passwords must match/i)).toBeInTheDocument(), { timeout: 3000 });
  });

  it('shows password strength indicator when typing password', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/^password/i), 'test');

    expect(screen.getByText(/at least 1 number/i)).toBeInTheDocument();
  });

  it('submit button is not disabled', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled();
  });

  it('submits successfully with valid data and calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderForm(onClose);

    await fillValidForm(user);

    await act(async () => {
      submitForm();
      await new Promise((r) => setTimeout(r, 100));
    });

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1), { timeout: 5000 });

    const { submissions } = useFormStore.getState();
    expect(submissions).toHaveLength(1);
    expect(submissions[0].name).toBe('Alice');
  });
});
