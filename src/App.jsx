import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegistrationForm from './components/RegistrationForm'
import FingerprintRegistration from './components/FingerprintRegistration'

function App() {
  const [userId, setUserId] = useState(null)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [userData, setUserData] = useState(null)

  const handleRegistrationSuccess = (id, data) => {
    setUserId(id)
    setUserData(data)
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
                User Registration System
              </h1>
              
              {!userId ? (
                <RegistrationForm onSuccess={handleRegistrationSuccess} />
              ) : !registrationComplete ? (
                <FingerprintRegistration 
                  userId={userId}
                  userData={userData}
                  onSuccess={() => setRegistrationComplete(true)} 
                />
              ) : (
                <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
                  <h2 className="text-2xl font-bold mb-4">Registration Complete!</h2>
                  <p className="text-gray-600">
                    Your account has been successfully created and your fingerprint has been registered.
                  </p>
                </div>
              )}
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
