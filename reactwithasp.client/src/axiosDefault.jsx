import axios from 'axios';
import axiosRetry from 'axios-retry';

const retryThisPage = 5;
const axiosInstance = axios.create({});

axiosRetry(axiosInstance, {
  retries: retryThisPage, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
    console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url} error: ${error}`);
  }
});

export { axiosInstance }