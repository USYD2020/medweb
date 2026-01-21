import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface CheckboxFieldProps {
  id: string;
  label: string;
  required?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function CheckboxField({
  id,
  label,
  required,
  register,
  errors,
}: CheckboxFieldProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <input
          id={id}
          type="checkbox"
          {...register(id, { required: required ? `${label}为必填项` : false })}
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
        />
        <label htmlFor={id} className="ml-2 text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {errors[id] && (
        <p className="mt-1 text-sm text-red-600">{errors[id]?.message as string}</p>
      )}
    </div>
  );
}
