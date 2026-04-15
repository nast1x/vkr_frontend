export interface GeneralStats {
  totalAthletes: number;
  totalCoaches: number;
  totalUniversities: number;
  totalCompetitions: number;
}

export interface UniversityRanking {
  id?: number;
  name: string;
  city: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export interface AthleteRanking {
  id: number;
  name: string;
  avatar: string;
  university: string;
  sport: string;
  medals: number;
  competitions: number;
}

export interface SportStatistics {
  name: string;
  athletes: number;
  competitions: number;
  facilities: number;
  percentage: number;
}

export interface CityStatistics {
  name: string;
  athletes: number;
  competitions: number;
  total: number;
}

export interface Statistics {
  generalStats: GeneralStats;
  topUniversities: UniversityRanking[];
  topAthletes: AthleteRanking[];
  sportsStatistics: SportStatistics[];
  cityStatistics: CityStatistics[];
}
