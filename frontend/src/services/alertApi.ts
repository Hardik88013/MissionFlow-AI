export const alertApi = {
  getAlerts: async () => {
    return [
      { alert_id: 'A-001', vehicle_id: 'V-003', type: 'critical', message: 'Engine failure predicted in <500 miles', status: 'active' },
      { alert_id: 'A-002', vehicle_id: 'V-002', type: 'warning', message: 'Tire pressure low', status: 'active' }
    ];
  }
};
