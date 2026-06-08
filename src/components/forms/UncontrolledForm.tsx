import { useState, useCallback } from 'react';
import { createFormSchema } from '../../schemas/formSchema';
import { useFormStore } from '../../store/formStore';
import { imageToBase64 } from '../../utils/imageUtils';
import { PasswordStrength } from '../PasswordStrength';
import { FormField, inputClass, errorClass } from './FormField';

interface UncontrolledFormProps {
  onClose: () => void;
}

export function UncontrolledForm({ onClose }: UncontrolledFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordStrength(e.target.value);
    },
    []
  );

  const { countries, addSubmission } = useFormStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const imageInput = form.elements.namedItem(
      'image'
    ) as HTMLInputElement | null;
    const imageFile = imageInput?.files?.[0] ?? null;
    const image = imageFile && imageFile.size > 0 ? imageFile : null;

    const rawData = {
      name: data.get('name') as string,
      age: data.get('age') as string,
      email: data.get('email') as string,
      gender: data.get('gender') as string,
      password: data.get('password') as string,
      confirmPassword: data.get('confirmPassword') as string,
      country: data.get('country') as string,
      image,
      termsAccepted:
        data.get('termsAccepted') === 'on' ? (true as const) : false,
    };

    const schema = createFormSchema(countries);
    const result = schema.safeParse(rawData);

    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (key && !errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      return;
    }

    const {
      image: img,
      confirmPassword: _c,
      termsAccepted,
      ...rest
    } = result.data;
    const imageBase64 = img instanceof File ? await imageToBase64(img) : null;

    addSubmission({ ...rest, termsAccepted, image: imageBase64 });
    form.reset();
    setPasswordStrength('');
    setErrors({});
    onClose();
  };

  const field = (name: string) => ({
    className: errors[name] ? errorClass : inputClass,
    'aria-invalid': !!errors[name],
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField label="Name" htmlFor="uc-name" error={errors.name}>
        <input
          id="uc-name"
          name="name"
          type="text"
          placeholder="John Smith"
          {...field('name')}
        />
      </FormField>

      <FormField label="Age" htmlFor="uc-age" error={errors.age}>
        <input
          id="uc-age"
          name="age"
          type="number"
          min={0}
          placeholder="25"
          {...field('age')}
        />
      </FormField>

      <FormField label="Email" htmlFor="uc-email" error={errors.email}>
        <input
          id="uc-email"
          name="email"
          type="email"
          placeholder="john@example.com"
          {...field('email')}
        />
      </FormField>

      <FormField label="Gender" htmlFor="uc-gender" error={errors.gender}>
        <select
          id="uc-gender"
          name="gender"
          defaultValue=""
          {...field('gender')}
        >
          <option value="" disabled>
            Select gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </FormField>

      <FormField label="Password" htmlFor="uc-password" error={errors.password}>
        <input
          id="uc-password"
          name="password"
          type="password"
          placeholder="••••••••"
          onChange={handlePasswordChange}
          {...field('password')}
        />
        <PasswordStrength password={passwordStrength} />
      </FormField>

      <FormField
        label="Confirm Password"
        htmlFor="uc-confirmPassword"
        error={errors.confirmPassword}
      >
        <input
          id="uc-confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...field('confirmPassword')}
        />
      </FormField>

      <FormField label="Country" htmlFor="uc-country" error={errors.country}>
        <input
          id="uc-country"
          name="country"
          type="text"
          list="uc-countries"
          placeholder="Start typing..."
          {...field('country')}
        />
        <datalist id="uc-countries">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </FormField>

      <FormField label="Profile Image" htmlFor="uc-image" error={errors.image}>
        <input
          id="uc-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          className="w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:border-0 file:rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </FormField>

      <div className="mb-3">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            id="uc-terms"
            name="termsAccepted"
            type="checkbox"
            className="w-4 h-4 cursor-pointer"
          />
          I accept the Terms and Conditions
        </label>
        {errors.termsAccepted && (
          <p className="text-red-500 text-xs mt-0.5" role="alert">
            {errors.termsAccepted}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
}
