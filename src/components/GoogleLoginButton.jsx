import { useEffect } from 'react';
import { CLIENT_ID } from '../key';
import  axiosAPI  from '../axios';
import { useNavigate } from 'react-router';

function GoogleLoginButton() {
    const nevigate = useNavigate
  useEffect(() => {
    if (!window.google || !window.google.accounts) {
      console.error('Google Identity script not loaded');
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
      const res = await axiosAPI.post('api/auth/google/', { id_token: idToken });

      console.log('✅ Login successful:', res.data);


    } catch (error) {
      console.error('❌ Login failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex justify-center  w-full">
      <div id="google-btn"></div>
    </div>
  );
}

export default GoogleLoginButton;
