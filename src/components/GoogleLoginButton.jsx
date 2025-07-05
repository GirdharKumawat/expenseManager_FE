import { useEffect } from 'react';
import { CLIENT_ID } from '../key';
import  axiosAPI  from '../axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading, setIsAuthenticated, setUser } from '../features/auth/authSlice';
import { toast } from 'sonner';

function GoogleLoginButton() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  useEffect(() => {
    if (!window.google || !window.google.accounts) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
  document.getElementById('google-btn'),
  {
    theme: 'outline',
    size: 'large',
    shape: 'rectangular',
    text: 'continue_with',
    logo_alignment: 'center', // optional: aligns logo to the left
    width: 290              // optional: override width for consistency
  }
);

  }, []);

  const handleCredentialResponse = async (response) => {
    const idToken = response.credential;

    try {
      dispatch(setLoading(true));
      const res = await axiosAPI.post('api/auth/google/', { id_token: idToken });

      // Update Redux state with user data
      dispatch(setIsAuthenticated(true));
      
      toast.success("Google login successful", {
        description: "You have successfully logged in with Google.",
        duration: 3000
      });

      navigate('/');
    } catch (error) {
      dispatch(setIsAuthenticated(false));
      toast.error("Google login failed", {
        description: error.response?.data?.message || "Authentication failed",
        duration: 3000
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex justify-center  w-full">
      <div id="google-btn"></div>
    </div>
  );
}

export default GoogleLoginButton;
