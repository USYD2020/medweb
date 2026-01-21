import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface TextFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function TextField({
  id,
  label,
  placeholder,
  required,
  register,
  errors,
}: TextFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type="text"
        {...register(id, { required: required ? `${label}为必填项` : false })}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {errors[id] && (
        <p className="mt-1 text-sm text-red-600">{errors[id]?.message as string}</p>
      )}
    </div>
  );
}
