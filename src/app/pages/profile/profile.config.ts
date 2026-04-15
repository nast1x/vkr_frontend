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

export const RANK_ASSIGNMENT_FIELDS: FormField[] = [
  { name: 'sportTypeId', label: 'Вид спорта', type: 'select', options: [], required: true },
  { name: 'rankId', label: 'Разряд', type: 'select', options: [], required: true },
  { name: 'dateReceived', label: 'Дата присвоения', type: 'date', required: true }
];
