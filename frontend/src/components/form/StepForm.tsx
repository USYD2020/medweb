import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { FormSchema, FormModule, FormData } from '@/types/form';
import TextField from './fields/TextField';
import NumberField from './fields/NumberField';
import DateField from './fields/DateField';
import TimeField from './fields/TimeField';
import DateTimeField from './fields/DateTimeField';
import RadioField from './fields/RadioField';
import CheckboxField from './fields/CheckboxField';
import CheckboxGroup from './fields/CheckboxGroup';
import SelectField from './fields/SelectField';
import TextareaField from './fields/TextareaField';

interface StepFormProps {
  schema: FormSchema;
  initialData?: FormData;
  onSave?: (data: FormData) => void;
  onSubmit: (data: FormData) => void;
}

export default function StepForm({
  schema,
  initialData,
  onSave,
  onSubmit,
}: StepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [validationError, setValidationError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [missingRequiredFields, setMissingRequiredFields] = useState<string[]>([]);

  // 获取所有字段的默认值
  const getDefaultValues = (): FormData => {
    const defaults: FormData = {};

    schema.modules.forEach((module) => {
      module.sections.forEach((section) => {
        section.fieldGroups.forEach((group) => {
          group.fields.forEach((field) => {
            if ('defaultValue' in field && field.defaultValue !== undefined) {
              defaults[field.id] = field.defaultValue as any;
            }
          });
        });
      });
    });

    return defaults;
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    getValues,
    trigger,
  } = useForm({
    defaultValues: { ...getDefaultValues(), ...initialData },
    mode: 'onChange',
  });

  // 获取可见的模块（根据条件显示逻辑）
  const getVisibleModules = (): FormModule[] => {
    return schema.modules.filter((module) => {
      if (!module.visibleWhen) return true;

      const { field, operator, value } = module.visibleWhen;
      const fieldValue = watch(field);

      if (operator === 'equals') {
        return fieldValue === value;
      } else if (operator === 'notEquals') {
        return fieldValue !== value;
      }

      return true;
    });
  };

  const visibleModules = getVisibleModules();

  // 获取当前步骤的所有必填字段
  const getCurrentStepRequiredFields = (): string[] => {
    const currentModule = visibleModules[currentStep];
    if (!currentModule) return [];

    const requiredFields: string[] = [];
    currentModule.sections.forEach((section) => {
      section.fieldGroups.forEach((group) => {
        group.fields.forEach((field) => {
          if (field.required) {
            requiredFields.push(field.id);
          }
        });
      });
    });
    return requiredFields;
  };

  // 验证当前步骤的必填项
  const validateCurrentStep = async (): Promise<boolean> => {
    const requiredFields = getCurrentStepRequiredFields();
    const values = getValues();

    const emptyFields: { id: string; label: string }[] = [];
    const currentModule = visibleModules[currentStep];

    requiredFields.forEach((fieldId) => {
      const value = values[fieldId];
      if (value === undefined || value === null || value === '') {
        // 查找字段的标签
        let fieldLabel = fieldId;
        currentModule.sections.forEach((section) => {
          section.fieldGroups.forEach((group) => {
            const field = group.fields.find((f) => f.id === fieldId);
            if (field) {
              fieldLabel = field.label;
            }
          });
        });
        emptyFields.push({ id: fieldId, label: fieldLabel });
      }
    });

    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map((f) => f.label).join('、');
      setValidationError(`请填写以下必填项：${fieldNames}`);
      return false;
    }

    setValidationError('');
    return true;
  };

  // 处理下一步
  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 处理上一步
  const handlePrevStep = () => {
    setValidationError('');
    setCurrentStep(Math.max(0, currentStep - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 自动保存功能（每30秒）
  useEffect(() => {
    if (!onSave) return;

    const autoSaveInterval = setInterval(async () => {
      setIsSaving(true);
      const data = getValues();
      await onSave(data);
      setLastSaved(new Date());
      setIsSaving(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
    }, 30000); // 30秒

    return () => clearInterval(autoSaveInterval);
  }, [onSave, getValues]);

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S 保存草稿
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (onSave && !isSaving) {
          setIsSaving(true);
          const data = getValues();
          onSave(data).then(() => {
            setLastSaved(new Date());
            setIsSaving(false);
            setShowSaveSuccess(true);
            setTimeout(() => setShowSaveSuccess(false), 2000);
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onSave, isSaving, getValues]);

  // 实时验证当前步骤的必填项
  useEffect(() => {
    const checkStepValidity = () => {
      const requiredFields = getCurrentStepRequiredFields();
      const currentModule = visibleModules[currentStep];

      // 如果当前步骤没有必填字段,则默认为有效
      if (requiredFields.length === 0) {
        setIsCurrentStepValid(true);
        setMissingRequiredFields([]);
        return;
      }

      const values = getValues();
      const missingFields: string[] = [];

      // 检查所有必填字段是否都有值，并收集未填写的字段
      requiredFields.forEach((fieldId) => {
        const value = values[fieldId];
        if (value === undefined || value === null || value === '') {
          // 查找字段的标签
          let fieldLabel = fieldId;
          currentModule?.sections.forEach((section) => {
            section.fieldGroups.forEach((group) => {
              const field = group.fields.find((f) => f.id === fieldId);
              if (field) {
                fieldLabel = field.label;
              }
            });
          });
          missingFields.push(fieldLabel);
        }
      });

      const allRequiredFilled = missingFields.length === 0;
      setIsCurrentStepValid(allRequiredFilled);
      setMissingRequiredFields(missingFields);
    };

    checkStepValidity();
  }, [watch(), currentStep, visibleModules]);

  // 渲染单个字段
  const renderField = (field: any) => {
    const commonProps = {
      id: field.id,
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      register,
      errors,
    };

    switch (field.type) {
      case 'text':
        return <TextField key={field.id} {...commonProps} />;
      case 'textarea':
        return <TextareaField key={field.id} {...commonProps} />;
      case 'number':
        return <NumberField key={field.id} {...commonProps} unit={field.unit} />;
      case 'date':
        return <DateField key={field.id} {...commonProps} />;
      case 'time':
        return <TimeField key={field.id} {...commonProps} />;
      case 'datetime':
        return <DateTimeField key={field.id} {...commonProps} />;
      case 'radio':
        return <RadioField key={field.id} {...commonProps} options={field.options || []} />;
      case 'checkbox':
        return <CheckboxField key={field.id} {...commonProps} />;
      case 'checkbox-group':
        return <CheckboxGroup key={field.id} {...commonProps} options={field.options || []} />;
      case 'select':
        return (
          <SelectField
            key={field.id}
            {...commonProps}
            options={field.options || []}
            allowCustom={field.allowCustom}
            watch={watch}
            setValue={setValue}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部进度条 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold">{schema.title}</h1>
            <div className="flex items-center gap-2">
              {isSaving && (
                <span className="text-sm text-blue-600">正在保存...</span>
              )}
              {showSaveSuccess && (
                <span className="text-sm text-green-600 font-medium">
                  ✓ 保存成功
                </span>
              )}
              {lastSaved && !isSaving && !showSaveSuccess && (
                <span className="text-sm text-gray-500">
                  最后保存: {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {visibleModules.map((module, index) => (
              <div
                key={module.id}
                className={`flex-1 h-2 rounded-full ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600">
              步骤 {currentStep + 1} / {visibleModules.length}
            </span>
            <span className="text-sm font-medium">
              {visibleModules[currentStep]?.title}
            </span>
          </div>
        </div>
      </div>

      {/* 主体内容区域 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 当前步骤的表单内容 */}
            {visibleModules[currentStep] && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-2">
                  {visibleModules[currentStep].title}
                </h2>
                {visibleModules[currentStep].description && (
                  <p className="text-gray-600 mb-6">
                    {visibleModules[currentStep].description}
                  </p>
                )}

                {/* 渲染所有 sections */}
                {visibleModules[currentStep].sections.map((section) => (
                  <div key={section.id} className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                      {section.title}
                    </h3>
                    {section.description && (
                      <p className="text-sm text-gray-600 mb-4">
                        {section.description}
                      </p>
                    )}

                    {/* 渲染所有 fieldGroups */}
                    {section.fieldGroups.map((group) => (
                      <div key={group.id} className="mb-6">
                        {group.title && (
                          <h4 className="text-md font-medium mb-3">{group.title}</h4>
                        )}
                        <div className="space-y-4">
                          {group.fields.map((field) => renderField(field))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* 验证错误提示 */}
            {validationError && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md shadow-sm">
                <div className="flex items-start">
                  <span className="text-red-500 text-xl mr-3">⚠</span>
                  <div>
                    <p className="text-red-800 font-medium text-sm mb-1">请完善必填信息</p>
                    <p className="text-red-700 text-sm">{validationError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 底部操作栏 */}
            <div className="mt-6 mb-8 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ← 上一步
              </button>

              <div className="flex flex-col items-end gap-2">
                {/* 必填项提示 */}
                {!isCurrentStepValid && missingRequiredFields.length > 0 && (
                  <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
                    <span className="font-medium">还需填写：</span>
                    {missingRequiredFields.join('、')}
                  </div>
                )}

                <div className="flex gap-4">
                {onSave && (
                  <button
                    type="button"
                    onClick={async () => {
                      setIsSaving(true);
                      const data = getValues();
                      await onSave(data);
                      setLastSaved(new Date());
                      setIsSaving(false);
                      setShowSaveSuccess(true);
                      setTimeout(() => setShowSaveSuccess(false), 2000);
                    }}
                    disabled={isSaving}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
                    title="快捷键: Ctrl+S (Mac: Cmd+S)"
                  >
                    {isSaving ? '💾 保存中...' : '💾 保存草稿'}
                  </button>
                )}

                {currentStep < visibleModules.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isCurrentStepValid}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-medium shadow-sm"
                  >
                    下一步 →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isCurrentStepValid}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-medium shadow-sm"
                  >
                    ✓ 提交表单
                  </button>
                )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
