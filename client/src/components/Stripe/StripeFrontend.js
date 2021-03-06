import React from "react";
import axios from "axios";
import { CardElement, injectStripe } from "react-stripe-elements";

import { Button, Row, Col } from "reactstrap";

class TakeMoney extends React.Component {
  constructor(props) {
    super(props);
    this.state = { complete: false };
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    let token = await this.props.stripe.createToken();
    console.log(token);

    axios
      .post("https://musicmaker-4b2e8.firebaseapp.com/teacher/:idTeacher/charge", token)
      .then(response => {
        console.log(response);
        alert("Payment Success");
      })
      .catch(error => {
        console.log("Payment Error: ", error);
        alert("Payment Error");
      });
  }

  render() {
    return (
      <div style={{paddingTop: "15px", paddingBottom: "20px"}}>
        <Row>
          <Col>
            <h3>Send payment?</h3>
          </Col>
        </Row>

        <Row>
          <Col style={{padding: "30px 30px 30px 20px"}}>
            <CardElement />
          </Col>
          <Col>
            <Button onClick={this.submit} style={{marginTop: "20px"}}>Send</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default injectStripe(TakeMoney);
