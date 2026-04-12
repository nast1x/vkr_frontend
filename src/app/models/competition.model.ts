export interface Venue {
  id: number;
  name: string;
  address: string;
  photo: string;
}

export interface BestResult {
  athleteId: number;
  athleteName: string;
  athleteAvatar: string;
  university: string;
  discipline: string;
  result: string;
}

export interface ProtocolEntry {
  athleteId: number;
  athleteName: string;
  university: string;
  result: string;
  rankPlace: number;
}

export interface Protocol {
  discipline: string;
  type: string;
  results: ProtocolEntry[];
}

export interface Competition {
  idCompetition: number;
  name: string;
  city: string;
  startDate: string;
  endDate: string | null;
  competitionLevel: string;
  sportType: string;
  venue: Venue;
  organizer: string;
  bestResults: BestResult[];
  protocols: Protocol[];
}
