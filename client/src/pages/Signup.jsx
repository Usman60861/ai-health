// Signup is now combined with Login in the AuthPage component
// This redirect ensures /signup route opens the auth page with signup panel active
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login', { replace: true, state: { openSignup: true } });
  }, [navigate]);
  return null;
}
