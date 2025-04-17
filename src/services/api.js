const API_BASE_URL = 'https://da18cb3d-90d8-4e21-b63e-19d719f06fcf-00-321o5acwph97q.sisko.replit.dev:3001/';

export const registerUser = async (userData) => {
  try {
    // Remove any fingerprint-related data from the registration
    const { fingerprintHash, ...registrationData } = userData;
    
    console.log('Sending registration request with data:', registrationData);
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(registrationData),
      mode: 'cors',
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }
    
    // Ensure we have a user ID in the response
    if (!data.userId) {
      throw new Error('Registration successful but no user ID received');
    }
    
    return {
      success: true,
      userId: data.userId,
      message: 'Registration successful'
    };
  } catch (error) {
    console.error('Error details:', error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    }
    throw error;
  }
};

export const registerFingerprint = async (userId, fingerprintData) => {
  try {
    console.log('Registering fingerprint for user:', userId);
    const response = await fetch(`${API_BASE_URL}/api/users/register-fingerprint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        userId,
        fingerprintData,
      }),
      mode: 'cors',
    });
    
    const data = await response.json();
    console.log('Fingerprint registration response:', data);
    
    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }
    
    return {
      success: true,
      message: 'Fingerprint registered successfully'
    };
  } catch (error) {
    console.error('Error registering fingerprint:', error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    }
    throw error;
  }
}; 