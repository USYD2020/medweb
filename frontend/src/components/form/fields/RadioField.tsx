import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface RadioFieldProps {
  id: string;
  label: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function RadioField({
  id,
  label,
  required,
  options,
  register,
  errors,
}: RadioFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${id}-${option.value}`}
              type="radio"
              value={option.value}
              {...register(id, { required: required ? `${label}为必填项` : false })}
              className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
            />
            <label
              htmlFor={`${id}-${option.value}`}
              className="ml-2 text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {errors[id] && (
        <p className="mt-1 text-sm text-red-600">{errors[id]?.message as string}</p>
      )}
    </div>
  );
}
