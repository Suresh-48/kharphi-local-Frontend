import React from "react";
import { CardElement } from "@stripe/react-stripe-js";
import {Card} from "react-bootstrap";
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#303238",
      fontSize: "16px",
      fontFamily: "sans-serif",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "black",
      },
    },
    invalid: {
      color: "#e5424d",
      ":focus": {
        color: "#303238",
      },
    },
  },
};

function CardSection() {
  return (
    <div className="stripe-card-container">
      <Card className="stripe-card-width">
        <Card.Header>Card Detail</Card.Header>
        <Card.Body>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </Card.Body>
      </Card>
    </div>
  );
}

export default CardSection;
