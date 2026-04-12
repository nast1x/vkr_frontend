export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'password';
  options?: { value: any; label: string }[];
  required?: boolean;
}
