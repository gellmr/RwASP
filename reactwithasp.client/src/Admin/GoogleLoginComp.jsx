import { useGoogleLogin } from '@react-oauth/google';
import Button from 'react-bootstrap/Button';

const GoogleLoginComp = () =>
{
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      debugger;
      console.log(tokenResponse);
    },
    onError: (error) => {
      debugger;
      console.log('Login Failed:', error);
    }
  });
  return (
    <>
      <Button variant="success" onClick={() => login()}>Sign in with Google</Button>
    </>
  );
};
export default GoogleLoginComp;