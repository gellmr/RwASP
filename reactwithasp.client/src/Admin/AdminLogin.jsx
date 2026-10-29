import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import GoogleLoginComp from "@/Admin/GoogleLoginComp.jsx";
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import ConstructionBanner from "@/main/ConstructionBanner.jsx";
import { useDispatch } from 'react-redux'
import { setLogin } from '@/features/login/loginSlice.jsx'

import { axiosInstance } from '@/axiosDefault.jsx';

import { useState } from 'react';
import { useNavigate } from "react-router";

function AdminLogin()
{
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [vipUserName, setVipUserName] = useState("");
  const [vipPassword, setVipPassword] = useState("");

  const loginClick = function () { 
    // Try to login to Admin pages...
    setIsLoading(true);
    const url = window.location.origin + "/api/admin-login";
    const jsonData = { username:vipUserName, password:vipPassword };
    setError("");
    console.log("Submit login details... " + url);
    axiosInstance.post(url, jsonData).then((response) => {
      console.log("------------------------------");
      console.log('Login success. Data fetched:', response.data);
      dispatch(setLogin(response.data));
      console.log("Navigate to /admin/orders...");
      navigate('/admin/orders/1');
    })
    .catch((err) => {
      const result = err.response.data.loginResult;
      const message = err.response.data.message;
      setError(message);
    })
    .finally(() => {
      console.log('(loginClick) Request (and retries) completed. This runs regardless of success or failure.');
      setIsLoading(false);
    });
  };

  const errMarkup = (
    <>
      {error && <span className="loginErrStyle">{error}</span>}
    </>
  );

  const loadingMarkup = (
    <>
      <div className="fetchErr">Loading...</div>
    </>
  );

  const emailChange = function (e) {
    setVipUserName(e.target.value);
  }
  const passwordChange = function (e) {
    setVipPassword(e.target.value);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      loginClick();
    }
  };

  const pageMarkup = (
    <>
      <h4>Admin Console</h4>
      {/* <ConstructionBanner /> */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Form className="mg-admin-login-form">
          <Row>
            {errMarkup}
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="formGroupEmail" style={{ textAlign:"left"}}>
                <Form.Label>&nbsp;&nbsp;Username</Form.Label>
                <Form.Control type="email" placeholder="Please enter your username" onChange={emailChange} />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="formGroupPassword" style={{ textAlign: "left" }}>
                <Form.Label>&nbsp;&nbsp;Password</Form.Label>
                <InputGroup>
                  <Form.Control type="password" placeholder="Enter your password" onChange={passwordChange} onKeyDown={handleKeyDown} />
                  <Button id="loginSubmit" variant="outline-primary" style={{ minWidth: 90 }} onClick={() => loginClick()}>Login</Button>
                </InputGroup>
              </Form.Group>
            </Col>
            <div style={{ marginBottom: 40 }}></div>

            <Stack direction="horizontal" gap={3} className="d-none d-sm-flex" style={{ marginTop: 10 }}>
              <div className="me-auto other-signin">Other sign-in options:</div>
              <div className="vr" />
              <GoogleLoginComp />
            </Stack>
            <Stack direction="vertical" className="d-flex d-sm-none" style={{ marginTop: 10 }}>
              <div className="me-auto"></div>
              <div className="other-signin" style={{ maxWidth: 250, alignSelf: "flex-start" }}>
                Other sign-in options...
              </div>
              <hr />
              <div style={{ maxWidth: 250, alignSelf: "flex-end" }}>
                <GoogleLoginComp />
              </div>
            </Stack>
          </Row>

          <Row>
            <div className="d-none d-sm-block">
              <div className="disclaimer" style={{paddingTop:35}}>
                You can click through with Google sign-in to access the full Admin Console features.
              </div>
              <div className="disclaimer">
                Admin Console allows you to search for orders, view customer accounts, and BI reports.
              </div>
              <div className="disclaimer" style={{paddingTop:10}}>
                The customer accounts are all pretend data, not real people (pretend names, email addresses, etc).
              </div>
              <div className="disclaimer">
                The profile pictures are from an anonymous free api called <a href="https://randomuser.me">randomuser.me</a>
              </div>
              <div className="disclaimer">
                There is no credit card info, or real financial data.
              </div>
            </div>
            <div className="d-block d-sm-none">
              <div className="disclaimer" style={{paddingTop:35, textAlign:'justify'}}>
                You can click through with Google sign-in to access the full Admin Console features. Admin Console allows you to search for orders, view customer accounts, and BI reports. The customer accounts are all pretend data, not real people (pretend names, email addresses, etc). The profile pictures are from an anonymous free api called <a href="https://randomuser.me">randomuser.me</a>. There is no credit card info, or real financial data.
              </div>
            </div>
            <hr style={{marginTop:'15px', color: 'rgb(179, 179, 179)'}} />
            <div className="disclaimer" style={{fontSize: 15, marginTop:2, paddingBottom: 16}}>
              Below are some screenshots...
            </div>
            <img src="/graphics/example-con-backlog.png" />
            <img src="/graphics/example-con-bi.png" style={{marginTop:28}}/>
            <img src="/graphics/example-con-users.png" style={{marginTop:38}}/>
          </Row>

        </Form>
      </div>
    </>
  );

  // {isLoading} ? {loadingMarkup} : ( {error} ? {errMarkup} : {pageMarkup} )
  return (
    <>
      {pageMarkup}
    </>
  );
}
export default AdminLogin;