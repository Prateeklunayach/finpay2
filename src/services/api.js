const BASE_URL = 'http://localhost:5004';

export const registerUser = async (userData) => {
  try {
    // Remove any fingerprint-related data from the registration
    const { fingerprintHash, ...registrationData } = userData;
    
    console.log('Sending registration request with data:', registrationData);
    const response = await fetch(`${BASE_URL}/api/users/register`, {
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
    // Convert the credential data to a string format
    const fingerprintPayload = {
      userId: userId,
      fingerprintData: JSON.stringify({
        credentialId: fingerprintData.credentialId,
        attestationObject: fingerprintData.attestationObject,
        clientDataJSON: fingerprintData.clientDataJSON,
        type: fingerprintData.type
      })
    };

    console.log('Sending fingerprint registration data:', fingerprintPayload);
    
    const response = await fetch(`${BASE_URL}/api/users/register-fingerprint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(fingerprintPayload),
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

export const createWalletOrder = async (userId, amount) => {
  const response = await fetch(`${BASE_URL}/api/wallet/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, amount })
  });
  if (!response.ok) {
    throw new Error('Failed to create wallet order');
  }
  return response.json();
};

export const getWalletBalance = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/wallet/balance/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch wallet balance');
  }
  return response.json();
};

export const verifyPayment = async (paymentData) => {
  const response = await fetch(`${BASE_URL}/api/payment/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData)
  });
  if (!response.ok) {
    throw new Error('Payment verification failed');
  }
  return response.json();
};

export const verifyFingerprintRequest = async (verificationData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/request-money/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(verificationData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Fingerprint verification failed');
    }

    return response.json();
  } catch (error) {
    console.error('Error in verifyFingerprintRequest:', error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    }
    throw error;
  }
};

export const getBiometricChallenge = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/biometric/challenge`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
      mode: 'cors'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get biometric challenge');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in getBiometricChallenge:', error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    }
    throw error;
  }
};

export const verifyBiometric = async (assertionResponse) => {
  const response = await fetch(`${BASE_URL}/api/auth/biometric/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(assertionResponse)
  });

  if (!response.ok) {
    throw new Error('Biometric verification failed');
  }

  return response.json();
};

export const processRazorpayPayout = async (payoutData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/payout/razorpay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(payoutData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Payout processing failed');
    }

    return response.json();
  } catch (error) {
    console.error('Error in processRazorpayPayout:', error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    }
    throw error;
  }
}; 