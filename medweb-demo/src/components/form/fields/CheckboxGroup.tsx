import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface CheckboxGroupProps {
  id: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function CheckboxGroup({
  id,
  label,
  options,
  required,
  register,
  errors,
}: CheckboxGroupProps) {
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
              type="checkbox"
              id={`${id}-${option.value}`}
              value={option.value}
              {...register(id, {
                required: required ? `${label}为必填项` : false,
              })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
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
        <p className="mt-1 text-sm text-red-600">
          {errors[id]?.message as string}
        </p>
      )}
    </div>
  );
}
