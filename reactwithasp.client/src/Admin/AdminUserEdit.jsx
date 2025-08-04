import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams, NavLink } from "react-router";
import AdminTitleBar from "@/Admin/AdminTitleBar";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image';
import DragDropUserPicModal from "@/DragDropUserPicModal";
import { axiosInstance } from '@/axiosDefault.jsx';
import { setAdminEditUser } from '@/features/admin/edituser/adminEditUserSlice.jsx'

import '@/AdminUserShared.css'
import '@/AdminUserEdit.css'

function AdminUserEdit()
{
  const modalRef = useRef();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const userAccounts = useSelector(state => state.adminUserAccounts.users);
  const loginValue = useSelector(state => state.login.value);

  const navigate = useNavigate();
  if (loginValue === null) {
    //navigate('/admin');
  }

  const myUserId = (loginValue === null) ? undefined : loginValue.appUserId;
  const { userid } = useParams();

  useEffect(() => {
    fetchAccount();
  }, [userid]);

  async function fetchAccount() {
    setError("");
    setIsLoading(true);
    const url = window.location.origin + "/api/admin-user-edit/" + userid;
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

  const handleClickPhoto = function () {
    modalRef.current.showModal();
  }

  const userRowMarkup = (user, isCurrentUser) => (
    <Row key={user.id} className={isCurrentUser ? "adminUserEditRow currUserRow" : 'adminUserEditRow'}>

      {/*large*/}
      <Col xs={4} className="adminUserEditCell d-none d-sm-block adminUserEditImage adminUserEditLarge">
        <Image src={(user.picture === undefined || user.picture === null) ? '/thumbs/noProfile120.png' : user.picture} rounded onClick={isCurrentUser ? handleClickPhoto : undefined} className={isCurrentUser ? "adminUserEditCurrPhoto" : ''} />
      </Col>

      <Col xs={12} sm={8}>
        <Row className="adminUserEditDetailsBox">
          <Col className="adminUserEditCell" xs={3}>{isCurrentUser ? "(Logged in as) " : 'UserName'}</Col>  <Col xs={9} className="adminUserEditCell">{user.userName}</Col>
          <Col className="adminUserEditCell" xs={3}>User&nbsp;ID</Col>                                      <Col xs={9} className="adminUserEditCell mgGuid">{user.id}</Col>
          <Col className="adminUserEditCell" xs={3}>Phone</Col>                                             <Col xs={9} className="adminUserEditCell">{user.phoneNumber}</Col>
          <Col className="adminUserEditCell" xs={3}>Email</Col>                                             <Col xs={9} className="adminUserEditCell">{user.email}</Col>
        </Row>
      </Col>

      {/*small*/}
      <Col xs={12} className="adminUserEditCell d-sm-none adminUserEditImage adminUserEditSmall">
        <Image src={(user.picture === undefined || user.picture === null) ? '/thumbs/noProfile120.png' : user.picture} rounded onClick={isCurrentUser ? handleClickPhoto : undefined} className={isCurrentUser ? "adminUserEditCurrPhoto" : ''} />
      </Col>
    </Row>
  );

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
          <DragDropUserPicModal ref={modalRef} />
          {backLink()}
          {userAccounts
            .filter(user => (user.id == userid))
            .map(user => userRowMarkup(user, (user.id == myUserId)))}
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
          <AdminTitleBar titleText="User Account" construction={false} />
        </Col>
        <Col xs={12}>
          {markup}
        </Col>
      </Row>
    </>
  );
}
export default AdminUserEdit;