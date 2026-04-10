export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',

  ENDPOINTS: {
    // ===== АУТЕНТИФИКАЦИЯ =====
    AUTH_REGISTER: '/api/auth/register',
    AUTH_LOGIN: '/api/auth/login',
    AUTH_REFRESH: '/api/auth/refresh',
    AUTH_LOGOUT: '/api/auth/logout',

    // ===== ПОЛЬЗОВАТЕЛИ =====
    PROFILE_ME: '/api/users/profile/me',
    PROFILE_BY_ID: '/api/users/profile',

    // ===== СТАРЫЕ ЭНДПОИНТЫ (не изменены) =====
    UNIVERSITY_STATS: '/api/ref/university/stats',
    UNIVERSITY: '/api/ref/university',
    TEAM: '/api/users/team',
    COMPETITIONS: '/api/competitions/list',
    SPORT_FACILITIES: '/api/ref/sport-facilities/list',
    STATISTICS: '/api/statistics',
    PROFILE: '/api/users/profile',
  }
};

// Полный URL для запросов
export const API_URLS = {
  // ===== АУТЕНТИФИКАЦИЯ =====
  AUTH_REGISTER: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_REGISTER}`,
  AUTH_LOGIN: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_LOGIN}`,
  AUTH_REFRESH: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_REFRESH}`,
  AUTH_LOGOUT: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_LOGOUT}`,

  // ===== ПОЛЬЗОВАТЕЛИ =====
  PROFILE_ME: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE_ME}`,
  PROFILE_BY_ID: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE_BY_ID}`,

  // ===== СТАРЫЕ ЭНДПОИНТЫ (не изменены) =====
  UNIVERSITY_STATS: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UNIVERSITY_STATS}`,
  UNIVERSITY: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UNIVERSITY}`,
  TEAM: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEAM}`,
  COMPETITIONS: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMPETITIONS}`,
  SPORT_FACILITIES: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPORT_FACILITIES}`,
  STATISTICS: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STATISTICS}`,
  PROFILE: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`,
};
