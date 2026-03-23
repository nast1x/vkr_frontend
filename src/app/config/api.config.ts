export const API_CONFIG = {
  // Базовый URL бэкенда
  BASE_URL: 'http://localhost:8080',

  // Endpoints
  ENDPOINTS: {
    UNIVERSITY_STATS: '/api/ref/university/stats',
    TEAM: '/api/users/team',
  }
};

export const API_URLS = {
  UNIVERSITY_STATS: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UNIVERSITY_STATS}`,
  TEAM: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEAM}`,
};
