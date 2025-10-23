/**
 * Use the CSS tab above to style your Element's container.
 */
import React from "react";
import { CardElement } from "react-stripe-elements";

const style = {
  marginTop: "15px",
  base: {
    color: "#32325d",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};

const CardSection = ({ handleReady, handleChange }) => {
  return (
    <>
      <span className="h5 mr-3 d-block">
        <b>Credit Card Information</b>
      </span>
      <CardElement
        className="MyCardElement"
        style={style}
        onReady={handleReady}
        onChange={handleChange}
      />
    </>
  );
};

export default CardSection;
