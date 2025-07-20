import { useState, useEffect } from 'react';
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import axios from 'axios';
import axiosRetry from 'axios-retry';

const AdminUserAccounts = () =>
{
  const retryThisPage = 5;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({});
  axiosRetry(axiosInstance, { retries: retryThisPage, retryDelay: axiosRetry.exponentialDelay, onRetry: (retryCount, error, requestConfig) => {
    console.log(`axiosRetry attempt ${retryCount} for ${requestConfig.url}`); 
  }});

  useEffect(() => {
    fetchAdminUserAccs();
  }, []);

  async function fetchAdminUserAccs() {
    setError("");
    setIsLoading(true);
    const url = window.location.origin + "/api/admin-useraccounts";
    axiosInstance.get(url).then((response) => {
      console.log('Data fetched:', response.data);
      //dispatch(setAdminUserAccounts(response.data));
    })
    .catch((error) => {
      console.error('Request failed after retries:', error);
      setError(error);
      //dispatch(setAdminUserAccounts([]));
    })
    .finally(() => {
      console.log('Request (and retries) completed. This runs regardless of success or failure.');
      setIsLoading(false);
    });
  }

  const userRowMarkup = (user) => (
    <>
      <div>{user.id}</div>
    </>
  );

  const userTableMarkup = () => (
    <>
      <Row>
        <Col xs={0} lg={2}>
          {/*LSPACE*/}
        </Col>
        <Col xs={12} lg={8}>
          { /*
            userAccounts.map(user => userRowMarkup(user))
            */
          }
        </Col>
        <Col xs={0} lg={2}>
          {/*RSPACE*/}
        </Col>
      </Row>
    </>
  );

  const markup = (isLoading) ? <div className="fetchErr">Loading...</div>             : (
    (error)                  ? <div className="fetchErr">Error: {error.message}</div> : (
    userTableMarkup()
  ));

  return (
    <>
      <Row>
        <Col xs={12}>
          <AdminTitleBar titleText="User Accounts" />
        </Col>
        <Col xs={12}>
          {markup}
        </Col>
      </Row>
    </>
  );
}
export default AdminUserAccounts;