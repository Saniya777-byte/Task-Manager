const AUTH_KEY = 'task_manager_auth';
const THEME_KEY = 'task_manager_theme';

export const getStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || null;
  } catch {
    return null;
  }
};

export const setStoredAuth = (auth) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getStoredTheme = () => localStorage.getItem(THEME_KEY) || 'light';

export const setStoredTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};
