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
      console.log('Login success. Data fetched:', response.data); // response.data is already JSON
      dispatch(setLogin(response.data));
      console.log("Navigate to /admin/orders...");
      navigate('/admin/orders');
    })
    .catch((err) => {
      setError(err.response.data.loginResult);
    })
    .finally(() => {
      console.log('(loginClick) Request (and retries) completed. This runs regardless of success or failure.');
      setIsLoading(false);
    });
  };

  const errMarkup = (
    <>
      {error && <span>Error: {error}</span>}
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
      <h4>Admin Login</h4>
      {/* <ConstructionBanner /> */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Form className="mg-admin-login-form">
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="formGroupEmail" style={{ textAlign:"left"}}>
                <Form.Label>&nbsp;&nbsp;Email address</Form.Label>
                <Form.Control type="email" placeholder="Please enter your email address" onChange={emailChange} />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="formGroupPassword" style={{ textAlign: "left" }}>
                <Form.Label>&nbsp;&nbsp;Password</Form.Label>
                <InputGroup>
                  <Form.Control type="password" placeholder="Enter your password" onChange={passwordChange} onKeyDown={handleKeyDown} />
                  <Button variant="outline-primary" style={{ minWidth: 90 }} onClick={() => loginClick()}>Login</Button>
                </InputGroup>
              </Form.Group>
            </Col>
            {errMarkup}
            <div style={{ marginBottom: 40 }}></div>

            <Stack direction="horizontal" gap={3} className="d-none d-sm-flex" style={{ marginTop: 10 }}>
              <div className="me-auto">Other sign-in options:</div>
              <div className="vr" />
              <GoogleLoginComp />
            </Stack>
            <Stack direction="vertical" className="d-flex d-sm-none" style={{ marginTop: 10 }}>
              <div className="me-auto"></div>
              <div style={{ maxWidth: 250, alignSelf: "flex-start" }}>
                Other sign-in options...
              </div>
              <hr />
              <div style={{ maxWidth: 250, alignSelf: "flex-end" }}>
                <GoogleLoginComp />
              </div>
            </Stack>

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