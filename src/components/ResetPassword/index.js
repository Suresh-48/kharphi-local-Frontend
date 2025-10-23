import axios from "axios";
import React, { useState } from "react";
import { Col, Container, Row, Form, FormControl, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Label from "../../components/core/Label";
import Api from "../../Api";

const ResetPassword = () => {
  const history = useHistory();
  const [isSubmit, setIsSubmit] = useState(false);

  const submitForm = (values) => {
    setIsSubmit(true);
    const email = values.email.toLowerCase();
    Api.post("api/v1/user/forget/password", {
      email: email,
    })
      .then((response) => {
        history.push({
          pathname: "/password/change",
          state: { email: email },
        });
        toast.success(response.data.message);
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
    email: Yup.string().email("Enter Valid Email").required("Email Is Required"),
  });

  return (
    <Container>
      <Row className="mt-5">
        <Col lg={5} md={6} sm={12} className=" p-5 m-auto shadow -sm rounded-lg">
          <Formik
            initialValues={{
              email: "",
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
                      <h3 className="d-flex justify-content-center mb-3">Forgot Password</h3>

                      <Col md="12">
                        <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                          <Label notify={true}>Email</Label>
                          <FormControl
                            type="email"
                            name="email"
                            id="email"
                            style={{ textTransform: "lowercase" }}
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width mt-1 mb-2"
                            placeholder="Enter Email Address"
                          />
                          <ErrorMessage name="email" component="span" className="error text-danger" />
                        </Form.Group>
                      </Col>

                      <div className="d-flex justify-content-end mt-3">
                        <Button className="create-active Kharpi-save-btn" type="submit" disabled={isSubmit}>
                          Next
                        </Button>
                      </div>
                      <div className="forgot-note mt-2">
                        <p>*Note: Please Enter valid Email to get a New link to generate a new password</p>
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

export default ResetPassword;
