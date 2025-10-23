import React, { useState, useRef, useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, Form, FormControl, Dropdown, InputGroup } from "react-bootstrap";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import Button from "@material-ui/core/Button";

// Api
import Api from "../../Api";

import "../../css/ParentSignup.scss";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

// Component
import Label from "../../components/core/Label";
import Loader from "../../components/core/Loader";
import states from "../../components/core/States";
import profile from "../core/NoProfile.png";
import { customStyles } from "../core/Selector";

// Validations
const EmailSignInSchema = Yup.object().shape({
  // validation schema for email sign-in
});

const GoogleAndFacebookSignInSchema = Yup.object().shape({
  // validation schema for Google and Facebook sign-in
});

const EditParentDetails = (props) => {
  const [details, setDetails] = useState([]);
  const [parentId, setParentId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [state, setState] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [stateCode, setStateCode] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [fileUploadState, setFileUploadState] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const inputReference = useRef();

  // Logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 2000);
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const tooglePasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  const fileUploadAction = () => inputReference.current.click();

  const fileUploadInputChange = async (e) => {
    const userId = localStorage.getItem("userId");

    const file = e.target.files[0];
    const type = file?.type?.split("/")[0];
    const base64 = await convertBase64(file);
    setImagePreview(base64);
    if (type === "image") {
      Api.post("api/v1/parent/profile/upload", {
        parentId: parentId,
        image: imagePreview,
        userId: userId,
      })
        .then((response) => {
          const status = response.status;
          if (status === 201) {
            toast.success("Profile Upload Successfully!...");
            parentDetails();
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

          const errorStatus = error?.response?.status;
          if (errorStatus === 401) {
            logout();
            toast.error("Session Timeout");
          }
        });
    } else {
      toast.error("Image Only Accept");
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const removeImage = () => {
    const userId = localStorage.getItem("userId");

    Api.delete("api/v1/parent/remove/profile", {
      params: {
        parentId: parentId,
        userId: userId,
      },
    }).then((response) => {
      parentDetails();
      window.location.reload();
    });
    setImagePreview("");
  };

  const parentDetails = () => {
    let userId = localStorage.getItem("userId");

    Api.get(`api/v1/user/${userId}`, { headers: { userId: userId } })
      .then((res) => {
        const data = res?.data?.data?.getOne;
        setParentId(data.parentId);
        Api.get(`api/v1/parent/${parentId}`, { headers: { userId: userId } })
          .then((res) => {
            const data = res.data.data.getOne;
            setDetails(data);
            setIsLoading(false);
            setFirstName(data?.firstName);
            setMiddleName(data?.middleName);
            setLastName(data?.lastName);
            setAddress1(data?.address1);
            setAddress2(data?.address2);
            setPhone(data?.phone);
            setImagePreview(data?.imageUrl);
            setEmail(data?.email);
            setZipCode(data?.zipCode);
            setCity(data?.city ? { value: data?.city, label: data?.city } : "");
            setCityValue(data?.city);
            setState(data?.state ? { value: data?.state, label: data?.state } : "");
            setStateValue(data?.state);
            setPassword(data?.password);
            setConfirmPassword(data?.confirmPassword);
          })
          .catch((error) => {
            const errorStatus = error?.response?.status;
            if (errorStatus === 401) {
              logout();
              toast.error("Session Timeout");
            }
          });
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  useEffect(() => {
    parentDetails();
  }, []);

  const submitForm = (values) => {
    const userId = localStorage.getItem("userId");

    setIsSubmit(true);
    const email = values.email.toLowerCase();
    const city = values.city.value ? values.city.value : "";
    const state = values.state.value ? values.state.value : "";
    Api.patch(`api/v1/parent/${parentId}`, {
      firstName: values.firstName,
      lastName: values.lastName,
      middleName: values.middleName ? values.middleName : "",
      phone: values.phoneNumber ? values.phoneNumber : "",
      email: email,
      address1: values.address1 ? values.address1 : "",
      address2: values.address2 ? values.address2 : "",
      city: city,
      state: state,
      zipCode: values.zipCode ? values.zipCode : "",
      password: values.password,
      confirmPassword: values.confirmPassword,
      loginType: details.loginType,
      userId: userId,
    })
      .then((response) => {
        const status = response.status;
        if (status === 201) {
          setIsSubmit(false);
          toast.success("Updated");
          props.history.push({ state: { sidebar: true } });
          parentDetails();
        }
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          if (error.response.data.error.statusCode === 500) {
            toast.error("Details already exist");
          } else {
            toast.error(error.response.data.message);
          }
        }
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const Index = (value) => {
    let selectState = value;
    for (let i = 0; i < states.length; i++) {
      if (states[i].state === selectState.value) {
        setStateCode(i);
      }
    }
  };

  return (
    <Container className="mb-3">
      {isLoading ? (
        <Loader />
      ) : (
        <Container className="pt-1">
          <Row className="mt-4 py-0 profile-dropdown-status mb-4">
            <Formik
              enableReinitialize={true}
              initialValues={{
                firstName: firstName,
                lastName: lastName,
                middleName: middleName,
                phoneNumber: phone,
                email: email,
                address1: address1,
                address2: address2,
                state: state,
                city: city,
                zipCode: zipCode,
                password: password,
                confirmPassword: confirmPassword,
              }}
              validationSchema={details.loginType === "Email" ? EmailSignInSchema : GoogleAndFacebookSignInSchema}
              onSubmit={(values) => submitForm(values)}
            >
              {(formik) => {
                const { values, handleChange, handleSubmit, setFieldValue, handleBlur, isValid } = formik;
                return (
                  <div>
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col
                          sm={12}
                          xs={12}
                          md={12}
                          lg={4}
                          className="d-flex justify-content-center px-4 pt-2"
                          style={{ backgroundColor: "#0000000a" }}
                        >
                          <Dropdown className="dropdown-profile-list">
                            <Dropdown.Toggle className="teacher-menu-dropdown p-0" varient="link">
                              <div>
                                <div>
                                  {imagePreview ? (
                                    <img src={imagePreview} width="220" height="220" style={{ borderRadius: "50%" }} />
                                  ) : (
                                    <Avatar
                                      src={profile}
                                      size="220"
                                      round={true}
                                      color="silver"
                                      className="image-size"
                                    />
                                  )}
                                </div>
                                <div className="d-flex justify-content-center mt-2">
                                  <p style={{ fontSize: 11, color: "black" }}>Click Here To Upload Profile</p>
                                  <FontAwesomeIcon icon={faPen} size="sm" color="#1d1464" className="mx-1" />
                                </div>
                              </div>
                            </Dropdown.Toggle>
                            <Dropdown.Menu center className="profile-dropdown-status ms-4 py-0">
                              <Dropdown.Item className="status-list">
                                <Link to="#" className="change-profile-text-style" onClick={() => fileUploadAction()}>
                                  Change Profile
                                </Link>
                              </Dropdown.Item>
                              <hr />
                              <Dropdown.Item className="status-list">
                                <Link
                                  to="#"
                                  className="change-profile-text-style"
                                  onClick={() => {
                                    removeImage();
                                  }}
                                >
                                  Remove Profile
                                </Link>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                          <input
                            type="file"
                            name="courseImage"
                            accept="image/*"
                            className="fileToUpload"
                            ref={inputReference}
                            id="fileToUpload"
                            style={{ display: "none" }}
                            onChange={(e) => fileUploadInputChange(e)}
                          />
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={8} className="pt-5 pb-5 px-4">
                          <div className="row d-flex justify-content-center">
                            <Col xs={12} sm={4} md={4}>
                              <Form.Group className="form-row mb-3">
                                <Label notify={true}>First Name</Label>
                                <br />
                                <FormControl
                                  type="type"
                                  name="firstName"
                                  placeholder="First Name"
                                  id="firstName"
                                  value={values.firstName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                                <ErrorMessage name="firstName" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                            <Col xs={12} sm={4} md={4}>
                              <Form.Group className="form-row mb-3">
                                <Label>Middle Name</Label>
                                <br />
                                <FormControl
                                  type="type"
                                  name="middleName"
                                  placeholder="Middle Name"
                                  id="middleName"
                                  value={values.middleName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                                <ErrorMessage name="middleName" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                            <Col xs={12} sm={4} md={4}>
                              <Form.Group className="form-row mb-3">
                                <Label notify={true}>Last Name</Label>
                                <br />
                                <FormControl
                                  type="type"
                                  placeholder="Last Name"
                                  name="lastName"
                                  id="lastName"
                                  value={values.lastName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                                <ErrorMessage name="lastName" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                            <Col sm={6} xs={12}>
                              <Form.Group className="form-row mb-3">
                                <Label notify={true}>Email</Label>
                                <FormControl
                                  type="email"
                                  placeholder="Email Address"
                                  name="email"
                                  id="email"
                                  disabled={details.loginType !== "Email"}
                                  style={{ textTransform: "lowercase" }}
                                  value={values.email}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                                <ErrorMessage name="email" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                            <Col sm={6} xs={12}>
                              <Form.Group className="form-row mb-3">
                                <Label>Phone Number</Label>
                                <br />
                                <InputGroup className="mb-3">
                                  <InputGroup.Text id="basic-addon1">+1</InputGroup.Text>
                                  <FormControl
                                    type="tel"
                                    placeholder="PhoneNumber"
                                    maxlength="10"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    value={values.phoneNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-width"
                                  />
                                </InputGroup>
                                <ErrorMessage name="phoneNumber" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                          </div>
                          <div className="row d-flex justify-content-center">
                            <Col sm={6} xs={12}>
                              <Form.Group className="form-row mb-3">
                                <Label>Address Line 1</Label>
                                <br />
                                <FormControl
                                  type="type"
                                  name="address1"
                                  placeholder="Address 1"
                                  id="address1"
                                  value={values.address1}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                                <ErrorMessage name="address1" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                            <Col sm={6} xs={12}>
                              <Form.Group className="form-row mb-3">
                                <Label>Address Line 2</Label>
                                <br />
                                <FormControl
                                  type="text"
                                  name="address2"
                                  placeholder="Address2"
                                  id="address2"
                                  value={values.address2}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                                <ErrorMessage name="address2" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                          </div>
                          <div className=" row d-flex justify-content-center">
                            <Col sm={4} xs={12}>
                              <Form.Group className="form-row mb-3">
                                <Label>State</Label>
                                <br />
                                <Select
                                  styles={customStyles}
                                  value={values.state}
                                  name="state"
                                  placeholder="State"
                                  onChange={(e) => {
                                    Index(e);
                                    setFieldValue("state", e);
                                    setFieldValue("city", "");
                                  }}
                                  options={[
                                    {
                                      options: states.map((item) => ({
                                        label: item.state,
                                        value: item.state,
                                      })),
                                    },
                                  ]}
                                />
                              </Form.Group>
                            </Col>
                            <Col sm={4} xs={12}>
                              <Form.Group className="form-row mb-3">
                                <Label>City</Label>
                                <Select
                                  placeholder="City"
                                  style={customStyles}
                                  value={values.city}
                                  onChange={(e) => {
                                    setFieldValue("city", e);
                                  }}
                                  options={[
                                    {
                                      options: states[stateCode].cities.map((item, key) => ({
                                        label: item,
                                        value: item,
                                      })),
                                    },
                                  ]}
                                />
                              </Form.Group>
                            </Col>
                            <Col sm={4} xs={12}>
                              <Form.Group className="form-row mb-3">
                                <Label>Zip Code</Label>
                                <br />
                                <FormControl
                                  type="text"
                                  name="zipCode"
                                  placeholder="Zip Code"
                                  id="zipCode"
                                  value={values.zipCode}
                                  maxLength="5"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                                <ErrorMessage name="zipCode" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                          </div>
                          {details.loginType === "Email" && (
                            <div>
                              <div className="mt-2">
                                <Link
                                  className="link-decoration ps-1"
                                  style={{
                                    fontSize: 17,
                                    fontFamily: "none",
                                  }}
                                  to={{
                                    pathname: `/set/password`,
                                  }}
                                >
                                  Reset Password
                                </Link>
                              </div>
                            </div>
                          )}
                          <div className="d-flex justify-content-end my-3 pt-4">
                            <Button
                              className={`${isSubmit ? "save-changes-disable" : "save-changes-active"}`}
                              variant="contained"
                              type="submit"
                              onClick={handleSubmit}
                              disabled={isSubmit === true}
                            >
                              SAVE CHANGES
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                );
              }}
            </Formik>
          </Row>
        </Container>
      )}
    </Container>
  );
};

export default EditParentDetails;
