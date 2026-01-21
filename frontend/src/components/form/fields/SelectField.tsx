import { useState } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface SelectFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  allowCustom?: boolean;
  watch?: any;
  setValue?: any;
}

export default function SelectField({
  id,
  label,
  placeholder,
  required,
  options,
  register,
  errors,
  allowCustom = false,
  watch,
  setValue,
}: SelectFieldProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const selectedValue = watch ? watch(id) : '';

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (allowCustom && value === 'other') {
      setShowCustomInput(true);
      if (setValue) setValue(`${id}_custom`, '');
    } else {
      setShowCustomInput(false);
      if (setValue) setValue(`${id}_custom`, undefined);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={id}
        {...register(id, { required: required ? `${label}为必填项` : false })}
        onChange={handleSelectChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {allowCustom && (selectedValue === 'other' || showCustomInput) && (
        <div className="mt-2">
          <input
            type="text"
            id={`${id}_custom`}
            {...register(`${id}_custom`, {
              required: selectedValue === 'other' ? '请输入自定义医院名称' : false
            })}
            placeholder="请输入医院名称"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors[`${id}_custom`] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[`${id}_custom`]?.message as string}
            </p>
          )}
        </div>
      )}

      {errors[id] && (
        <p className="mt-1 text-sm text-red-600">{errors[id]?.message as string}</p>
      )}
    </div>
  );
}
