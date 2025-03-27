const API_URL = 'http://localhost:5001/api';

export const getTravelPlan = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token');
    }
    
    const response = await fetch(`${API_URL}/travel-plans`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch travel plan: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching travel plan:', error);
    throw error;
  }
};

export const saveTravelPlan = async (travelData) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token');
    }
    
    const response = await fetch(`${API_URL}/travel-plans`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(travelData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save travel plan');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving travel plan:', error);
    throw error;
  }
};