export const fleetApi = {
  getFleet: async () => {
    const res = await fetch('http://localhost:8000/fleet/');
    if (!res.ok) throw new Error('Failed to fetch fleet');
    return res.json();
  },
  getVehicle: async (id: string) => {
    const res = await fetch(`http://localhost:8000/fleet/${id}`);
    if (!res.ok) throw new Error('Vehicle not found');
    return res.json();
  },
  createVehicle: async (vehicle: any) => {
    const res = await fetch('http://localhost:8000/fleet/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle)
    });
    if (!res.ok) throw new Error('Failed to create vehicle');
    return res.json();
  },
  updateVehicle: async (id: string, vehicle: any) => {
    const res = await fetch(`http://localhost:8000/fleet/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle)
    });
    if (!res.ok) throw new Error('Failed to update vehicle');
    return res.json();
  },
  deleteVehicle: async (id: string) => {
    const res = await fetch(`http://localhost:8000/fleet/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete vehicle');
    return res.json();
  }
};
