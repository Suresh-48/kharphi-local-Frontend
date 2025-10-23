import React, { useState } from "react";
import { Col, Container, Row, Form, FormControl, Button, InputGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Label from "../../components/core/Label";
import Api from "../../Api";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ChangePassword = (props) => {
  const history = useHistory();
  const [email, setEmail] = useState(props?.location?.state?.email);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  const submitForm = (values) => {
    setIsSubmit(true);
    Api.post("api/v1/user/set/newPassword", {
      email: email,
      verificationCode: values.verificationCode,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    })
      .then((response) => {
        toast.success(response.data.status);
        history.push("/login");
        setIsSubmit(false);
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
          setIsSubmit(false);
        }
      });
  };

  const loginSchema = Yup.object().shape({
    verificationCode: Yup.string().required("Verification Code Is Required"),
    newPassword: Yup.string()
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#*$%^&])",
        "Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
      )
      .min(8, "New Password Should Be Minimum 8 Characters")
      .required("New Password Is Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], " Confirm Password Doesn't match")
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$*%^&])",
        "Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
      )
      .min(8, "Confirm Password Should Be Minimum 8 Characters")
      .required("Confirm Password Is Required"),
  });

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const toogleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col lg={5} md={6} sm={12} className=" p-5 m-auto shadow -sm rounded-lg">
          <Formik
            initialValues={{
              verificationCode: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={loginSchema}
            onSubmit={(values) => submitForm(values)}
          >
            {(formik) => {
              const { values, handleChange, handleSubmit, handleBlur } = formik;
              return (
                <div>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <h3 className="d-flex justify-content-center mb-3">Change Password</h3>

                      <Col md="12">
                        <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                          <Label notify={true}>Verification Code</Label>
                          <FormControl
                            type="text"
                            name="verificationCode"
                            id="verificationCode"
                            value={values.verificationCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width"
                            placeholder="Enter Verification Code"
                          />
                          <ErrorMessage name="verificationCode" component="span" className="error text-danger" />
                        </Form.Group>
                      </Col>
                      <Col md="12">
                        <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                          <Label notify={true}>New Password</Label>
                          <InputGroup className="input-group ">
                            <FormControl
                              type={newPasswordVisible ? "text" : "password"}
                              name="newPassword"
                              id="newPassword"
                              value={values.newPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                              placeholder="Enter New Password"
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
                                icon={newPasswordVisible ? faEye : faEyeSlash}
                                onClick={() => toggleNewPasswordVisibility()}
                                size="1x"
                              />
                            </InputGroup.Text>
                          </InputGroup>
                          <ErrorMessage name="newPassword" component="span" className="error text-danger" />
                        </Form.Group>
                      </Col>
                      <Col md="12">
                        <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                          <Label notify={true}>Confirm Password</Label>
                          <InputGroup className="input-group ">
                            <FormControl
                              type={confirmPasswordVisible ? "text" : "password"}
                              name="confirmPassword"
                              id="confirmPassword"
                              value={values.confirmPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                              placeholder="Enter New Password"
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
                                icon={confirmPasswordVisible ? faEye : faEyeSlash}
                                onClick={() => toogleConfirmPasswordVisibility()}
                                size="1x"
                              />
                            </InputGroup.Text>
                          </InputGroup>
                          <ErrorMessage name="confirmPassword" component="span" className="error text-danger" />
                        </Form.Group>
                      </Col>

                      <div className="d-flex justify-content-end mt-3">
                        <Button className="create-active" type="submit" disabled={isSubmit}>
                          Submit
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

export default ChangePassword;
