import { useForm } from 'react-hook-form';
import TextField from './fields/TextField';
import NumberField from './fields/NumberField';
import DateField from './fields/DateField';
import TimeField from './fields/TimeField';
import RadioField from './fields/RadioField';
import CheckboxField from './fields/CheckboxField';
import SelectField from './fields/SelectField';
import TextareaField from './fields/TextareaField';

interface FormField {
  id: string;
  type: 'text' | 'number' | 'date' | 'time' | 'radio' | 'checkbox' | 'select' | 'textarea';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
}

interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
  visibleWhen?: {
    field: string;
    operator: 'equals' | 'notEquals';
    value: string;
  };
}

interface FormSchema {
  formId: string;
  title: string;
  version: string;
  sections: FormSection[];
}

interface FormRendererProps {
  schema: FormSchema;
  onSubmit: (data: any) => void;
  onSaveDraft?: (data: any) => void;
  defaultValues?: any;
}

export default function FormRenderer({
  schema,
  onSubmit,
  onSaveDraft,
  defaultValues,
}: FormRendererProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {},
  });

  const watchedValues = watch();

  // 检查section是否应该显示
  const isSectionVisible = (section: FormSection): boolean => {
    if (!section.visibleWhen) return true;

    const { field, operator, value } = section.visibleWhen;
    const fieldValue = watchedValues[field];

    if (operator === 'equals') {
      return fieldValue === value;
    } else if (operator === 'notEquals') {
      return fieldValue !== value;
    }

    return true;
  };

  // 渲染字段
  const renderField = (field: FormField) => {
    const commonProps = {
      key: field.id,
      id: field.id,
      label: field.label,
      required: field.required,
      register,
      errors,
    };

    switch (field.type) {
      case 'text':
        return <TextField {...commonProps} placeholder={field.placeholder} />;

      case 'number':
        return (
          <NumberField
            {...commonProps}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case 'date':
        return <DateField {...commonProps} />;

      case 'time':
        return <TimeField {...commonProps} />;

      case 'radio':
        return <RadioField {...commonProps} options={field.options || []} />;

      case 'checkbox':
        return <CheckboxField {...commonProps} />;

      case 'select':
        return (
          <SelectField
            {...commonProps}
            placeholder={field.placeholder}
            options={field.options || []}
          />
        );

      case 'textarea':
        return (
          <TextareaField
            {...commonProps}
            placeholder={field.placeholder}
            rows={field.rows}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">{schema.title}</h1>
        <p className="text-sm text-gray-500 mb-6">版本: {schema.version}</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {schema.sections.map((section) => {
            if (!isSectionVisible(section)) return null;

            return (
              <div key={section.id} className="mb-8">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.fields.map((field) => renderField(field))}
                </div>
              </div>
            );
          })}

          <div className="flex gap-4 mt-8 pt-6 border-t">
            {onSaveDraft && (
              <button
                type="button"
                onClick={handleSubmit(onSaveDraft)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                保存草稿
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              提交
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
