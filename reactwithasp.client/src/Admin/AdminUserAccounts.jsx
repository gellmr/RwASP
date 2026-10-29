import { useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setAdminUserAccounts } from '@/features/admin/useraccounts/adminUserAccountsSlice.jsx'
import { axiosInstance } from '@/axiosDefault.jsx';
import usePagedSearch from '@/Admin/PagedSearch.jsx';
import AdminTitleBar from "@/Admin/AdminTitleBar";
import SearchInput from "@/Search/SearchInput";
import PagLinks from "@/Admin/PagLinks";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image';
import DragDropUserPicModal from "@/DragDropUserPicModal";
import { NavLink } from "react-router";
import { nullOrUndefined } from '@/MgUtility.js';

import '@/AdminUserShared.css'
import '@/AdminUserAccounts.css'

const AdminUserAccounts = () =>
{
  const dispatch     = useDispatch();
  const modalRef     = useRef();
  const rowsPerPage  = 10;

  const myRouteSeg = "/admin/useraccounts";

  const userAccounts = useSelector(state => state.adminUserAccounts.users);
  const loginValue   = useSelector(state => state.login.user);
  const myUserId     = (loginValue === null) ? undefined : loginValue.appUserId;

  // Define API fetcher passed into custom hook
  const fetchAdminUserAccs = useCallback(async (page, search, limit, signal) => {
    let query = `?ps=${limit}`;
    if (search && search.trim()) {
      query += `&bs=${encodeURIComponent(search.trim())}`;
    }
    try {
      const response = await axiosInstance.get(`/api/admin-useraccounts/${page}${query}`, { signal });
      dispatch(setAdminUserAccounts(response.data.users || []));
      return response.data;
    } catch (err) {
      if (err.name !== 'CanceledError') {
        dispatch(setAdminUserAccounts([]));
      }
      throw err;
    }
  }, [dispatch]);

  const {
    totResults,
    totPages,
    currPage,
    searchTerm,
    isLoading,
    error,
    handleSearchChange,
  } = usePagedSearch(fetchAdminUserAccs, myRouteSeg, rowsPerPage);
  
  const getSequenceNumber = (index) => (currPage - 1) * rowsPerPage + index + 1;
  
  const handleClickPhoto = function (event) {
    const idv = event.currentTarget.dataset.foruser;
    const utype = event.currentTarget.dataset.usertype;
    modalRef.current?.showModal(idv, utype);
  }

  const userRowMarkup = function (user, index, isCurrentUser) {
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

    const phoneRow = nullOrUndefined(user.phoneNumber) ? <></> : ( <>
        <Col className="adminUserAccCell" xs={3}>Phone</Col> <Col xs={9} className="adminUserAccCell">{user.phoneNumber}</Col>
      </>
    );

    return (
      <div key={idval}>
        <div className="d-none d-sm-block custRowKey">
          {getSequenceNumber(index)}
        </div>
        <Row className={isCurrentUser ? "adminUserAccRow currUserRow" : 'adminUserAccRow'} data-fullname={user.fullName}>

          {/*large*/}
          <Col xs={4} className="adminUserAccCell d-none d-sm-flex adminUserAccImage adminUserAccLarge">
            <Image src={(user.picture === undefined || user.picture === null) ? '/thumbs/noProfile120.png' : user.picture} rounded onClick={handleClickPhoto} className="adminUserAccCurrPhoto" referrerPolicy="no-referrer" data-foruser={idval} data-usertype={usertype} />
          </Col>

          <Col xs={12} sm={8}>
            <Row className="adminUserAccDetailsBox">
              <Col className="adminUserAccCell" xs={3}>{isCurrentUser ? "(Logged in as) " : 'Full Name'}</Col> <Col xs={9} className="adminUserAccCell fullNameCell">{user.fullName}</Col>
              <Col className="adminUserAccCell" xs={3}>User&nbsp;ID</Col>                                      <Col xs={9} className="adminUserAccCell mgGuid">{idval}</Col>
              {phoneRow}
              <Col className="adminUserAccCell" xs={3}>Email</Col>                                             <Col xs={9} className="adminUserAccCell">{user.email}</Col>
              <Col className="adminUserAccCell" xs={3}>Account Type</Col>                                      <Col xs={9} className="adminUserAccCell accountTypeCell">{accountType}</Col>
            </Row>
          </Col>

          {/*small*/}
          <Col xs={12} className="adminUserAccCell d-sm-none adminUserAccImage adminUserAccSmall">
            <Image src={(user.picture === undefined || user.picture === null) ? '/thumbs/noProfile120.png' : user.picture} rounded onClick={handleClickPhoto} className="adminUserAccCurrPhoto" referrerPolicy="no-referrer" data-foruser={idval} data-usertype={usertype} />
          </Col>

          <Col xs={12} className="adminUserAccDetailLinks">
            <NavLink to={editLink} className={isCurrentUser ? "btn btn-light editAccLink editCurrUser" : "btn btn-light editAccLink"} style={{ whiteSpace: "nowrap", textDecoration: 'none' }}>
              Edit Account <i className="bi bi-pencil-square"></i>
            </NavLink>
            <NavLink to={ordersLink} className={isCurrentUser ? "btn btn-light" : "btn btn-light"} style={{ whiteSpace: "nowrap", textDecoration: 'none' }}>
              View Orders <i className="bi bi-arrow-right-short"></i>
            </NavLink>
          </Col>
        </Row>
      </div>
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
          {(userAccounts || []).map((user, index) => 
            userRowMarkup(user, index, !nullOrUndefined(myUserId) && myUserId === user.id)
          )}
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
              <div className="custAccsPagination">
                <PagLinks length={totResults} totPages={totPages} currPage={currPage} myRoute={myRouteSeg} />
              </div>
              <div className="custAccSearchField">
                <SearchInput initVal={searchTerm} placeholder="Search" parentHandleInputChange={handleSearchChange} style={{ width: '500px' }} />
              </div>
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
