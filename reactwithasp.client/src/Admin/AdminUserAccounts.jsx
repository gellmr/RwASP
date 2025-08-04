import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setAdminUserAccounts } from '@/features/admin/useraccounts/adminUserAccountsSlice.jsx'
import { axiosInstance } from '@/axiosDefault.jsx';
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image';
import DragDropUserPicModal from "@/DragDropUserPicModal";
import { useNavigate, NavLink } from "react-router";

import '@/AdminUserShared.css'
import '@/AdminUserAccounts.css'

const AdminUserAccounts = () =>
{
  const modalRef = useRef();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const userAccounts = useSelector(state => state.adminUserAccounts.users);
  const loginValue = useSelector(state => state.login.value);

  const myUserId = (loginValue === null) ? undefined : loginValue.appUserId;

  const navigate = useNavigate();
  if (loginValue === null) {
    //navigate('/admin');
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
  
  const handleClickPhoto = function () {
    modalRef.current.showModal();
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
          <DragDropUserPicModal ref={modalRef} />
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