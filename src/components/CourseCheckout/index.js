import React from "react";
// import "./styles.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import InjectedCheckoutForm from "../CourseCheckout/courseCheckout.js";

const stripePromise = loadStripe(
  "pk_test_51KixAqSFzQyT0dTSwog01eVXSRD9PcIVzIyRoBVkyRbATdmvdJNPN8RGwV3smny3vbskFCddtQB0ESOJumAmEMMD00kLS9r2ba"
);

const CourseCheckout = (props) => {
  return (
    <div className="App">
      <div className="product">
        <div>
          <Elements stripe={stripePromise}>
            <InjectedCheckoutForm props={props} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default CourseCheckout;
