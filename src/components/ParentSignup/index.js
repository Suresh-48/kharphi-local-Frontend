import React, { useEffect, useState } from "react";
import Api from "../../Api";
import {
  Col,
  Container,
  Row,
  Form,
  Button,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { gapi } from "gapi-script";

// Styles
import "../../css/ParentSignup.scss";

// Component
import Label from "../../components/core/Label";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";

const ParentSignup = (props) => {
  const history = useHistory();
  const [courseId, setcourseId] = useState(props?.location?.state?.courseId);
  const [isSubmit, setisSubmit] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  let scope = "https://www.googleapis.com/auth/cloud-platform.read-only";
  const CLIENT_ID =
    "313952593707-fcr3sl5satv8bb6e2kg9n0363mnom208.apps.googleusercontent.com";
  // Success Handler
  const responseGoogleSuccess = (response) => {
    Api.post("api/v1/parent/signup", {
      tokenId: response.tokenId,
      googleId: response.googleId,
      isGoogleLogin: true,
    })
      .then((res) => {
        const role = res.data.parentLogin.role;
        const userId = res.data.parentLogin.id;
        const parentId = res.data.parentLogin.parentId;
        const token = res.data.parentLogin.token;
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);
        localStorage.setItem("parentId", parentId);
        localStorage.setItem("token", token);
        if (courseId) {
          history.goBack();
        } else if (!res.data.dataVerified) {
          history.push(`/edit-parent-details`);
        } else {
          history.push(`/dashboard`);
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
    Api.post("api/v1/parent/signup", {
      faceBookId: response.id,
      isFaceBookLogin: true,
      firstName: response.first_name,
      lastName: response.last_name,
      email: response.email,
    })
      .then((res) => {
        const role = res.data.parentLogin.role;
        const userId = res.data.parentLogin.id;
        const parentId = res.data.parentLogin.parentId;
        const token = res.data.parentLogin.token;
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);
        localStorage.setItem("parentId", parentId);
        localStorage.setItem("token", token);
        if (courseId) {
          history.goBack();
        } else if (!res.data.dataVerified) {
          history.push(`/edit-parent-details`);
        } else {
          history.push(`/dashboard`);
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

  // Error Handler
  const responseGoogleError = (response) => {
    toast.error(response);
  };

  const [captcha, setCaptcha] = useState("");

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const togglePasswordVisibility = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };

  const getRandomCaptcha = () => {
    let randomChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    setCaptcha(result);
  };

  useEffect(() => {
    getRandomCaptcha();
    const initClient = () => {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: scope,
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  const submitForm = (values) => {
    const user_captcha = values.captcha;

    if (
      values.password === values.confirmPassword &&
      captcha === user_captcha
    ) {
      const email = values.email.toLowerCase();
      getRandomCaptcha();
      setisSubmit(true);
      Api.post("api/v1/parent/signup", {
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.middleName,
        email: email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
        .then((response) => {
          setisSubmit(false);
          const status = response.status;
          if (status === 201) {
            const role = response.data.parentLogin.role;
            const userId = response.data.parentLogin.id;
            const parentId = response.data.parentLogin.parentId;
            const token = response.data.parentLogin.token;
            localStorage.setItem("role", role);
            localStorage.setItem("userId", userId);
            localStorage.setItem("parentId", parentId);
            localStorage.setItem("token", token);
            if (courseId) {
              history.goBack();
            } else {
              history.push({
                pathname: "/dashboard",
                state: { sidebar: true },
              });
            }
            // window.location.reload();
          } else {
            toast.error(response.data.message);
            setisSubmit(false);
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

            values.captcha = "";
            setisSubmit(false);
          }
          setisSubmit(false);
        });
    } else {
      setisSubmit(false);
      toast.error("Captcha Does Not Match");
      values.captcha = "";

      getRandomCaptcha();
    }
  };

  // Validation
  const loginSchema = Yup.object().shape({
    firstName: Yup.string()
      .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
      .matches(/^[A-Z]/, "First Letter Must Be In Capital")
      .required("First Name Is Required"),
    lastName: Yup.string()
      .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
      .matches(/^[A-Z]/, "First Letter Must Be In Capital")
      .required("Last Name Is Required"),
    email: Yup.string()
      .email("Enter Valid Email")
      .required("Email Is Required"),
    password: Yup.string()
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$*%^&])",
        "Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
      )
      .min(8, "Password Required Minimum 8 Characters")
      .required("Password Is Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#*$%^&])",
        "Confirm Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
      )
      .required("Confirm Password Is Required"),
    captcha: Yup.string()
      .min(6, "Captcha required minimum 6 characters ")
      .max(6, "Captcha maximum 6 characters")
      .required("Captcha Is Required"),
  });

  return (
    <Container className="mb-5">
      <Row className="mt-4">
        <Col
          lg={6}
          md={6}
          sm={12}
          className="pb-5 ps-5 pe-5 pt-4 m-auto shadow -sm rounded-lg teacer-sign-background"
        >
          <h4
            className="d-flex justify-content-center mb-2"
            style={{ fontFamily: "none", fontWeight: "bold" }}
          >
            Parent Sign Up
          </h4>
          <div className="google-login d-flex justify-content-center pt-2">
            <GoogleLogin
              clientId={CLIENT_ID}
              buttonText="Sign Up with Google"
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
              textButton="Sign Up with Facebook"
              fields="first_name,last_name,email,picture"
              scope="public_profile,email,user_friends"
              callback={responseFacebook}
              icon="fa-facebook"
            />
          </div>
          <hr className="or-divider my-4" />
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirmPassword: "",
              captcha: "",
            }}
            validationSchema={loginSchema}
            onSubmit={(values) => submitForm(values)}
          >
            {(formik) => {
              const {
                values,
                handleChange,
                handleSubmit,
                handleBlur,
                isValid,
              } = formik;
              return (
                <div>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md="12">
                        <Form.Group
                          className="form-row mb-3"
                          style={{ marginRight: 20, width: "100%" }}
                        >
                          <Label notify={true}>First Name</Label>
                          <FormControl
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width"
                            placeholder="First Name"
                          />
                          <ErrorMessage
                            name="firstName"
                            component="span"
                            className="error text-danger"
                          />
                        </Form.Group>
                      </Col>
                      <Col md="12" className="mb-3">
                        <Form.Group
                          className="form-row"
                          style={{ marginRight: 20, width: "100%" }}
                        >
                          <Label notify={true}>Last Name</Label>
                          <FormControl
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width"
                            placeholder="Last Name"
                          />
                          <ErrorMessage
                            name="lastName"
                            component="span"
                            className="error text-danger"
                          />
                        </Form.Group>
                      </Col>
                      <Col md="12" className="mb-3">
                        <Form.Group
                          className="form-row"
                          style={{ marginRight: 20, width: "100%" }}
                        >
                          <Label notify={true}>Email</Label>
                          <FormControl
                            type="email"
                            name="email"
                            id="email"
                            style={{ textTransform: "lowercase" }}
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width"
                            placeholder="Email Address"
                          />
                          <ErrorMessage
                            name="email"
                            component="span"
                            className="error text-danger"
                          />
                        </Form.Group>
                      </Col>
                      <Col md="12" className="mb-3">
                        <Form.Group
                          className="form-row"
                          style={{ marginRight: 20, width: "100%" }}
                        >
                          <Label notify={true}>Password</Label>
                          <InputGroup className="input-group ">
                            <FormControl
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
                                style={{ cursor: "pointer" }}
                                onClick={togglePasswordVisiblity}
                                size="1x"
                              />
                            </InputGroup.Text>
                          </InputGroup>
                          <ErrorMessage
                            name="password"
                            component="span"
                            className="error text-danger"
                          />
                        </Form.Group>
                      </Col>
                      <Col md="12" className="mb-3">
                        <Form.Group
                          className="form-row"
                          style={{ marginRight: 20, width: "100%" }}
                        >
                          <Label notify={true}>Confirm Password</Label>
                          <InputGroup className="input-group ">
                            <FormControl
                              type={confirmPasswordShown ? "text" : "password"}
                              name="confirmPassword"
                              id="confirmPassword"
                              value={values.confirmPassword}
                              onChange={handleChange}
                              onCopy={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                              onPaste={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                              onBlur={handleBlur}
                              className="form-width"
                              placeholder="Confirm Password"
                            />
                            <InputGroup.Text>
                              <FontAwesomeIcon
                                icon={confirmPasswordShown ? faEye : faEyeSlash}
                                style={{ cursor: "pointer" }}
                                onClick={togglePasswordVisibility}
                                size="1x"
                              />
                            </InputGroup.Text>
                          </InputGroup>
                          <ErrorMessage
                            name="confirmPassword"
                            component="span"
                            className="error text-danger"
                          />
                        </Form.Group>
                      </Col>
                      <Row>
                        <Col md="7" className="mb-3">
                          <Form.Group
                            className="form-row"
                            style={{ marginRight: 20, width: "100%" }}
                          >
                            <Label notify={true}>Captcha</Label>

                            <Form.Control
                              type="text"
                              id="captcha"
                              name="captcha"
                              value={values.captcha}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width captcha-field"
                              placeholder="Captcha"
                              onPaste={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                            />
                            <ErrorMessage
                              name="captcha"
                              component="span"
                              className="error text-danger"
                            />
                          </Form.Group>
                        </Col>
                        <Col className="d-flex justify-content-center align-items-center mt-3">
                          <Form.Group
                            className="form-row"
                            style={{ width: "100%" }}
                          >
                            <Form.Label className="captcha-form">
                              <s
                                className="border border-primary px-2 captcha-alignment"
                                style={{ backgroundColor: "azure" }}
                                onCopy={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                              >
                                {captcha}
                              </s>

                              <FontAwesomeIcon
                                icon={faRedoAlt}
                                size="1x"
                                color="#1d1464"
                                className="captcha-text mx-3 mt-1"
                                onClick={() => {
                                  values.captcha = "";
                                  getRandomCaptcha();
                                }}
                              />
                            </Form.Label>
                          </Form.Group>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-center mt-3">
                        <Button
                          className={`${
                            !isValid || isSubmit
                              ? "create-account-disable filter-type"
                              : "create-account-active button-start"
                          }`}
                          variant="contained"
                          disabled={!isValid || isSubmit}
                          type="submit"
                        >
                          Sign Up as parent
                        </Button>
                      </div>
                    </Row>
                  </Form>
                </div>
              );
            }}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default ParentSignup;
