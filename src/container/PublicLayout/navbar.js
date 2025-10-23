import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import curveImg from "../../components/LandingPage/images/curveImg.png";
import KharpiLogo from "../../components/LandingPage/images/KharpiLogo.png";
import loginArrow from "../../components/LandingPage/images/loginArrow.png";

function NavbarLoginBefore(props) {
  const history = useHistory();
  const [role, setrole] = useState();

  useEffect(() => {
    const role = localStorage.getItem("role");
    setrole(role);
  }, []);

  return (
    <div>
      <div className="curve-shape-main-div">
        <div className="curve-shape-main-div-sec">
          <img src={curveImg} alt="" className="curve-shape-main-image" />
        </div>
        <div className="kharpi-img-div">
          <img src={KharpiLogo} onClick={() => history.push("/kharpi")} alt="kharphi-logo" className="kharpi-logo" />
          {role === "admin" || role === "teacher" || role === "parent" || role === "student" ? null : (
            <div className="login-arrow-div me-0" onClick={() => history.push("/login")}>
              <img src={loginArrow} className="login-arrow" />
              <p className="login-pTag mb-0 mx-1 ">Login</p>
            </div>
          )}
        </div>
        <div className="kharpi-img-div-two">
          <div className="mt-4 d-md-flex flex-sm-column flex-md-row">
            <p className="links mx-xs-2 mx-md-4" onClick={() => history.push("/course/search")}>
              Courses
            </p>
            <p className="links mx-xs-2 mx-md-4" onClick={() => history.push("/trainers")}>
              Trainers
            </p>
            <p className="links mx-xs-2 mx-md-4" onClick={() => history.push("/about-us")}>
              About Us
            </p>
            <p className="links mx-xs-2 mx-md-4" onClick={() => history.push("/help")}>
              Help
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavbarLoginBefore;
