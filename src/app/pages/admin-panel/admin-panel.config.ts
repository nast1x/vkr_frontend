import {FormField} from '../../models/form.model';
import {API_URLS} from "../../config/api.config";

export const ROLES_CONFIG = [
  {value: 1, label: 'Admin'},
  {value: 2, label: 'User'},
  {value: 3, label: 'Coach'},
  {value: 4, label: 'Athlete'}
];

export const MAJOR_FORM_FIELDS: FormField[] = [
  {name: 'name', label: 'Название специальности', type: 'text', required: true},
  {name: 'code', label: 'Код специальности (напр. 09.03.01)', type: 'text', required: true},
  {name: 'description', label: 'Описание', type: 'textarea'}
];

export const UNIVERSITY_FORM_FIELDS: FormField[] = [
  {name: 'name', label: 'Полное название ВУЗа', type: 'text', required: true},
  {name: 'shortName', label: 'Аббревиатура', type: 'text', required: true},
  {name: 'city', label: 'Город', type: 'text', required: true},
  {name: 'description', label: 'Описание', type: 'textarea'},
  {name: 'imageLink', label: 'Ссылка на фото', type: 'text'}
];

export const SPORT_TYPE_FORM_FIELDS: FormField[] = [
  {name: 'name', label: 'Название вида спорта', type: 'text', required: true},
  {name: 'description', label: 'Описание', type: 'textarea'}
];

export const SPORT_RANK_FORM_FIELDS: FormField[] = [
  {name: 'name', label: 'Название разряда', type: 'text', required: true},
  {name: 'description', label: 'Описание', type: 'textarea'}
];

export const EDUCATION_PLACE_FORM_FIELDS: FormField[] = [
  {name: 'userId', label: 'ID Пользователя', type: 'number', required: true},
  {name: 'roleId', label: 'Роль пользователя', type: 'select', options: ROLES_CONFIG, required: true},
  {name: 'universityId', label: 'ID ВУЗа', type: 'number', required: true},
  {name: 'majorId', label: 'ID Специальности', type: 'number', required: true},
  {name: 'courseYear', label: 'Курс (от 0 до 6)', type: 'number', required: true}
];

export const ACHIEVEMENT_FORM_FIELDS: FormField[] = [
  {name: 'userId', label: 'ID Пользователя', type: 'number', required: true},
  {name: 'sportTypeId', label: 'ID Вида спорта', type: 'number', required: true},
  {name: 'sportRankId', label: 'ID Разряда', type: 'number', required: true},
  {name: 'dateReceived', label: 'Дата получения', type: 'date', required: true}
];

export interface AdminTabConfig {
  titleName: string;
  idKey: string;
  apiUrl: string;
  fields: FormField[];
  dataKey: 'majors' | 'universities' | 'sportTypes' | 'sportRanks' | 'educationPlaces' | 'achievements';
}

export const ADMIN_TABS_CONFIG: Record<string, AdminTabConfig> = {
  'majors': {
    titleName: 'специальность',
    idKey: 'idMajor',
    apiUrl: API_URLS.MAJOR,
    fields: MAJOR_FORM_FIELDS,
    dataKey: 'majors'
  },
  'universities': {
    titleName: 'ВУЗ',
    idKey: 'idUniversity',
    apiUrl: API_URLS.UNIVERSITY,
    fields: UNIVERSITY_FORM_FIELDS,
    dataKey: 'universities'
  },
  'sport-types': {
    titleName: 'вид спорта',
    idKey: 'idSportType',
    apiUrl: API_URLS.SPORT_TYPE,
    fields: SPORT_TYPE_FORM_FIELDS,
    dataKey: 'sportTypes'
  },
  'sport-ranks': {
    titleName: 'разряд',
    idKey: 'idSportRank',
    apiUrl: API_URLS.SPORT_RANK,
    fields: SPORT_RANK_FORM_FIELDS,
    dataKey: 'sportRanks'
  },
  'education-places': {
    titleName: 'место обучения',
    idKey: 'idEducationPlace',
    apiUrl: API_URLS.EDUCATION_PLACE,
    fields: EDUCATION_PLACE_FORM_FIELDS,
    dataKey: 'educationPlaces'
  },
  'achievements': {
    titleName: 'достижение',
    idKey: 'idAchievement',
    apiUrl: API_URLS.ACHIEVEMENT,
    fields: ACHIEVEMENT_FORM_FIELDS,
    dataKey: 'achievements'
  }
};
