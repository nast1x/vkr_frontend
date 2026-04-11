import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'password';
  options?: { value: any; label: string }[];
  required?: boolean;
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent implements OnInit {
  @Input() fields: FormField[] = [];
  @Input() initialData: any = null;
  @Input() formTitle: string = 'Редактирование';

  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const group: any = {};

    this.fields.forEach(field => {
      const value = this.initialData ? this.initialData[field.name] : '';
      const validators = field.required ? [Validators.required] : [];

      // Создаем обычный массив для FormBuilder
      group[field.name] = [value, validators];
    });

    // Применяем updateOn: 'blur' ко всей FormGroup разом.
    // Теперь форма будет реагировать и перерисовываться только при потере фокуса с инпута.
    this.form = this.fb.group(group, { updateOn: 'blur' });
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
