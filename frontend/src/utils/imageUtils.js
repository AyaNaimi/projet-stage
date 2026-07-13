const getApiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  return 'http://localhost:8000';
};

export const resolveImageUrl = (value, fallback = '') => {
  if (typeof value !== 'string') {
    return fallback || '';
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback || '';
  }

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return `${getApiBaseUrl()}${trimmed}`;
  }

  if (trimmed.startsWith('storage/')) {
    return `${getApiBaseUrl()}/${trimmed}`;
  }

  if (trimmed.startsWith('public/')) {
    return `${getApiBaseUrl()}/storage/${trimmed.replace(/^public\//, '')}`;
  }

  return `${getApiBaseUrl()}/${trimmed}`;
};
