const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getApiRequestConfig = (overrides = {}) => {
  const token =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('token') || window.localStorage.getItem('API_TOKEN')
      : null;

  const config = {
    withCredentials: true,
    ...overrides,
  };

  if (token) {
    config.headers = {
      ...(overrides.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
};

export default API_BASE_URL;
