export type FieldType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'time' 
  | 'textarea' 
  | 'radio' 
  | 'checkbox' 
  | 'select';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: FieldOption[];
  placeholder?: string;
  validation?: any;
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormSchema {
  formId: string;
  title: string;
  version: string;
  sections: FormSection[];
}
