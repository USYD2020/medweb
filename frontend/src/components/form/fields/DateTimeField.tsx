import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface DateTimeFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function DateTimeField({
  id,
  label,
  placeholder,
  required,
  register,
  errors,
}: DateTimeFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type="datetime-local"
        {...register(id, {
          required: required ? `${label}为必填项` : false,
        })}
        placeholder={placeholder}
        onPointerDown={(e) => {
          const input = e.target as HTMLInputElement;
          input.showPicker?.();
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      />
      {errors[id] && (
        <p className="mt-1 text-sm text-red-600">{errors[id]?.message as string}</p>
      )}
    </div>
  );
}
