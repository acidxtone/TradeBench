const auth = {
  async me() {
    const res = await fetch('/api/auth/user', { credentials: 'include' });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  async updateMe(data) {
    const res = await fetch('/api/auth/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Update failed');
    return res.json();
  },

  async logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  },

  redirectToLogin() {
    window.location.href = '/auth';
  },
};

const entities = {
  Question: {
    async filter({ year, section }) {
      const params = new URLSearchParams();
      if (year != null) params.set('year', String(year));
      if (section != null) params.set('section', String(section));
      const res = await fetch(`/api/questions?${params.toString()}`);
      if (!res.ok) return [];
      return res.json();
    },
  },

  UserProgress: {
    async filter({ created_by, year }) {
      if (!year) return [];
      try {
        const res = await fetch(`/api/user-progress?year=${year}`, { credentials: 'include' });
        if (!res.ok) return [];
        const data = await res.json();
        if (!data || !data.id) return [];
        return [data];
      } catch {
        return [];
      }
    },

    async create(payload) {
      const res = await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create progress');
      return res.json();
    },

    async update(id, payload) {
      const year = payload._year || payload.year;
      const body = { ...payload, year };
      delete body._year;
      const res = await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to update progress');
      return res.json();
    },

    async delete(id, year) {
      const params = year ? `?year=${year}` : '';
      await fetch(`/api/user-progress${params}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    },
  },
};

const appLogs = {
  logUserInApp() {
    return Promise.resolve();
  },
};

const studyGuides = {
  async getByYear(year) {
    const res = await fetch(`/api/study-guides?year=${year}`);
    if (!res.ok) return [];
    return res.json();
  },
  async getByYearAndSection(year, section) {
    const res = await fetch(`/api/study-guides?year=${year}&section=${section}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data;
  },
};

export const api = {
  auth,
  entities,
  appLogs,
  studyGuides,
};
