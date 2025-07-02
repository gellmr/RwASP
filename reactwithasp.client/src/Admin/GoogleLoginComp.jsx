import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { useNavigate } from "react-router";

const GoogleLoginComp = () =>
{
  const retryThisPage = 3;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Configure axios instance.
  axiosRetry(axios, { retries: retryThisPage, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
    console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url}`);
  }});

  async function confirmToken(tokenResponse)
  {
    // Pass token to our backend server, for confirmation.
    console.log("Success logging in with Google Sign In. received authorization code...");
    setIsLoading(true);
    const url = window.location.origin + "/api/validate-google-token";
    console.log("Try to get Access Token (from Google API) " + url);
    axios.post(url, tokenResponse).then((response) => {
      console.log("------------------------------");
      console.log('Data fetched:', response.data); // response.data is already JSON
      console.log("Navigate to /admin/orders...");
      navigate('/admin/orders');
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