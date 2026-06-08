import { getPasswordStrength } from '../utils/passwordUtils';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const criteria = getPasswordStrength(password);

  return (
    <ul className="mt-1 grid grid-cols-2 gap-0.5 text-xs" aria-live="polite">
      {criteria.map((c) => (
        <li key={c.label} className={c.met ? 'text-green-600' : 'text-gray-400'}>
          {c.met ? '✓' : '○'} {c.label}
        </li>
      ))}
    </ul>
  );
}
