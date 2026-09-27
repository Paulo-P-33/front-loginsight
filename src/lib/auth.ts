const SESSION_KEY = "routemanager.session";

export const MOCK_CREDENTIALS = {
  email: "joao.silva@routemanager.com",
  password: "routemanager123",
};

interface Session {
  name: string;
  email: string;
  loggedInAt: string;
}

function getStorage(remember: boolean): Storage {
  return remember ? window.localStorage : window.sessionStorage;
}

export function login(email: string, password: string, remember: boolean): boolean {
  if (email.trim().toLowerCase() !== MOCK_CREDENTIALS.email || password !== MOCK_CREDENTIALS.password) {
    return false;
  }

  const session: Session = {
    name: "João Silva",
    email: MOCK_CREDENTIALS.email,
    loggedInAt: new Date().toISOString(),
  };

  getStorage(remember).setItem(SESSION_KEY, JSON.stringify(session));
  return true;
}

export function logout(): void {
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(SESSION_KEY) ?? window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
