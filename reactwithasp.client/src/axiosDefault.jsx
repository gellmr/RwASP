import axios from 'axios';
import axiosRetry from 'axios-retry';

const retryThisPage = 5;
const axiosInstance = axios.create({});

// Firebase does not allow multiple cookies.
// Grab the `guestID` from Redux and attach it as an HTTP Header.
axiosInstance.interceptors.request.use(async config => {
  const { store } = await import('@/Shop/store.jsx');
  const guestId = store.getState().login?.guest?.id;
  if (guestId) { config.headers['X-Guest-Id'] = guestId; }
  return config;
});

axiosRetry(axiosInstance, {
  retries: retryThisPage, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
    console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url} error: ${error}`);
  }
});

export { axiosInstance }