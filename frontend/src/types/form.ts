// 表单字段类型定义
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'time'
  | 'datetime'
  | 'radio'
  | 'checkbox'
  | 'checkbox-group'
  | 'select';

// 条件显示操作符
export type ConditionalOperator = 'equals' | 'notEquals' | 'in' | 'notIn';

// 条件显示逻辑
export interface ConditionalLogic {
  field: string;
  operator: ConditionalOperator;
  value: string | string[];
}

// 字段选项
export interface FieldOption {
  value: string;
  label: string;
}

// 验证规则
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

// 表单字段定义
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  unit?: string; // 用于数字字段的单位（如 cm, kg, mmHg）
  validation?: ValidationRule;
  helpText?: string; // 字段帮助提示
  visibleWhen?: ConditionalLogic; // 字段级别的条件显示
  allowCustom?: boolean; // 用于 select 字段，允许自定义输入
}

// 字段分组
export interface FieldGroup {
  id: string;
  title?: string;
  fields: FormField[];
  layout?: 'vertical' | 'horizontal' | 'grid'; // 布局方式
  columns?: number; // grid 布局时的列数
}

// 表单区块（Section）
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fieldGroups: FieldGroup[];
  visibleWhen?: ConditionalLogic; // 区块级别的条件显示
}

// 表单模块（Module）
export interface FormModule {
  id: string;
  title: string;
  description?: string;
  sections: FormSection[];
  visibleWhen?: ConditionalLogic; // 模块级别的条件显示
}

// 完整表单 Schema
export interface FormSchema {
  formId: string;
  title: string;
  version: string;
  description?: string;
  modules: FormModule[];
}

// 表单数据类型
export type FormData = Record<string, any>;

// 病例状态
export type CaseStatus = 'draft' | 'submitted';

// 病例数据
export interface CaseData {
  id: string;
  userId: string;
  status: CaseStatus;
  formData: FormData;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}
