import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { setLogin } from '@/features/login/loginSlice.jsx'
import { axiosInstance } from '@/axiosDefault.jsx';
import { useNavigate } from "react-router";

const GoogleLoginComp = () =>
{
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function confirmToken(tokenResponse)
  {
    // Pass token to our backend server, for confirmation.
    console.log("Success logging in with Google Sign In. received authorization code...");
    setIsLoading(true);
    const url = window.location.origin + "/api/validate-google-token";
    console.log("Try to get Access Token (from Google API) " + url);
    axiosInstance.post(url, tokenResponse).then((response) => {
      console.log("------------------------------");
      console.log('Login success. Data fetched:', response.data);
      dispatch(setLogin(response.data));
      console.log("Navigate to /admin/orders...");
      navigate('/admin/orders/1');
    })
    .catch((err) => {
      setError(err.response.data.loginResult);
    })
    .finally(() => {
      console.log('Request (and retries) completed. This runs regardless of success or failure.');
      setIsLoading(false);
    });
  }

  const onError = (err) => { console.log('Failed logging in with Google OAuth 2.0 Client. Error: ', err); };

  const errMarkup = (
    <>
      <span className="d-block d-sm-none mgGoogleTokenErrSpan" >Error: {error} Try again?</span>
      <span className="d-none d-sm-block mgGoogleTokenErrSpan" >Error: {error} Try again?</span>
    </>
  );

  const markup = (
    (isLoading) ? <div className="fetchErr">Loading...</div> : (
      <>
        {error && errMarkup}
        <GoogleLogin onSuccess={confirmToken} onError={onError} />
      </>
    )
  );

  return (
    <>{markup}</>
  );
};
export default GoogleLoginComp;