import { useState, useEffect } from 'react';
import { verifyFingerprintRequest, getBiometricChallenge, processRazorpayPayout } from '../services/api';

const RequestMoneyForm = ({ onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [platformAuthInfo, setPlatformAuthInfo] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Load user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    // Check platform authenticator availability
    const checkPlatformAuthenticator = async () => {
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        console.log('Platform authenticator available:', available);
        
        if (available) {
          const supportedPubKeyParams = [
            {
              type: "public-key",
              alg: -7 // ES256 algorithm
            },
            {
              type: "public-key",
              alg: -257 // RS256 algorithm
            }
          ];
          
          setPlatformAuthInfo({
            available: true,
            supportedPubKeyParams
          });
        }
      } catch (err) {
        console.error('Error checking platform authenticator:', err);
        setError('Failed to initialize fingerprint scanner');
      }
    };

    checkPlatformAuthenticator();
  }, []);

  const handleRequestMoney = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!platformAuthInfo?.available) {
      setError('Fingerprint scanner not available on this device');
      return;
    }

    if (!userData) {
      setError('User data not found. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get challenge from server
      const { challenge } = await getBiometricChallenge();
      
      // Configure authentication options
      const authOptions = {
        publicKey: {
          challenge: Uint8Array.from(challenge),
          rpId: window.location.hostname,
          allowCredentials: [],
          userVerification: 'required',
          timeout: 60000
        }
      };

      // Trigger fingerprint scan
      console.log('Initiating fingerprint scan...');
      const credential = await navigator.credentials.get(authOptions);
      
      console.log('Fingerprint scan successful:', {
        credentialId: credential.id
      });

      // Prepare verification data
      const verificationData = {
        credential: {
          id: credential.id,
          rawId: Array.from(new Uint8Array(credential.rawId)),
          response: {
            authenticatorData: Array.from(new Uint8Array(credential.response.authenticatorData)),
            clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
            signature: Array.from(new Uint8Array(credential.response.signature))
          },
          type: credential.type,
          clientExtensionResults: credential.getClientExtensionResults()
        },
        amount: parseFloat(amount),
        userId: userData.id
      };

      // Verify fingerprint and process payment
      const verificationResult = await verifyFingerprintRequest(verificationData);
      console.log('Fingerprint verification successful:', verificationResult);

      // Process Razorpay payout
      const payoutData = {
        amount: parseFloat(amount),
        accountNumber: userData.accountNumber,
        ifscCode: userData.ifscCode,
        upiId: userData.upiId,
        userId: userData.id
      };

      const payoutResult = await processRazorpayPayout(payoutData);
      console.log('Payout successful:', payoutResult);

      onSuccess(payoutResult);
      setAmount('');

    } catch (err) {
      console.error('Request money failed:', err);
      setError(err.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">₹</span>
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount to request"
          className="block w-full pl-7 pr-12 py-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleRequestMoney}
        disabled={loading || !platformAuthInfo?.available}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </span>
        ) : (
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10s10-4.477 10-10C20 4.477 15.523 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5S12.99 5 10.5 5zm0 7c-1.38 0-2.5-1.12-2.5-2.5S9.12 7 10.5 7s2.5 1.12 2.5 2.5S11.88 12 10.5 12z" clipRule="evenodd"/>
            </svg>
            Verify with Fingerprint
          </span>
        )}
      </button>

      {!platformAuthInfo?.available && (
        <p className="text-sm text-red-600 text-center">
          Fingerprint scanner not detected on this device
        </p>
      )}

      {platformAuthInfo?.available && (
        <p className="text-xs text-gray-500 text-center">
          Use your laptop's fingerprint scanner to verify
        </p>
      )}
    </div>
  );
};

export default RequestMoneyForm; 