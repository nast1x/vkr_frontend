import { FormField } from '../../models/form.model';

export const PROFILE_EDIT_FIELDS: FormField[] = [
  {name: 'lastName', label: 'Фамилия', type: 'text', required: true},
  {name: 'firstName', label: 'Имя', type: 'text', required: true},
  {name: 'middleName', label: 'Отчество', type: 'text'},
  {name: 'birthDate', label: 'Дата рождения', type: 'date'},
  {
    name: 'gender', label: 'Пол', type: 'select', required: true, options: [
      {value: 'Male', label: 'Мужской'},
      {value: 'Female', label: 'Женский'}
    ]
  }
];

export const PROFILE_PASSWORD_FIELDS: FormField[] = [
  {name: 'oldPassword', label: 'Текущий пароль', type: 'password', required: true},
  {name: 'password', label: 'Новый пароль', type: 'password', required: true},
  {name: 'confirmPassword', label: 'Повторите новый пароль', type: 'password', required: true}
];
