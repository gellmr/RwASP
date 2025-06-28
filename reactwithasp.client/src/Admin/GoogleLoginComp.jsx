import { useGoogleLogin } from '@react-oauth/google';
import Button from 'react-bootstrap/Button';

const GoogleLoginComp = () =>
{
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Success logging in with Google OAuth 2.0 Client. Received token...");
      console.log(tokenResponse);
    },
    onError: (error) => {
      console.log('Failed logging in with Google OAuth 2.0 Client. Error: ', error);
    }
  });
  return (
    <>
      <Button variant="success" onClick={() => login()}>Sign in with Google</Button>
    </>
  );
};
export default GoogleLoginComp;