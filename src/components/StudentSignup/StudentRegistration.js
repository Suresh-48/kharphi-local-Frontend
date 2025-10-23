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
import Select from "react-select";
import moment from "moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";

// Roles
import { ROLES_PARENT } from "../../constants/roles";

//Styles
import "../../css/StudentRegistration.scss";

// Component
import Label from "../../components/core/Label";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import {
  faEye,
  faEyeSlash,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import { customStyles } from "../core/Selector";
import { gapi } from "gapi-script";

const options = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const StudentRegistration = (props) => {
  const [parentId, setparentId] = useState(null);
  const [courseId, setcourseId] = useState(
    props?.props?.location?.state?.courseId
  );
  const [isSubmit, setisSubmit] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [gender, setgender] = useState("");
  const [dob, setdob] = useState("");
  const [role, setrole] = useState("");
  const [aliasName, setaliasName] = useState(
    props?.props?.location?.state?.aliasName
  );
  let scope = "https://www.googleapis.com/auth/cloud-platform.read-only";

  const isParent = role === ROLES_PARENT;
  const CLIENT_ID =
    "313952593707-fcr3sl5satv8bb6e2kg9n0363mnom208.apps.googleusercontent.com";
  let faceBookId = "766552864322859";

  // Success Handler
  const responseGoogleSuccess = (response) => {
    Api.post("/api/v1/student/signup", {
      tokenId: response.tokenId,
      googleId: response.googleId,
      isGoogleLogin: true,
      parentId: parentId,
    })
      .then((res) => {
        if (parentId) {
          history.goBack();
        } else if (!res.data.dataVerified) {
          const role = res.data.studentLogin.role;
          const userId = res.data.studentLogin.id;
          const studentId = res.data.studentLogin.studentId;
          const token = res.data.studentLogin.token;
          localStorage.setItem("role", role);
          localStorage.setItem("userId", userId);
          localStorage.setItem("studentId", studentId);
          localStorage.setItem("token", token);
          history.push({
            pathname: `/edit/student/details/${studentId}`,
            state: { courseId: courseId, aliasName: aliasName },
          });
          window.location.reload();
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

  //FaceBook
  const responseFacebook = (response) => {
    Api.post("api/v1/student/signup", {
      faceBookId: response.id,
      isFaceBookLogin: true,
      firstName: response.first_name,
      lastName: response.last_name,
      email: response.email,
    })
      .then((res) => {
        if (parentId) {
          history.goBack();
        } else if (!res.data.dataVerified) {
          const role = res.data.studentLogin.role;
          const userId = res.data.studentLogin.id;
          const studentId = res.data.studentLogin.studentId;
          const token = res.data.studentLogin.token;
          localStorage.setItem("role", role);
          localStorage.setItem("userId", userId);
          localStorage.setItem("studentId", studentId);
          localStorage.setItem("token", token);
          history.push({
            pathname: `/edit/student/details/${studentId}`,
            state: { courseId: courseId, aliasName: aliasName },
          });
          window.location.reload();
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

  // Error Handler
  const responseGoogleError = (response) => {
    toast.error(response);
  };
  const [captcha, setCaptcha] = useState("");

  // Date Format
  const setDateFormat = (e) => {
    let dateValue = moment(e).format("LLLL");
    let dateOfBirth = new Date(dateValue);
    let month = Date.now() - dateOfBirth.getTime();
    let getAge = new Date(month);
    let year = getAge.getUTCFullYear();
    let age = Math.abs(year - 1970);

    if (age >= 5 && age <= 18) {
      setdob(dateValue);
    } else {
      toast.warning("Your Age Must Be at least 5 years to at most 18 years");
      setdob(null);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const tooglePasswordVisibility = () => {
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

  const history = useHistory();

  useEffect(() => {
    getRandomCaptcha();
    let parentId = localStorage.getItem("parentId");
    const role = localStorage.getItem("role");
    setrole(role);
    setparentId(parentId);
    const initClient = () => {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: scope,
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  //Submit Form
  const submitForm = (values) => {
    const user_captcha = values.captcha;
    const email = values.email.toLowerCase();
    const startDate = dob;
    const dateValue = moment(startDate).format("ll");
    setisSubmit(true);
    if (
      values.password === values.confirmPassword &&
      captcha === user_captcha
    ) {
      getRandomCaptcha();
      Api.post("api/v1/student/signup", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        parentId: parentId,
        dob: dateValue,
        gender: gender,
      })
        .then((response) => {
          setisSubmit(false);
          const status = response.status;
          if (status === 201) {
            if (parentId) {
              history.push({
                pathname: "/dashboard",
                state: { sidebar: true },
              });
              // window.location.reload();
            } else {
              const role = response.data.studentLogin.role;
              const userId = response.data.studentLogin.id;
              const studentId = response.data.studentLogin.studentId;
              const token = response.data.studentLogin.token;
              localStorage.setItem("role", role);
              localStorage.setItem("userId", userId);
              localStorage.setItem("studentId", studentId);
              localStorage.setItem("token", token);

              history.push({
                pathname: "/dashboard",
                state: { sidebar: true },
              });
              // window.location.reload();
            }
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

  //Validations
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

    dob: Yup.string().required("Date Of Birth Is Required"),

    gender: Yup.object().required("Gender Is Required"),

    password: Yup.string()
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@*#$%^&])",
        "Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
      )
      .min(8, "Password Required Minimum 8 characters")
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
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
              Student Sign Up
            </h4>
            {role !== "parent" && (
              <div>
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
                    appId={faceBookId}
                    autoLoad={false}
                    textButton="Sign Up with Facebook"
                    fields="first_name,last_name,email,picture"
                    scope="public_profile,email,user_friends"
                    callback={responseFacebook}
                    icon="fa-facebook"
                    disableMobileRedirect={true}
                  />
                </div>
                <hr className="or-divider my-4" />
              </div>
            )}
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                dob: "",
                gender: "",
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
                  setFieldValue,
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
                        <Row className="pe-0">
                          <Col sm={12} md={12} xs={12} lg={6} className="pe-0">
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>Date Of Birth</Label>
                              <br />
                              <KeyboardDatePicker
                                variant="standard"
                                className="start-time-style"
                                style={{ paddingLeft: 10 }}
                                placeholder="Select Date of Birth"
                                helperText={""}
                                InputProps={{
                                  disableUnderline: true,
                                }}
                                maxDate={new Date()}
                                format="MMM dd yyyy"
                                value={dob}
                                onChange={(e) => {
                                  setFieldValue("dob", e);
                                  setDateFormat(e);
                                }}
                                keyboardIcon={
                                  <FontAwesomeIcon
                                    icon={faCalendarDay}
                                    size="sm"
                                    color="grey"
                                    style={{ padding: 0 }}
                                  />
                                }
                              />
                              <ErrorMessage
                                name="dob"
                                component="span"
                                className="error text-danger error-message"
                              />
                            </Form.Group>
                          </Col>
                          <Col sm={12} md={12} xs={12} lg={6} className="pe-0">
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>Gender</Label>
                              <br />
                              <Select
                                id="gender"
                                name="gender"
                                styles={customStyles}
                                value={values.gender}
                                placeholder="Select Gender"
                                onChange={(e) => {
                                  setFieldValue("gender", e);
                                  setgender(e.value);
                                }}
                                options={options}
                              />
                              <ErrorMessage
                                name="gender"
                                component="span"
                                className="error text-danger"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
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
                                  onClick={togglePasswordVisibility}
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
                                type={
                                  confirmPasswordShown ? "text" : "password"
                                }
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
                                  icon={
                                    confirmPasswordShown ? faEye : faEyeSlash
                                  }
                                  style={{ cursor: "pointer" }}
                                  onClick={tooglePasswordVisibility}
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
                                ? "create-account-disable"
                                : "create-account-active"
                            }`}
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={!isValid || isSubmit}
                          >
                            Sign Up as Student
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
      </MuiPickersUtilsProvider>
    </Container>
  );
};
export default StudentRegistration;
