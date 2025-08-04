import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setAdminUserAccounts, updateUserPic } from '@/features/admin/useraccounts/adminUserAccountsSlice.jsx'
import { axiosInstance } from '@/axiosDefault.jsx';
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropzone from 'react-dropzone'
import { useNavigate, NavLink } from "react-router";

import '@/AdminUserShared.css'
import '@/AdminUserAccounts.css'

const AdminUserAccounts = () =>
{
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const userAccounts = useSelector(state => state.adminUserAccounts.users);
  const loginValue = useSelector(state => state.login.value);

  const navigate = useNavigate();
  if (loginValue === null) {
    navigate('/admin');
  }

  const myUserId = (loginValue === null) ? undefined : loginValue.appUserId;
  const isGoogleSignIn = (loginValue === null) ? false : (loginValue.loginType === 'Google Sign In');

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleDrop(acceptedFiles)
  {
    const file = acceptedFiles[0];
    if (file)
    {
      const url = window.location.origin + "/api/admin-userpic";
      const formData = new FormData();
      formData.append('file', file);
      const postConfig = {
        headers: { 'Content-Type': 'multipart/form-data' },
        //onUploadProgress: (progressEvent) => {
        //  const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        //  console.log(`   Uploading: ${percentCompleted}%`);
        //}
      };
      axiosInstance.post(url, formData, postConfig).then((response) => {

        // To help debug the production configuration for file upload path
        let dev_UploadPath  = response.data.debug === 'C:\\path to\\                           RwASP\\reactwithasp.client\\public\\userpic';
        let prod_UploadPath = response.data.debug === 'C:\\path to\\RwASP-wwwroot\\wwwroot\\userpic';

        console.log('File uploaded successfully!', response.data);
        dispatch(updateUserPic({
          userId: response.data.userId,
          picture: response.data.picture
        }));
      })
      .catch((error) => {
        console.error('Request failed after retries.', error);
      })
      .finally(() => {
        console.error('Completed - handleDrop');
        handleClose();
      });
    }
  }

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

  const googleProfileWarn = () => (
    <div>
      <b>
        This will not update your Google Profile image.
      </b>
    </div>
  );

  const modalMarkup = () => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Profile Image
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>Please choose an image for your user profile.<br/>
          {isGoogleSignIn && googleProfileWarn()}
        </div>
        <br/>
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div style={{marginBottom:10}}>Click here to browse for a file, or drag and drop to upload.</div>
                <div className="dragDropCont">
                  <Image className="cloudGraphic" src={'/graphics/cloud-upload.png'} rounded />
                </div>
              </div>
            </section>
          )}
        </Dropzone>
      </Modal.Body>
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
    <Row key={user.id} className={isCurrentUser ? "adminUserAccRow currUserRow" : 'adminUserAccRow'}>
      
      {/*large*/}
      <Col xs={4} className="adminUserAccCell d-none d-sm-block adminUserAccImage adminUserAccLarge">
        <Image src={(user.picture === undefined || user.picture === null) ? '/thumbs/noProfile120.png' : user.picture} rounded onClick={isCurrentUser ? handleClickPhoto : undefined} className={isCurrentUser ? "adminUserAccCurrPhoto" : ''}/>
      </Col>

      <Col xs={12} sm={8}>
        <Row className="adminUserAccDetailsBox">
          <Col className="adminUserAccCell" xs={3}>{isCurrentUser ? "(Logged in as) " : 'UserName'}</Col>  <Col xs={9} className="adminUserAccCell">{user.userName}</Col>
          <Col className="adminUserAccCell" xs={3}>User&nbsp;ID</Col>                                      <Col xs={9} className="adminUserAccCell mgGuid">{user.id}</Col>
          <Col className="adminUserAccCell" xs={3}>Phone</Col>                                             <Col xs={9} className="adminUserAccCell">{user.phoneNumber}</Col>
          <Col className="adminUserAccCell" xs={3}>Email</Col>                                             <Col xs={9} className="adminUserAccCell">{user.email}</Col>
        </Row>
      </Col>

      {/*small*/}
      <Col xs={12} className="adminUserAccCell d-sm-none adminUserAccImage adminUserAccSmall">
        <Image src={(user.picture === undefined || user.picture === null) ? '/thumbs/noProfile120.png' : user.picture} rounded onClick={isCurrentUser ? handleClickPhoto : undefined} className={isCurrentUser ? "adminUserAccCurrPhoto" : ''} />
      </Col>

      <Col xs={12} className="adminUserAccDetailLinks">
        <NavLink to={"/admin/user/" + user.id + "/edit"} className={isCurrentUser ? "btn btn-outline-primary adminUserAccDetailEditLink" : "btn btn-light"} style={{ textWrapMode: "nowrap", textDecoration: 'none' }}>
          Edit Account <i className="bi bi-pencil-square"></i>
        </NavLink>
        <NavLink to={"/admin/user/" + user.id + "/orders"} className={isCurrentUser ? "btn btn-primary" : "btn btn-light"} style={{ textWrapMode: "nowrap", textDecoration: 'none' }}>
          View Orders <i className="bi bi-arrow-right-short"></i>
        </NavLink>
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