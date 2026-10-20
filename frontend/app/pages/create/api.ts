const BASE_URL = 'http://localhost:8080/api/area/service';
const token = localStorage.getItem('token');

const checkToken = () => {
  if (!token) {
    console.error('No token found');
    throw new Error('No token found');
  }
};

export const addArea = async (
  action: { service: string; method: string; params: Record<string, any> },
  reaction: { service: string; method: string; params: Record<string, any> }
): Promise<boolean> => {
  checkToken();

  try {
    const response = await fetch('http://localhost:8080/api/area/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ action, reaction }),
    });

    const result = await response.json();
    if (result.success) {
      console.log("Area added successfully:", result);
      return true; 
    } else {
      console.error('Failed to add area:', result);
      return false;
    }
  } catch (error) {
    console.error('Error adding area:', error);
    return false;
  }
};

export const fetchServices = async (): Promise<string[]> => {
  checkToken();

  try {
    const response = await fetch('http://localhost:8080/api/area/services', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (result.success) {
      return result.data; 
    } else {
      console.error('Failed to fetch services:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const fetchActions = async (service: string): Promise<string[]> => {
  checkToken();

  try {
    const response = await fetch(`${BASE_URL}/${service}/actions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (result.success) {
      return result.data; 
    } else {
      console.error('Failed to fetch actions:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching actions:', error);
    return [];
  }
};

export const fetchReactions = async (service: string): Promise<string[]> => {
  checkToken();

  try {
    const response = await fetch(`${BASE_URL}/${service}/reactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (result.success) {
      return result.data; 
    } else {
      console.error('Failed to fetch reactions:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return [];
  }
};

export const fetchMethodParams = async (service: string, method: string): Promise<string[]> => {
  checkToken();

  try {
    const response = await fetch(`http://localhost:8080/api/area/service/${service}/${method}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (result.success && result.data) {
      return Object.keys(result.data);
    } else {
      console.error('Failed to fetch method params:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching method params:', error);
    return [];
  }
};

export const fetchAreas = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/area", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch areas:", error);
    return [];
  }
};

export const fetchAreaById = async (areaId: string) => {
  try {
    const response = await fetch(`http://localhost:8080/api/area/${areaId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch area by ID:", response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching area by ID:", error);
    return null;
  }
};

export const deleteAreaById = async (areaId: string) => {
  try {
    const response = await fetch(`http://localhost:8080/api/area/${areaId}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      console.log("Area deleted successfully:", areaId);
      return true;
    } else {
      console.error("Failed to delete area:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error deleting area:", error);
    return false;
  }
};
