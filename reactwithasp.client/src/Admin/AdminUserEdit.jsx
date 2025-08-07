import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams, NavLink } from "react-router";
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import DragDropUserPicModal from "@/DragDropUserPicModal";
import { axiosInstance } from '@/axiosDefault.jsx';
import { setAdminEditUser, setUserFullname, setUserPhone, setUserEmail, setUserPicture, updateUserOnServer } from '@/features/admin/edituser/adminEditUserSlice.jsx'

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
  
  const loginValue = useSelector(state => state.login.value);
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

  const guestIdRow = function (gid) {
    if (gid === undefined || gid ===null) {
      return <>
        <Col className="adminUserEditCell" xs={3}></Col>
        <Col xs={9} className="adminUserEditCell">&nbsp;
        </Col>
      </>
    }
    return (
      <>
        <Col className="adminUserEditCell" xs={3}>Guest&nbsp;ID</Col>
        <Col xs={9} className="adminUserEditCell mgGuid" >
          <Form.Control type="id" value={gid} readonly disabled="disabled" />
        </Col>
      </>
    );
  }

  const userRowMarkup = function (user, isCurrentUser) {
    return (
      <Row key={user.id} className={isCurrentUser ? "adminUserEditRow currUserRow" : 'adminUserEditRow'}>

        {/*large*/}
        <Col xs={4} className="adminUserEditCell d-none d-sm-block adminUserEditImage adminUserEditLarge">
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
              <Form.Control type="id" value={user.userName} readonly disabled="disabled" />
            </Col>

            <Col className="adminUserEditCell" xs={3}>User&nbsp;ID</Col>
            <Col xs={9} className="adminUserEditCell mgGuid" >
              <Form.Control type="id" value={user.id} readonly disabled="disabled" />
            </Col>

            {guestIdRow(user.guestID)}
            
            <Col className="adminUserEditCell" xs={3}>Phone</Col>
            <Col xs={9} className="adminUserEditCell">
              <Form.Control type="phone" value={user.phoneNumber} onChange={handlePhoneChange} />
            </Col>

            <Col className="adminUserEditCell" xs={3}>Email</Col>
            <Col xs={9} className="adminUserEditCell">
              <Form.Control type="email" value={user.email} onChange={handleEmailChange} />
            </Col>

            <Col xs={12} className="adminUserEditCell" style={{ textAlign: 'right' }}>
              <NavLink to={"/admin/user/" + user.id + "/payments"} className="btn btn-light" style={{ textWrapMode: "nowrap", textDecoration: 'none', marginBottom: 5 }}>
                View Payments
              </NavLink>

              <NavLink to={"/admin/user/" + user.id + "/orders"} className="btn btn-light" style={{ textWrapMode: "nowrap", textDecoration: 'none', marginLeft: 6, marginBottom: 5 }}>
                View Orders
              </NavLink>
            </Col>
          </Row>
        </Col>

        {/*small*/}
        <Col xs={12} className="adminUserEditCell d-sm-none adminUserEditImage adminUserEditSmall">
          <Image src={(user.picture === undefined || user.picture === null) ? '/thumbs/noProfile120.png' : user.picture} rounded onClick={handleClickPhoto} className="adminUserEditCurrPhoto" referrerPolicy="no-referrer" />
        </Col>
      </Row>
    );
  }

  const backLink = () => (
    <Row>
      <Col style={{textAlign:'left', marginBottom:10}}>
        <NavLink to={"/admin/useraccounts"} className="btn btn-light" style={{ textWrapMode: "nowrap", textDecoration: 'none', fontSize:12 }}>
          <i className="bi bi-arrow-left-short"></i> Back
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
          <DragDropUserPicModal ref={modalRef} onSuccess={handleModalCloseSuccess} />
          {backLink()}
          {userRowMarkup(userAccount, (idval == myUserId))}
        </Col>
        <Col xs={0} lg={2}>
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
        <Col xs={12}>
          <AdminTitleBar titleText="Customer Account" construction={false} />
        </Col>
        <Col xs={12}>
          {markup}
        </Col>
      </Row>
    </>
  );
}
export default AdminUserEdit;