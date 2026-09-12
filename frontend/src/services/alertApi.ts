export const alertApi = {
  getAlerts: async () => {
    const res = await fetch('http://localhost:8000/alerts/');
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },
  resolveAlert: async (id: string) => {
    const res = await fetch(`http://localhost:8000/alerts/${id}/resolve`, {
      method: 'PUT'
    });
    if (!res.ok) throw new Error('Failed to resolve alert');
    return res.json();
  }
};
