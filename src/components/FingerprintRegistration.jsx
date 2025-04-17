import { useState } from 'react';
import { registerFingerprint } from '../services/api';

const FingerprintRegistration = ({ userId, onSuccess }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fingerprintData, setFingerprintData] = useState(null);

  const handleFingerprintScan = async () => {
    setError('');
    setLoading(true);
    
    try {
      // Check if the device has a fingerprint sensor
      if (!navigator.credentials || !navigator.credentials.get) {
        throw new Error('Fingerprint sensor not detected on this device');
      }

      // Request fingerprint data from the sensor
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          rpId: window.location.hostname,
          allowCredentials: [],
          userVerification: 'required',
          timeout: 60000,
        }
      });

      // Get the raw fingerprint data
      const fingerprintHash = credential.response.authenticatorData;
      setFingerprintData(fingerprintHash);
      
      console.log('Fingerprint data captured:', fingerprintHash);
      console.log('Attempting to register fingerprint for user:', userId);
      
      const response = await registerFingerprint(userId, fingerprintHash);
      
      if (response.success) {
        setSuccess(true);
        onSuccess(); // Notify parent component of success
      } else {
        setError(response.message || 'Fingerprint registration failed');
      }
    } catch (err) {
      console.error('Fingerprint registration error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Fingerprint scan was cancelled or not authorized');
      } else if (err.name === 'NotSupportedError') {
        setError('Fingerprint sensor is not supported on this device');
      } else {
        setError(err.message || 'An error occurred during fingerprint registration');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Fingerprint Registration</h2>
      
      {/* User ID Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Your User ID:</p>
        <p className="font-mono text-lg font-bold text-gray-800">{userId}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          <p className="font-bold">Fingerprint registered successfully!</p>
          <p className="text-sm mt-1">Your fingerprint hash: {fingerprintData?.slice(0, 20)}...</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="text-center">
          <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">
            Please place your finger on your laptop's fingerprint sensor to register your fingerprint.
          </p>
          <p className="text-sm text-gray-500">
            Make sure your finger covers the entire sensor area.
          </p>
        </div>

        <button
          onClick={handleFingerprintScan}
          disabled={loading || success}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Scanning...
            </span>
          ) : success ? (
            'Fingerprint Registered'
          ) : (
            'Scan Fingerprint'
          )}
        </button>
      </div>
    </div>
  );
};

export default FingerprintRegistration; 