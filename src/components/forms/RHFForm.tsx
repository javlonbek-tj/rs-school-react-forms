import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createFormSchema } from '../../schemas/formSchema';
import { useFormStore } from '../../store/formStore';
import { imageToBase64 } from '../../utils/imageUtils';
import { PasswordStrength } from '../PasswordStrength';
import { FormField, inputClass, errorClass } from './FormField';

interface RHFFormProps {
  onClose: () => void;
}

export function RHFForm({ onClose }: RHFFormProps) {
  const { countries, addSubmission } = useFormStore();
  const schema = createFormSchema(countries);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const password = useWatch({ control, name: 'password' }) ?? '';

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const { image, confirmPassword: _c, ...rest } = data;
    const imageBase64 =
      image instanceof File ? await imageToBase64(image) : null;
    addSubmission({ ...rest, image: imageBase64 });
    reset();
    onClose();
  };

  const cls = (field: string) =>
    errors[field as keyof typeof errors] ? errorClass : inputClass;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="React Hook Form form"
    >
      <FormField label="Name" htmlFor="rhf-name" error={errors.name?.message}>
        <input
          id="rhf-name"
          type="text"
          placeholder="John Smith"
          className={cls('name')}
          {...register('name')}
        />
      </FormField>

      <FormField label="Age" htmlFor="rhf-age" error={errors.age?.message}>
        <input
          id="rhf-age"
          type="number"
          min={0}
          placeholder="25"
          className={cls('age')}
          {...register('age', {
            setValueAs: (v: string) => (v === '' ? 0 : Number(v)),
          })}
        />
      </FormField>

      <FormField
        label="Email"
        htmlFor="rhf-email"
        error={errors.email?.message}
      >
        <input
          id="rhf-email"
          type="email"
          placeholder="john@example.com"
          className={cls('email')}
          {...register('email')}
        />
      </FormField>

      <FormField
        label="Gender"
        htmlFor="rhf-gender"
        error={errors.gender?.message}
      >
        <select
          id="rhf-gender"
          className={cls('gender')}
          {...register('gender')}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </FormField>

      <FormField
        label="Password"
        htmlFor="rhf-password"
        error={errors.password?.message}
      >
        <input
          id="rhf-password"
          type="password"
          placeholder="••••••••"
          className={cls('password')}
          {...register('password')}
        />
        <PasswordStrength password={password} />
      </FormField>

      <FormField
        label="Confirm Password"
        htmlFor="rhf-confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <input
          id="rhf-confirmPassword"
          type="password"
          placeholder="••••••••"
          className={cls('confirmPassword')}
          {...register('confirmPassword')}
        />
      </FormField>

      <FormField
        label="Country"
        htmlFor="rhf-country"
        error={errors.country?.message}
      >
        <input
          id="rhf-country"
          type="text"
          list="rhf-countries"
          placeholder="Start typing..."
          className={cls('country')}
          {...register('country')}
        />
        <datalist id="rhf-countries">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </FormField>

      <FormField
        label="Profile Image"
        htmlFor="rhf-image"
        error={errors.image?.message as string | undefined}
      >
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange, ref } }) => (
            <input
              id="rhf-image"
              type="file"
              accept="image/png,image/jpeg"
              ref={ref}
              onChange={(e) => onChange(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:border-0 file:rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          )}
        />
      </FormField>

      <div className="mb-3">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            id="rhf-terms"
            type="checkbox"
            className="w-4 h-4 cursor-pointer"
            {...register('termsAccepted')}
          />
          I accept the Terms and Conditions
        </label>
        {errors.termsAccepted && (
          <p className="text-red-500 text-xs mt-0.5" role="alert">
            {errors.termsAccepted.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer text-white rounded-md font-medium transition-colors"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
