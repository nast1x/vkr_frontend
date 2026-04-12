import { FormField } from '../../models/form.model';

export const ROLES_CONFIG = [
  { value: 1, label: 'Admin' },
  { value: 2, label: 'User' },
  { value: 3, label: 'Coach' },
  { value : 4, label: 'Athlete' }
];

export const MAJOR_FORM_FIELDS: FormField[] = [
  { name: 'name', label: 'Название специальности', type: 'text', required: true },
  { name: 'code', label: 'Код специальности (напр. 09.03.01)', type: 'text', required: true },
  { name: 'description', label: 'Описание', type: 'textarea' }
];

export const UNIVERSITY_FORM_FIELDS: FormField[] = [
  { name: 'name', label: 'Полное название ВУЗа', type: 'text', required: true },
  { name: 'shortName', label: 'Аббревиатура', type: 'text', required: true },
  { name: 'city', label: 'Город', type: 'text', required: true },
  { name: 'description', label: 'Описание', type: 'textarea' },
  { name: 'imageLink', label: 'Ссылка на фото', type: 'text' }
];

export const SPORT_TYPE_FORM_FIELDS: FormField[] = [
  { name: 'name', label: 'Название вида спорта', type: 'text', required: true },
  { name: 'description', label: 'Описание', type: 'textarea' }
];

export const SPORT_RANK_FORM_FIELDS: FormField[] = [
  { name: 'name', label: 'Название разряда', type: 'text', required: true },
  { name: 'description', label: 'Описание', type: 'textarea' }
];

export const EDUCATION_PLACE_FORM_FIELDS: FormField[] = [
  { name: 'userId', label: 'ID Пользователя', type: 'number', required: true },
  { name: 'roleId', label: 'Роль пользователя', type: 'select', options: ROLES_CONFIG, required: true },
  { name: 'universityId', label: 'ID ВУЗа', type: 'number', required: true },
  { name: 'majorId', label: 'ID Специальности', type: 'number', required: true },
  { name: 'courseYear', label: 'Курс (от 0 до 6)', type: 'number', required: true }
];

export const ACHIEVEMENT_FORM_FIELDS: FormField[] = [
  { name: 'userId', label: 'ID Пользователя', type: 'number', required: true },
  { name: 'sportTypeId', label: 'ID Вида спорта', type: 'number', required: true },
  { name: 'sportRankId', label: 'ID Разряда', type: 'number', required: true },
  { name: 'dateReceived', label: 'Дата получения', type: 'date', required: true }
];
