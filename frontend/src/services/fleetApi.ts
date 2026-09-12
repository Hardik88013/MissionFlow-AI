export const fleetApi = {
  getFleet: async () => {
    // return fetch('/api/fleet').then(res => res.json())
    return [
      { vehicle_id: 'V-001', status: 'healthy', health_score: 95, mileage: 12000, type: 'Truck' },
      { vehicle_id: 'V-002', status: 'attention', health_score: 65, mileage: 85000, type: 'Van' },
      { vehicle_id: 'V-003', status: 'critical', health_score: 25, mileage: 145000, type: 'Heavy' }
    ];
  },
  getVehicle: async (id: string) => {
    return { vehicle_id: id, status: 'healthy', health_score: 95, mileage: 12000, type: 'Truck' };
  }
};
