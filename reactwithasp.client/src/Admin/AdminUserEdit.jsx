import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams, NavLink, Link } from "react-router";
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import DragDropUserPicModal from "@/DragDropUserPicModal";
import { axiosInstance } from '@/axiosDefault.jsx';
import { setAdminEditUser, setUserFullname, setUserPhone, setUserEmail, setUserPicture, updateUserOnServer } from '@/features/admin/edituser/adminEditUserSlice.jsx'
import { nullOrUndefined } from '@/MgUtility.js';
import BackLink from "@/Shop/BackLink";

import '@/AdminUserShared.css'
import '@/AdminUserEdit.css'

function AdminUserEdit()
{
  const modalRef = useRef();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { usertype, idval } = useParams();

  const userAccount = useSelector(state => state.adminEditUser.user);
  
  const loginValue = useSelector(state => state.login.user);
  const myUserId = (loginValue === null) ? undefined : loginValue.appUserId;

  const navigate = useNavigate();
  if (loginValue === null) {
    //navigate('/admin');
  }

  useEffect(() => {
    fetchAccount();
  }, [idval]);

  async function fetchAccount() {
    setError("");
    const t = usertype;
    const path = ((usertype == "guest") ? "/api/admin-guest-edit/" : "/api/admin-user-edit/") + idval;
    const url = window.location.origin + path;
    axiosInstance.get(url).then((response) => {
      console.log('Data fetched:', response.data);
      dispatch(setAdminEditUser(response.data));
    })
    .catch((error) => {
      setError(error);
      dispatch(setAdminEditUser(null));
    })
    .finally(() => {
      setIsLoading(false);
    });
  }

  const handleClickPhoto = function (event) {
    const idv = idval;
    const utype = usertype;
    modalRef.current.showModal(idv, utype);
  }

  const handleModalCloseSuccess = function (picture) {
    dispatch(setUserPicture(picture));
  }

  const handleFullnameChange = function (event) {
    dispatch(setUserFullname(event.target.value));
    dispatch(updateUserOnServer({ user:userAccount, field:'fullName', update:event.target.value }));
  }
  const handlePhoneChange = function (event) {
    dispatch(setUserPhone(event.target.value));
    dispatch(updateUserOnServer({user:userAccount, field:'phoneNumber', update:event.target.value}));
  }
  const handleEmailChange = function (event) {
    dispatch(setUserEmail(event.target.value));
    dispatch(updateUserOnServer({user:userAccount, field:'email', update:event.target.value}));
  }

  const userIdRow = function (uid) {
    if (nullOrUndefined(uid)) {
      return (<></>);
    }
    return (
      <>
        <Col className="adminUserEditCell" xs={3}>User&nbsp;ID</Col>
        <Col xs={9} className="adminUserEditCell mgGuid" >
          <Form.Control type="id" value={uid} readOnly disabled="disabled" />
        </Col>
      </>
    );
  }

  const guestIdRow = function (gid) {
    if (nullOrUndefined(gid)) {
      return (<></>);
    }
    return (
      <>
        <Col className="adminUserEditCell" xs={3}>Guest&nbsp;ID</Col>
        <Col xs={9} className="adminUserEditCell mgGuid" >
          <Form.Control type="id" value={gid} readOnly disabled="disabled" />
        </Col>
      </>
    );
  }

  const phoneRow = function (user) {
    if (!nullOrUndefined(user.guestID)) {
      return (
        <></>
      );
    }
    return (
      <>
        <Col className="adminUserEditCell" xs={3}>Phone</Col>
        <Col xs={9} className="adminUserEditCell">
          <Form.Control type="phone" value={user.phoneNumber} onChange={handlePhoneChange} />
        </Col>
      </>
    );
  }

  const comingSoonTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      This feature coming soon!
    </Tooltip>
  );

  const userRowMarkup = function (user, isCurrentUser) {
    const toPayments = "#"; // TODO  "/admin/" + usertype + "/" + idval + "/payments";

    if (nullOrUndefined(user)) {
      let a = 1;
      return (
        <></>
      );
    }
    return (
      <Row key={user.id} className={isCurrentUser ? "adminUserEditRow currUserRow" : 'adminUserEditRow'}>

        <Col xs={12}>
          <Row>

            {/*large*/}
            <Col xs={4} className="adminUserEditCell d-none d-sm-flex adminUserEditImage adminUserEditLarge">
              <Image src={(user.picture === undefined || user.picture === null) ? '/thumbs/noProfile120.png' : user.picture} rounded onClick={handleClickPhoto} className="adminUserEditCurrPhoto" referrerPolicy="no-referrer" />
            </Col>

            <Col xs={12} sm={8}>
              <Row className="adminUserEditDetailsBox">
                <Col className="adminUserEditCell" xs={3}>{isCurrentUser ? "(Logged in as) " : 'Full Name'}</Col>
                <Col xs={9} className="adminUserEditCell">
                  <Form.Control type="name" value={user.fullName} onChange={handleFullnameChange} />
                </Col>

                <Col className="adminUserEditCell" xs={3}>UserName</Col>
                <Col xs={9} className="adminUserEditCell">
                  <Form.Control type="id" value={user.userName} readOnly disabled="disabled" />
                </Col>

                {userIdRow(user.id)}

                {guestIdRow(user.guestID)}

                {phoneRow(user)}

                <Col className="adminUserEditCell" xs={3}>Email</Col>
                <Col xs={9} className="adminUserEditCell">
                  <Form.Control type="email" value={user.email} onChange={handleEmailChange} />
                </Col>
              </Row>
            </Col>

          </Row>
        </Col>

        <Col xs={12} className="adminUserEditCell" style={{ textAlign: 'right' }}>
          <NavLink to={"/admin/" + usertype + "/" + idval + "/orders"} className="btn btn-light" style={{ textWrapMode: "nowrap", textDecoration: 'none', marginBottom: 5 }}>
            View Orders
          </NavLink>

          <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={comingSoonTooltip}>
            <Link to={toPayments} className="btn btn-light temp-btn-disabled" style={{ textWrapMode: "nowrap", textDecoration: 'none', marginBottom: 5, marginLeft: 6 }}>
              View Payments
            </Link>
          </OverlayTrigger>
        </Col>

        {/*small*/}
        <Col xs={12} className="adminUserEditCell d-sm-none adminUserEditImage adminUserEditSmall">
          <Image src={(user.picture === undefined || user.picture === null) ? '/thumbs/noProfile120.png' : user.picture} rounded onClick={handleClickPhoto} className="adminUserEditCurrPhoto" referrerPolicy="no-referrer" />
        </Col>
      </Row>
    );
  }

  const userTableMarkup = () => (
    <>
      <Row>
        <Col xs={0} sm={1} md={2} lg={2}>
          {/*LSPACE*/}
        </Col>
        <Col xs={12} sm={10} md={8} lg={8} className="adminUserEditWrap">
          <DragDropUserPicModal ref={modalRef} onSuccess={handleModalCloseSuccess} />
          <BackLink textPos="left" />
          {userRowMarkup(userAccount, (!nullOrUndefined(idval) && idval == myUserId))}
        </Col>
        <Col xs={0} sm={1} md={2} lg={2}>
          {/*RSPACE*/}
        </Col>
      </Row>
    </>
  );

  const markup = (isLoading) ? <div className="fetchErr">Loading...</div> : (
    (error) ? <div className="fetchErr">Error: {error.message}</div> : (
    userTableMarkup()
  ));

  return (
    <>
      <Row>
        <Col sm={12} className="adminCont adminParallax adminParallaxUserEdit">

          <Row className="innerRow">
            <Col xs={12}>
              <AdminTitleBar titleText="Edit Account" construction={false} />
            </Col>
            <Col xs={12} className="mainSection">
              {markup}
            </Col>
          </Row>

          <div className="mgFooter">Built with React / Redux and .NET Core 8.0</div>
        </Col>
      </Row>
    </>
  );
}
export default AdminUserEdit;