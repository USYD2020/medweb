export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'user' | 'admin';
  status: 'pending' | 'active' | 'rejected' | 'disabled';
  hospital?: string;
  department?: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'date' | 'time' | 'radio' | 'checkbox' | 'select' | 'textarea';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
  visibleWhen?: {
    field: string;
    operator: 'equals' | 'notEquals';
    value: string;
  };
}

export interface FormSchema {
  formId: string;
  title: string;
  version: string;
  sections: FormSection[];
}
