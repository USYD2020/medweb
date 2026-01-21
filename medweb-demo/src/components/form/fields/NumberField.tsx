import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface NumberFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string; // 单位（如 cm, kg, mmHg）
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function NumberField({
  id,
  label,
  placeholder,
  required,
  min,
  max,
  step,
  unit,
  register,
  errors,
}: NumberFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          {...register(id, {
            required: required ? `${label}为必填项` : false,
            valueAsNumber: true,
          })}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            unit ? 'pr-16' : ''
          }`}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            {unit}
          </span>
        )}
      </div>
      {errors[id] && (
        <p className="mt-1 text-sm text-red-600">{errors[id]?.message as string}</p>
      )}
    </div>
  );
}
