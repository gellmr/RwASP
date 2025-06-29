import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import Button from 'react-bootstrap/Button';

const GoogleLoginComp = () =>
{
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configure axios instance.
  axiosRetry(axios, { retries: 7, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
    console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url}`);
  }});

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      debugger;
      console.log("Success logging in with Google OAuth 2.0 Client. Received token...");
      // confirmToken(tokenResponse); // Pass token to our backend server, for confirmation. I ALREADY HAVE THE TOKEN. IS THIS NEEDED ?
    },
    onError: (error) => {
      console.log('Failed logging in with Google OAuth 2.0 Client. Error: ', error);
    }
  });

  //async function confirmToken(tokenResponse)
  //{
  //  setIsLoading(true);
  //  const url = window.location.origin + "/api/account/signin-google";
  //  console.log("Axios retry..." + url);
  //  axios.post(url, tokenResponse).then((response) => {
  //    console.log('Data fetched:', response.data); // response.data is already JSON
  //  })
  //  .catch((error) => {
  //    console.error('Request failed after retries:', error);
  //    setError(error);
  //  })
  //  .finally(() => {
  //    console.log('Request (and retries) completed. This runs regardless of success or failure.');
  //    setIsLoading(false);
  //  });
  //}

  const markup = (
    (isLoading) ? <div className="fetchErr">Loading...</div>             : (
    (error)     ? <div className="fetchErr">Error: {error.message}</div> : (
      <Button variant="success" onClick={() => login()}>Sign in with Google</Button>
    )
  ));

  return (
    <>{markup}</>
  );
};
export default GoogleLoginComp;