import type { User } from '../types';

const API_BASE = 'http://localhost:5000/api/auth';

const parseJson = async (response: Response) => {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.error ||
      payload?.message ||
      response.statusText ||
      'Request failed';

    throw new Error(String(message));
  }

  return payload;
};

export const authService = {
  me: async (): Promise<User> => {
    const payload = await parseJson(
      await fetch(`${API_BASE}/me`, {
        credentials: 'include',
      })
    );

    return {
      studentId: Number(payload.student_id ?? 0),
      name: payload.student_name ?? 'סטודנט',
      classId: Number(payload.class_id ?? 0),
    };
  },

  login: async (payload: { id: string; password: string; rememberMe: boolean }) => {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_name: payload.id,
        password: payload.password,
      }),
    });

    const result = await parseJson(response);

    // Check for authentication failure
    if (result === 'NONE' || result?.error === 'NONE') {
      throw new Error('Invalid username or password');
    }

    return { success: true };
  },

  logout: async (): Promise<void> => {
    const response = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  },
};