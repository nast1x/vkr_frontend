export interface University {
  idUniversity: number;
  shortName: string;
  city: string;
  // Поля для админки и детального просмотра
  name?: string;
  description?: string;
  imageLink?: string;
  // Поля для публичного списка ВУЗов
  athletesCount?: number;
  coachesCount?: number;
}
