import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const [authStatus, setAuthStatus] = useState('checking'); // 'checking' | 'authenticated' | 'unauthenticated'

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/capsules`, {
      credentials: "include"
    })
      .then((res) => {
        setAuthStatus(res.ok ? 'authenticated' : 'unauthenticated');
      })
      .catch(() => setAuthStatus('unauthenticated'));
  }, []);

  if (authStatus === 'checking') return <p>Checking session...</p>;
  if (authStatus === 'unauthenticated') return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute
