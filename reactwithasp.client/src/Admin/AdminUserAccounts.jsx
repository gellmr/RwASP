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
import { nullOrUndefined } from '@/MgUtility.js';

import '@/AdminUserShared.css'
import '@/AdminUserAccounts.css'

const AdminUserAccounts = () =>
{
  const modalRef = useRef();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const userAccounts = useSelector(state => state.adminUserAccounts.users);
  const loginValue = useSelector(state => state.login.user);

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
  
  const handleClickPhoto = function (event) {
    const idv = event.target.dataset.foruser;
    const utype = event.target.dataset.usertype;
    modalRef.current.showModal(idv, utype);
  }

  const userRowMarkup = function (user, isCurrentUser) {
    const isGuest = user.guestID !== null;
    let usertype = '';
    let idval = '';
    if (isGuest) {
      usertype = 'guest';
      idval = user.guestID;
    } else {
      usertype = 'user';
      idval = user.id;
    }
    const accountType = isGuest ? "Guest" : "User";
    const editLink = "/admin/" + usertype + "/" + idval + "/edit";
    const ordersLink = "/admin/" + usertype + "/" + idval + "/orders";

    return (
      <Row key={idval} className={isCurrentUser ? "adminUserAccRow currUserRow" : 'adminUserAccRow'}>

        {/*large*/}
        <Col xs={4} className="adminUserAccCell d-none d-sm-flex adminUserAccImage adminUserAccLarge">
          <Image src={(user.picture === undefined || user.picture === null) ? '/thumbs/noProfile120.png' : user.picture} rounded onClick={handleClickPhoto} className="adminUserAccCurrPhoto" referrerPolicy="no-referrer" data-foruser={idval} data-usertype={usertype} />
        </Col>

        <Col xs={12} sm={8}>
          <Row className="adminUserAccDetailsBox">
            <Col className="adminUserAccCell" xs={3}>{isCurrentUser ? "(Logged in as) " : 'Full Name'}</Col> <Col xs={9} className="adminUserAccCell">{user.fullName}</Col>
            <Col className="adminUserAccCell" xs={3}>User&nbsp;ID</Col>                                      <Col xs={9} className="adminUserAccCell mgGuid">{idval}</Col>
            <Col className="adminUserAccCell" xs={3}>Phone</Col>                                             <Col xs={9} className="adminUserAccCell">{user.phoneNumber}</Col>
            <Col className="adminUserAccCell" xs={3}>Email</Col>                                             <Col xs={9} className="adminUserAccCell">{user.email}</Col>
            <Col className="adminUserAccCell" xs={3}>Account Type</Col>                                      <Col xs={9} className="adminUserAccCell accountTypeCell">{accountType}</Col>
          </Row>
        </Col>

        {/*small*/}
        <Col xs={12} className="adminUserAccCell d-sm-none adminUserAccImage adminUserAccSmall">
          <Image src={(user.picture === undefined || user.picture === null) ? '/thumbs/noProfile120.png' : user.picture} rounded onClick={handleClickPhoto} className="adminUserAccCurrPhoto" referrerPolicy="no-referrer" data-foruser={idval} data-usertype={usertype} />
        </Col>

        <Col xs={12} className="adminUserAccDetailLinks">
          <NavLink to={editLink} className={isCurrentUser ? "btn btn-light editCurrUser" : "btn btn-light"} style={{ textWrapMode: "nowrap", textDecoration: 'none' }}>
            Edit Account <i className="bi bi-pencil-square"></i>
          </NavLink>
          <NavLink to={ordersLink} className={isCurrentUser ? "btn btn-light" : "btn btn-light"} style={{ textWrapMode: "nowrap", textDecoration: 'none' }}>
            View Orders <i className="bi bi-arrow-right-short"></i>
          </NavLink>
        </Col>
      </Row>
    );
  }

  const userTableMarkup = () => (
    <>
      <Row>
        <Col xs={0} lg={2}>
          {/*LSPACE*/}
        </Col>
        <Col xs={12} lg={8} className="adminContainUserAccRow">
          <DragDropUserPicModal ref={modalRef} />
          {userAccounts.map(user => userRowMarkup(user, (!nullOrUndefined(myUserId) && myUserId == user.id )))}
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
        <Col sm={12} className="adminCont adminParallax adminUserAccountsParallax">

          <Row style={{marginBottom:100}}>
            <Col xs={12}>
              <AdminTitleBar titleText="Customer Accounts" construction={false} />
            </Col>
            <Col xs={12}>
              {markup}
            </Col>
          </Row>

          <div className="mgFooter">Built with React / Redux and .NET Core 8.0</div>
        </Col>
      </Row>
    </>
  );
}
export default AdminUserAccounts;