import axios from 'axios';
import axiosRetry from 'axios-retry';
import { setLogin } from '@/features/login/loginSlice.jsx';

const retryThisPage = 5;
const axiosInstance = axios.create({});

let storeInstance = null;
export const injectStore = (store) => { storeInstance = store; };

// Firebase does not allow multiple cookies.
// Grab the `guestID` from Redux and attach it as an HTTP Header.
axiosInstance.interceptors.request.use(config => {
  if (storeInstance) {
    const guestId = storeInstance.getState().login?.guest?.id;
    if (guestId) { config.headers['X-Guest-Id'] = guestId; }
  }
  return config;
});

// Handle 401 responses globally so any expired session across
// the application automatically resets the Redux login state.
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.status === 401 || error.response?.status === 401) {
      if (storeInstance) {
        storeInstance.dispatch(setLogin(null));
      }
      window.location.href = '/admin'; // Send user back to login page for Admin Console
    }
    return Promise.reject(error);
  }
);

axiosRetry(axiosInstance, {
  retries: retryThisPage, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
    console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url} error: ${error}`);
  }
});

export { axiosInstance }