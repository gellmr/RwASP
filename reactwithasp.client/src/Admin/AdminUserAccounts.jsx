import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setAdminUserAccounts } from '@/features/admin/useraccounts/adminUserAccountsSlice.jsx'
import axios from 'axios';
import axiosRetry from 'axios-retry';
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import '@/AdminUserAccounts.css'

const AdminUserAccounts = () =>
{
  const retryThisPage = 5;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const userAccounts = useSelector(state => state.adminUserAccounts.users);
  const loginValue = useSelector(state => state.login.value);
  const myUserId = loginValue.appUserId;

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      dispatch(setAdminUserAccounts(response.data));
    })
    .catch((error) => {
      console.error('Request failed after retries:', error);
      setError(error);
      dispatch(setAdminUserAccounts([]));
    })
    .finally(() => {
      console.log('Request (and retries) completed. This runs regardless of success or failure.');
      setIsLoading(false);
    });
  }

  const modalMarkup = () => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Profile Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>Please choose an image for your user profile.</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleClose}>
          &nbsp;Save&nbsp;
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const handleClickPhoto = function () {
    handleShow();
  }

  const userRowMarkup = (user, isCurrentUser) => (
    <Row className="adminUserAccRow" key={user.id}>

      {/*large*/}
      <Col xs={4} className="adminUserAccCell d-none d-sm-block adminUserAccImage adminUserAccLarge">
        <Image src={(user.picture === undefined || user.picture === null) ? '/thumbs/noProfile120.png' : user.picture} rounded onClick={isCurrentUser ? handleClickPhoto : undefined} className={isCurrentUser ? "adminUserAccCurrPhoto" : ''}/>
      </Col>

      <Col xs={12} sm={8}>
        <Row className="adminUserAccDetailsBox">
          <Col className="adminUserAccCell" xs={3}>User&nbsp;ID</Col>   <Col xs={9} className="adminUserAccCell mgGuid">{user.id}</Col>
          <Col className="adminUserAccCell" xs={3}>UserName</Col>  <Col xs={9} className="adminUserAccCell">{user.userName}</Col>
          <Col className="adminUserAccCell" xs={3}>Phone</Col>     <Col xs={9} className="adminUserAccCell">{user.phoneNumber}</Col>
          <Col className="adminUserAccCell" xs={3}>Email</Col>     <Col xs={9} className="adminUserAccCell">{user.email}</Col>
        </Row>
      </Col>

      {/*small*/}
      <Col xs={12} className="adminUserAccCell d-sm-none adminUserAccImage adminUserAccSmall">
        <Image src={(user.picture === undefined || user.picture === null) ? '/thumbs/noProfile120.png' : user.picture} rounded onClick={isCurrentUser ? handleClickPhoto : undefined} className={isCurrentUser ? "adminUserAccCurrPhoto" : ''} />
      </Col>

    </Row>
  );

  const userTableMarkup = () => (
    <>
      <Row>
        <Col xs={0} lg={2}>
          {/*LSPACE*/}
        </Col>
        <Col xs={12} lg={8}>
          {modalMarkup()}
          {userAccounts.map(user => userRowMarkup(user, (user.id == myUserId)))}
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
          <AdminTitleBar titleText="Customer Accounts" construction={false} />
        </Col>
        <Col xs={12}>
          {markup}
        </Col>
      </Row>
    </>
  );
}
export default AdminUserAccounts;