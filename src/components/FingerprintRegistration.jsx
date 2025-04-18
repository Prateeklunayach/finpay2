import { useState } from 'react';
import { registerFingerprint } from '../services/api';

const FingerprintRegistration = ({ userId, onSuccess }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fingerprintData, setFingerprintData] = useState(null);

  const createPasskey = async () => {
    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        throw new Error('WebAuthn is not supported in this browser');
      }

      // Generate a random challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Create the credentials
      const publicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: 'FinPay Authentication',
          id: window.location.hostname
        },
        user: {
          id: Uint8Array.from(userId, c => c.charCodeAt(0)),
          name: userId,
          displayName: 'FinPay User'
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },   // ES256
          { alg: -257, type: 'public-key' }  // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          requireResidentKey: true,
          userVerification: 'required'
        },
        timeout: 60000,
        attestation: 'direct'
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      if (!credential) {
        throw new Error('Failed to create passkey');
      }

      // Convert credential to something we can send to server
      const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
      const attestationObject = btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject)));
      const clientDataJSON = btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON)));

      const fingerprintData = {
        credentialId,
        attestationObject,
        clientDataJSON,
        type: credential.type
      };

      return fingerprintData;
    } catch (error) {
      console.error('Error creating passkey:', error);
      throw error;
    }
  };

  const handleFingerprintScan = async () => {
    setError('');
    setLoading(true);
    
    try {
      // Create passkey and get fingerprint data
      const fingerprintData = await createPasskey();
      setFingerprintData(fingerprintData);
      
      console.log('Fingerprint data captured:', fingerprintData);
      console.log('Attempting to register fingerprint for user:', userId);
      
      const response = await registerFingerprint(userId, fingerprintData);
      
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
      } else if (err.message.includes('data')) {
        setError('Error processing fingerprint data. Please try again.');
      } else {
        setError(err.message || 'An error occurred during fingerprint registration');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl">
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-20 blur-xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-block p-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-6 shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-pink-500/25">
              <svg className="w-16 h-16 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 text-shadow">Set Up Fingerprint Authentication</h2>
            <p className="text-white/80">Secure your account with biometric authentication</p>
          </div>

          {/* User ID Display */}
          <div className="mb-6 p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl transform hover:scale-102 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-200">Your Account ID</p>
                <p className="mt-1 font-mono text-lg font-bold text-white">{userId}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-900/20 backdrop-blur-lg border-l-4 border-red-500 rounded-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="ml-3 text-red-200 font-medium">{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-900/20 backdrop-blur-lg border-l-4 border-green-400 rounded-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-green-200 font-medium">Fingerprint registered successfully!</p>
                  <p className="text-sm text-green-300/80 mt-1">Your passkey has been created and registered.</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How it works
              </h3>
              <ul className="space-y-4">
                {[
                  "Click the button below to start the registration process",
                  "Use your device's security features (Touch ID, Face ID, or Windows Hello)",
                  "Your fingerprint will be securely stored and used for future authentication"
                ].map((text, index) => (
                  <li key={index} className="flex items-start transform hover:translate-x-2 transition-transform duration-200">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 rounded-full shadow-lg">
                      <span className="text-white font-semibold">{index + 1}</span>
                    </div>
                    <span className="ml-4 text-white/80">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleFingerprintScan}
              disabled={loading || success}
              className="w-full flex justify-center py-4 px-6 rounded-xl text-base font-medium text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-pink-500/25 border border-white/20"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Passkey...
                </span>
              ) : success ? (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Passkey Created
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Create Passkey
                </span>
              )}
            </button>

            <div className="text-center bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 shadow-xl">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-pink-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-sm font-medium text-pink-200">Security Notice</p>
              </div>
              <p className="text-sm text-white/70">
                This process uses your device's built-in security features. No fingerprint data is stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FingerprintRegistration; 