import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form, InputGroup } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import { useHistory, Link } from "react-router-dom";
import Label from "../../components/core/Label";
import { toast } from "react-toastify";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import Modal from "react-bootstrap/Modal";

// SCSS
import "../../css/Login.scss";

// API Call
import Api from "../../Api";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// Roles

import { ROLES_PARENT, ROLES_STUDENT, ROLES_ADMIN, ROLES_TEACHER } from "../../constants/roles";
import { Card } from "@material-ui/core";
import { gapi } from "gapi-script";

const Login = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const history = useHistory();
  let scope = "https://www.googleapis.com/auth/cloud-platform.read-only";
  const CLIENT_ID = "313952593707-fcr3sl5satv8bb6e2kg9n0363mnom208.apps.googleusercontent.com";
  const tooglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  // Success Handler
  const responseGoogleSuccess = (response) => {
    Api.post("/api/v1/user/login", {
      tokenId: response.tokenId,
      googleId: response.googleId,
      isGoogleLogin: true,
    })
      .then((res) => {
        const data = res.data.updateToken;
        const token = data.token;
        const parentId = data.parentId ? data.parentId : null;
        const studentId = data.studentId ? data.studentId : null;
        const teacherId = data.teacherId ? data.teacherId : null;
        const role = data.role;
        const userId = data.id;
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);
        localStorage.setItem("parentId", parentId);
        localStorage.setItem("studentId", studentId);
        localStorage.setItem("teacherId", teacherId);
        localStorage.setItem("token", token);
        const isParent = role === ROLES_PARENT;
        const isStudent = role === ROLES_STUDENT;
        const isTeacher = role === ROLES_TEACHER;
        if (!res.data.dataVerified) {
          isTeacher
            ? history.push(`/teacher/edit/${teacherId}`)
            : isStudent && history.push(`/edit/student/details/${studentId}`);
        } else {
          history.push("/dashboard");
        }
        window.location.reload();
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
        }
      });
  };

  //FaceBook
  const responseFacebook = (response) => {
    Api.post("api/v1/user/login", {
      faceBookId: response.id,
      isFaceBookLogin: true,
      firstName: response.first_name,
      lastName: response.last_name,
      email: response.email,
    })
      .then((res) => {
        const token = res.data.updateToken.token;
        const parentId = res.data.updateToken.parentId;
        const studentId = res.data.updateToken.studentId;
        const teacherId = res.data.updateToken.teacherId;
        const role = res.data.updateToken.role;
        const userId = res.data.updateToken.id;
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);
        localStorage.setItem("parentId", parentId);
        localStorage.setItem("studentId", studentId);
        localStorage.setItem("teacherId", teacherId);
        localStorage.setItem("token", token);
        const isParent = role === ROLES_PARENT;
        const isStudent = role === ROLES_STUDENT;
        const isTeacher = role === ROLES_TEACHER;
        if (!res.data.dataVerified) {
          isTeacher
            ? history.push(`/teacher/edit/${teacherId}`)
            : isStudent && history.push(`/edit/student/details/${studentId}`);
        } else {
          history.push("/dashboard");
        }
        window.location.reload();
      })
      .catch((error) => {
        // console.log("error login facebook", error);

        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
        }
      });
  };

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Error Handler
  const responseGoogleError = (response) => {
    // alert(response);
    toast.error(response?.error);
  };

  // Sub
  const submit = (values, { resetForm }) => {
    const email = values.email.toLowerCase();
    Api.post("api/v1/user/login", {
      email: email,
      password: values.password,
    })
      .then((response) => {
        const status = response.data.status;
        if (status === "Created") {
          const token = response.data.updateToken.token;
          const parentId = response.data.updateToken.parentId;
          const studentId = response.data.updateToken.studentId;
          const teacherId = response.data.updateToken.teacherId;
          const role = response.data.updateToken.role;
          const userId = response.data.updateToken.id;
          const userName = response.data.updateToken.email;
          localStorage.setItem("token", token);
          localStorage.setItem("parentId", parentId);
          localStorage.setItem("studentId", studentId);
          localStorage.setItem("teacherId", teacherId);
          localStorage.setItem("role", role);
          localStorage.setItem("userId", userId);
          localStorage.setItem("userName", userName);
          resetForm({ values: "" });

          history.push({
            pathname: "/dashboard",
            state: { sidebar: true, pageOpen: token },
          });
        }
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
        }
      });
  };

  // Validation
  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Enter Valid Email").required("Email Is Required"),
    password: Yup.string()
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#*$%^&])",
        "Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
      )
      .min(8, "Password Required Minimum 8 Characters")
      .required("Password Is Required"),
  });

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: scope,
      });
    };
    gapi.load("client:auth2", initClient);
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.clear();
      window.location.reload();
    }
  }, []);

  return (
    <Container>
      <Row>
        <Col lg={6} md={7} sm={12} className=" p-5 m-auto shadow -sm rounded-lg my-4  teacer-sign-background">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginSchema}
            onSubmit={(values, { resetForm }) => submit(values, { resetForm })}
          >
            {(formik) => {
              const { values, handleChange, handleSubmit, handleBlur } = formik;
              return (
                <div>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <h4
                        className="d-flex justify-content-center mb-2"
                        style={{ fontFamily: "none", fontWeight: "bold" }}
                      >
                        Login
                      </h4>
                      <div className="google-login d-flex justify-content-center pt-3">
                        <GoogleLogin
                          clientId={CLIENT_ID}
                          buttonText="Login with Google"
                          onSuccess={responseGoogleSuccess}
                          onFailure={responseGoogleError}
                          isSignedIn={false}
                          cookiePolicy={"single_host_origin"}
                        />
                      </div>
                      <div className="pt-3">
                        <FacebookLogin
                          appId="766552864322859"
                          autoLoad={false}
                          textButton="Login with Facebook"
                          fields="first_name,last_name,email,picture"
                          scope="public_profile,email,user_friends"
                          callback={responseFacebook}
                          icon="fa-facebook"
                        />
                      </div>
                      <hr className="or-divider my-4" />
                      <Col md="12">
                        <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                          <Label notify={true}>Email </Label>
                          <Form.Control
                            type="type"
                            name="email"
                            id="email"
                            style={{ textTransform: "lowercase" }}
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width"
                            placeholder="Email Address"
                          />
                          <ErrorMessage name="email" component="span" className="error text-danger error-message" />
                        </Form.Group>
                      </Col>
                      <Col md="12" className="mb-3">
                        <Form.Group className="form-row" style={{ marginRight: 20, width: "100%" }}>
                          <Label notify={true}>Password </Label>
                          <InputGroup className="input-group ">
                            <Form.Control
                              type={passwordShown ? "text" : "password"}
                              name="password"
                              id="password"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                              placeholder="Password"
                              onCopy={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                              onPaste={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                            />
                            <InputGroup.Text>
                              <FontAwesomeIcon
                                icon={passwordShown ? faEye : faEyeSlash}
                                onClick={tooglePasswordVisibility}
                                size="1x"
                              />
                            </InputGroup.Text>
                          </InputGroup>
                          <ErrorMessage name="password" component="span" className="error text-danger error-message" />
                        </Form.Group>
                      </Col>
                      <div className="d-flex justify-content-center mt-3">
                        <Button className="login-button" variant="contained" color="primary" type="submit">
                          Login
                        </Button>
                      </div>
                      <div className="d-flex justify-content-end pe-4 mt-3 mb-3">
                        <Link
                          className="linkColor"
                          to={{
                            pathname: "/forgot/password",
                          }}
                        >
                          Forgot Password
                        </Link>
                        <br />
                      </div>
                      <hr className="or-divider my-4" />
                      <div className="d-flex flex-direction-row text-center">
                        <text className="login-button">
                          Don't have an account?
                          <a onClick={() => setShow(true)} className="login-button sign-up-button ms-2">
                            Sign Up
                          </a>
                        </text>
                      </div>
                    </Row>
                  </Form>
                </div>
              );
            }}
          </Formik>
        </Col>
        <Modal show={show} size="md" centered onHide={handleClose}>
          <Card>
            <Modal.Header className="Modal-border" closeButton></Modal.Header>
            <Modal.Body>
              <Row className="mx-4">
                <Link
                  className="signup-link-color text-center py-2 mt-3"
                  to={{
                    pathname: `/parent/signup`,
                  }}
                >
                  Signup as Parent
                </Link>
                <Link
                  className="signup-link-color text-center py-2 mt-3"
                  to={{
                    pathname: `/student/signup`,
                  }}
                >
                  Signup as Student
                </Link>
                <Link
                  className="signup-link-color text-center py-2 mt-3"
                  to={{
                    pathname: `/teacher/signup`,
                  }}
                >
                  Signup as Teacher
                </Link>
              </Row>
            </Modal.Body>
            <Modal.Footer className="Modal-border">
              <Button variant="secondary" onClick={() => setShow(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Card>
        </Modal>
      </Row>
    </Container>
  );
};

export default Login;
