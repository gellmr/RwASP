import MyOrdersShowAccountId from '@/Shop/MyOrdersShowAccountId.jsx';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function MyOrdersShowAccountInfo({ accType, idval, fullname, email, devMode }) {

  const devShowAccountId = function () {
    return (
      <MyOrdersShowAccountId accType={accType} idval={idval} />
    );
  }

  return (
    <Col xs={12}>
      <div className="myOrdersRect myOrdersHeadInfo">
        <Row>
          <Col xs={12}>

            <Col xs={12} className="myOrdRow">
              <Row>
                <Col xs={4} sm={3} className="">Account Type:</Col>
                <Col xs={8} sm={9} className="">{accType}</Col>
              </Row>
            </Col>

            {devMode && devShowAccountId()}

            <Col xs={12} className="myOrdRow" style={{}}>
              <Row>
                <Col xs={4} sm={3} className="">Full Name:</Col>
                <Col xs={8} sm={9} className="">{fullname}</Col>
              </Row>
            </Col>

            <Col xs={12} className="myOrdRow" style={{ marginBottom: 15 }}>
              <Row>
                <Col xs={4} sm={3} className="">Email:</Col>
                <Col xs={8} sm={9} className="">{email}</Col>
              </Row>
            </Col>

          </Col>
        </Row>

      </div>
    </Col>
  );
}

export default MyOrdersShowAccountInfo;