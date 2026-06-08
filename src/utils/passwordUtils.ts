export interface PasswordCriterion {
  label: string;
  met: boolean;
}

export function getPasswordStrength(password: string): PasswordCriterion[] {
  return [
    { label: 'At least 1 number', met: /\d/.test(password) },
    { label: 'At least 1 uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'At least 1 lowercase letter', met: /[a-z]/.test(password) },
    { label: 'At least 1 special character', met: /[^a-zA-Z0-9]/.test(password) },
  ];
}
