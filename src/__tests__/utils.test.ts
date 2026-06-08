import { validateEmail } from '../utils/emailUtils';
import { getPasswordStrength } from '../utils/passwordUtils';
import { imageToBase64 } from '../utils/imageUtils';

describe('validateEmail', () => {
  it('accepts valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('a@b.co')).toBe(true);
    expect(validateEmail('test.name+tag@sub.domain.org')).toBe(true);
  });

  it('rejects missing @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  it('rejects multiple @ signs', () => {
    expect(validateEmail('a@b@c.com')).toBe(false);
  });

  it('rejects empty local part', () => {
    expect(validateEmail('@example.com')).toBe(false);
  });

  it('rejects domain without dot', () => {
    expect(validateEmail('user@localhost')).toBe(false);
  });

  it('rejects empty domain part after dot', () => {
    expect(validateEmail('user@example.')).toBe(false);
  });
});

describe('getPasswordStrength', () => {
  it('returns empty array for empty password', () => {
    const result = getPasswordStrength('');
    expect(result).toHaveLength(4);
    expect(result.every((c) => !c.met)).toBe(true);
  });

  it('marks only lowercase criterion for all-lowercase password', () => {
    const result = getPasswordStrength('password');
    expect(result.find((c) => c.label.includes('lowercase'))?.met).toBe(true);
    expect(result.find((c) => c.label.includes('number'))?.met).toBe(false);
    expect(result.find((c) => c.label.includes('uppercase'))?.met).toBe(false);
    expect(result.find((c) => c.label.includes('special'))?.met).toBe(false);
  });

  it('marks all criteria met for a strong password', () => {
    const result = getPasswordStrength('Password1!');
    expect(result.every((c) => c.met)).toBe(true);
  });

  it('reflects which criteria are met', () => {
    const result = getPasswordStrength('Password1');
    expect(result.find((c) => c.label.includes('number'))?.met).toBe(true);
    expect(result.find((c) => c.label.includes('uppercase'))?.met).toBe(true);
    expect(result.find((c) => c.label.includes('lowercase'))?.met).toBe(true);
    expect(result.find((c) => c.label.includes('special'))?.met).toBe(false);
  });
});

describe('imageToBase64', () => {
  it('converts a file to a base64 data URL', async () => {
    const content = new Uint8Array([137, 80, 78, 71]);
    const file = new File([content], 'test.png', { type: 'image/png' });
    const result = await imageToBase64(file);
    expect(result).toMatch(/^data:image\/png;base64,/);
  });
});
