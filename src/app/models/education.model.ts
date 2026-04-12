export interface Major {
  idMajor: number;
  name: string;
  code: string;
  description: string;
}

export interface EducationPlace {
  idEducationPlace: number | null;
  userId: number;
  userName: string;
  roleId: number;
  userRole: string;
  universityId: number | null;
  universityShortName: string;
  universityName?: string;
  majorId: number | null;
  majorCode: string;
  majorName?: string;
  courseYear: number | null;
}
