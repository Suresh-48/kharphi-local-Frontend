import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, FormControl, Modal, Spinner, InputGroup } from "react-bootstrap";
import Select from "react-select";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loader from "../../components/core/Loader";
import Button from "@material-ui/core/Button";
import { ElementsConsumer, CardElement } from "@stripe/react-stripe-js";
import CardSection from "../core/CardSection";
// Styles
import "../../css/CourseCheckout.scss";

import { FaExclamationCircle } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";

// Api
import Api from "../../Api";

// Components
import Label from "../../components/core/Label";
import { toast } from "react-toastify";
import states from "../../components/core/States";
// Roles
import { ROLES_PARENT, ROLES_STUDENT } from "../../constants/roles";
import { customStyles } from "../core/Selector";
import { useHistory } from "react-router-dom";

const role = localStorage.getItem("role");

const isParent = role === ROLES_PARENT;

// Validations
const SignInSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[A-Z]/, "First Letter Must Be In Capital")
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .required("First Name as displayed in Credit Card"),

  lastName: Yup.string()
    .matches(/^[A-Z]/, "First Letter Must Be In Capital")
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .required("Last Name as displayed in Credit Card"),

  address1: Yup.string().required("Address 1 Is Required"),

  address2: Yup.string().nullable(),

  state: Yup.object().required("State Is Required"),

  city: Yup.object().required("City Is Required"),

  zipCode: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{0,4}?[ \\-]*[0-9]{0,4}?$/,
      "Enter Valid Zip Code"
    )
    .matches(/^[0-9]{5}$/, "Zip Code Must Be  5 Digits")
    .required("Zip Code Is Required")
    .nullable(),

  phone: Yup.string()
    .matches(/^[0-9\s]+$/, "Enter Valid Phone Number")
    .min(10, "Enter valid number")
    .max(10, "Enter valid number")
    .required("Phone Number Is Required"),

  email: Yup.string().email("Enter Valid Email").required("Email Is Required"),

  student: isParent && Yup.object().required("Student Name Is Required"),
});
const userId = localStorage.getItem("userId");

const CourseCheckoutScreen = (props) => {
  const [scheduleDetail, setScheduleDetail] = useState(
    props?.props?.location?.state?.scheduleDetail
      ? props?.props?.location?.state?.scheduleDetail
      : props?.props?.location?.state?.scheduleId
  );

  const [courseId, setCourseId] = useState(props?.props?.location?.state?.courseId);
  const [scheduleId, setScheduleId] = useState(
    props?.props?.location?.state?.scheduleId?.id
      ? props?.props?.location?.state?.scheduleId?.id
      : props?.props?.location?.state?.scheduleId
  );
  const [payment, setPayment] = useState(
    props?.props?.location?.state?.coursePayment
      ? props?.props?.location?.state?.coursePayment
      : props?.props?.location?.state?.lessonPayment
  );
  const [lessonIds, setLessonIds] = useState(props?.props?.location?.state?.lessonIds);
  const [courseTime, setCourseTime] = useState("");
  const [parentId, setParentId] = useState("");
  const [cvc, setCvc] = useState("");
  const [expiry, setExpiry] = useState("");
  const [focus, setFocus] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [student, setStudent] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [show, setShow] = useState(false);
  const [view, setView] = useState(false);
  const [errorText, setErrorText] = useState(" ");
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [role, setRole] = useState("");
  const [userStudentId, setUserStudentId] = useState("");
  const [studentShow, setStudentShow] = useState(true);
  const [parentAddress, setParentAddress] = useState([]);
  const [studentAddress, setStudentAddress] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [stateCode, setStateCode] = useState(0);
  const [errorStatus, setErrorStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cityValue, setCityValue] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [checked, setChecked] = useState(false);
  const history = useHistory();

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(props.props.history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Get Parent Address
  const getParentAddress = () => {
    const userId = localStorage.getItem("userId");
    const parentId = localStorage.getItem("parentId");
    Api.get(`api/v1/parent/${parentId}`, { headers: { userId: userId } })
      .then((response) => {
        const data = response.data.data.getOne;
        setParentAddress(data);
        setFirstName(data?.firstName);
        setLastName(data?.lastName);
        setAddress1(data?.address1);
        setAddress2(data?.address2);
        setPhone(data?.phone);
        setEmail(data?.email);
        setCity(data.city ? { value: data?.city, label: data?.city } : "");
        setCityValue(data?.city);
        setState(data.state ? { value: data?.state, label: data?.state } : "");
        setStateValue(data?.state);
        setZipCode(data?.zipCode);
        setIsLoading(false);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  // Get Student Address
  const getStudentAddress = () => {
    const studentId = localStorage.getItem("studentId");
    const userId = localStorage.getItem("userId");
    Api.get(`api/v1/student/${studentId}`, { headers: { userId: userId } })
      .then((response) => {
        const data = response.data.data.getOne;
        setStudentAddress(data);
        setFirstName(data?.firstName);
        setLastName(data?.lastName);
        setAddress1(data?.address1);
        setAddress2(data?.address2);
        setPhone(data?.phone);
        setEmail(data?.email);
        setCity(data.city ? { value: data?.city, label: data?.city } : "");
        setCityValue(data?.city);
        setState(data.state ? { value: data?.state, label: data?.state } : "");
        setStateValue(data?.state);
        setZipCode(data?.zipCode);
        setIsLoading(false);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  // Fetch initial data
  useEffect(() => {
    getParentAddress();
    getStudentAddress();
  }, []);

  // Get userId in local storage and user details
  const getStudentList = () => {
    const parentId = localStorage.getItem("parentId");
    const courseTiming = localStorage.getItem("courseTiming");
    setCourseTime(courseTiming);
    setParentId(parentId);

    const userId = localStorage.getItem("userId");
    Api.get("api/v1/parent/student/list", {
      params: {
        parentId: parentId,
        userId: userId,
      },
    })
      .then((res) => {
        const data = res.data.data.studentList;
        setStudentList(data);
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
    const fetchData = async () => {
      let role = localStorage.getItem("role");
      let studentId = localStorage.getItem("studentId");
      const parentId = localStorage.getItem("parentId");
      setRole(role);
      setUserStudentId(studentId);
      setParentId(parentId);
      setIsLoading(false);
      getStudentList();
    };

    fetchData();
  }, []);

  // Submit Form post data to backend
  const submit = async (values, { resetForm }) => {
    setShow(true);
    setIsSubmit(true);

    const isStudent = role === ROLES_STUDENT;
    const isParent = role === ROLES_PARENT;

    //stripe

    const { stripe, elements } = props;
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    const userId = localStorage.getItem("userId");
    if (result.error) {
      setShow(false);
      setIsSubmit(false);
      setView(true);
      setErrorText(result.error.message);
    } else {
      {
        lessonIds
          ? Api.get("api/v1/student/upcomingSchedule/check", {
              params: {
                courseScheduleId: scheduleId,
                studentId: isParent ? studentId : userStudentId,
                lessonId: lessonIds,
                userId: userId,
              },
            })
              .then((res) => {
                const email = values.email.toLowerCase();
                Api.post("/api/v1/billing/lesson/strip/payment", {
                  currency: "inr",
                  price: payment * 100,
                  studentId: isParent ? studentId : userStudentId,
                  courseId: courseId,
                  courseScheduleId: scheduleId,
                  lessonId: lessonIds,
                })
                  .then(async (resposne) => {
                    const data = resposne.data;
                    const confirmPayment = await stripe.confirmCardPayment(data.clientSecret, {
                      payment_method: {
                        card: card,
                        billing_details: {
                          address: {
                            city: cityValue,
                            country: "us",
                            line1: values.address1,
                            line2: values.address2,
                            postal_code: values.zipCode,
                            state: stateValue,
                          },
                          email: email,
                          name: values.firstName,
                          phone: values.phone,
                        },
                      },
                    });

                    if (!confirmPayment.error) {
                      Api.post(
                        `api/v1/billing/checkout/lesson/${
                          (isStudent && parentId === "null") || (isStudent && parentId === null) ? "student" : "parent"
                        }`,
                        {
                          firstName: values.firstName,
                          lastName: values.lastName,
                          address1: values.address1,
                          address2: values.address2,
                          email: values.email,
                          city: cityValue,
                          state: stateValue,
                          zipCode: values.zipCode,
                          phone: values.phone,
                          parentId: parentId,
                          studentId: isParent ? studentId : userStudentId,
                          courseId: courseId,
                          courseScheduleId: scheduleId,
                          payment: payment,
                          lessonId: lessonIds,
                        }
                      ).then((res) => {
                        const status = res.status;
                        if (status === 201) {
                          resetForm({ values: "" });
                          setStudent("");
                          setIsProcessing(false);
                        }
                      });
                      Api.post("api/v1/student/upcomingList", {
                        parentId: parentId,
                        studentId: isParent ? studentId : userStudentId,
                        courseId: courseId,
                        courseScheduleId: scheduleId,
                      });
                    } else {
                      setShow(false);
                      setIsSubmit(false);
                      setView(true);
                      setErrorText("Payment Failed");
                    }
                  })
                  .catch((error) => {
                    if (error.response && error.response.status >= 400) {
                      let errorMessage;
                      const errorRequest = error.response.request;
                      if (errorRequest && errorRequest.response) {
                        errorMessage = JSON.parse(errorRequest.response).message;
                      }
                      setIsSubmit(false);
                      setShow(false);
                      setView(true);
                      setErrorText(error.response.data.message);
                    }
                  });
              })
              .catch((error) => {
                if (error.response && error.response.status >= 400) {
                  let errorMessage;
                  const errorRequest = error.response.request;
                  if (errorRequest && errorRequest.response) {
                    errorMessage = JSON.parse(errorRequest.response).message;
                  }
                  setIsSubmit(false);
                  setShow(false);
                  setView(true);
                  setErrorText(error.response.data.message);
                }
                const errorStatus = error?.response?.status;
                if (errorStatus === 401) {
                  logout();
                  toast.error("Session Timeout");
                }
              })
          : Api.get("api/v1/student/upcomingSchedule/check", {
              params: {
                courseScheduleId: scheduleId,
                studentId: isParent ? studentId : userStudentId,
              },
            })
              .then((res) => {
                const email = values.email.toLowerCase();
                Api.post("/api/v1/billing/strip/payment", {
                  currency: "inr",
                  price: payment * 100,
                  studentId: isParent ? studentId : userStudentId,
                  courseId: courseId,
                  courseScheduleId: scheduleId,
                })
                  .then(async (resposne) => {
                    const data = resposne.data;
                    const confirmPayment = await stripe.confirmCardPayment(data.clientSecret, {
                      payment_method: {
                        card: card,
                        billing_details: {
                          address: {
                            city: cityValue,
                            country: "us",
                            line1: values.address1,
                            line2: values.address2,
                            postal_code: values.zipCode,
                            state: stateValue,
                          },
                          email: email,
                          name: values.firstName,
                          phone: values.phone,
                        },
                      },
                    });

                    if (!confirmPayment.error) {
                      Api.post(
                        `api/v1/billing/paybill/${
                          (isStudent && parentId === "null") || (isStudent && parentId === null) ? "student" : "parent"
                        }`,
                        {
                          firstName: values.firstName,
                          lastName: values.lastName,
                          address1: values.address1,
                          address2: values.address2,
                          email: values.email,
                          city: cityValue,
                          state: stateValue,
                          zipCode: values.zipCode,
                          phone: values.phone,
                          parentId: parentId,
                          studentId: isParent ? studentId : userStudentId,
                          courseId: courseId,
                          courseScheduleId: scheduleId,
                          payment: payment,
                        }
                      ).then((res) => {
                        const status = res.status;
                        if (status === 201) {
                          resetForm({ values: "" });
                          setStudent("");
                          setIsProcessing(false);
                        }
                      });
                      Api.post("api/v1/student/upcomingList", {
                        parentId: parentId,
                        studentId: isParent ? studentId : userStudentId,
                        courseId: courseId,
                        courseScheduleId: scheduleId,
                      });
                    } else {
                      setShow(false);
                      setIsSubmit(false);
                      setView(true);
                      setErrorText("Payment Failed");
                    }
                  })
                  .catch((error) => {
                    if (error.response && error.response.status >= 400) {
                      let errorMessage;
                      const errorRequest = error.response.request;
                      if (errorRequest && errorRequest.response) {
                        errorMessage = JSON.parse(errorRequest.response).message;
                      }
                      setShow(false);
                      setIsSubmit(false);
                      setView(true);
                      setErrorText(error.response.data.message);
                    }
                  });
              })
              .catch((error) => {
                if (error.response && error.response.status >= 400) {
                  let errorMessage;
                  const errorRequest = error.response.request;
                  if (errorRequest && errorRequest.response) {
                    errorMessage = JSON.parse(errorRequest.response).message;
                  }
                  setShow(false);
                  setIsSubmit(false);
                  setView(true);
                  setErrorText(error.response.data.message);
                }
              });
      }
    }
  };

  // Handle Modal
  const handleModal = () => {
    setShow(!show);
  };
  //handle popup
  const handleFailed = () => {
    setShow(!show);
  };

  const Index = (value) => {
    let selectState = value;
    for (let i = 0; i < states.length; i++) {
      if (states[i].state === selectState.value) {
        setStateCode(i);
      }
    }
  };

  //checkbox
  const checkBox = () => {
    const isChecked = !checked;
    if (isChecked) {
      isParent ? getParentAddress() : getStudentAddress();
    } else {
      setFirstName("");
      setLastName("");
      setAddress1("");
      setAddress2("");
      setPhone("");
      setEmail("");
      setCity("");
      setState("");
      setZipCode("");
      setStateCode("");
      setCityValue("");
      setStateValue("");
    }
  };
  const isParent = role === ROLES_PARENT;

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container className="mt-1">
          <div className="d-flex">
            <h4 className="mx-3 mb-0">Billing Information</h4>
            <div className="user-value">
              {/* Course Name */}
              <h6 className=" purchased-course mx-3 mb-0 fw-bold">{scheduleDetail?.courseId?.name}</h6>-
              <h6 className="purchased-course mx-3 mb-0 fw-bold">{scheduleDetail?.courseId?.category?.name}</h6>
              <h6 className=" purchased-course mb-0">{`${scheduleDetail?.startTime} ${scheduleDetail?.endTime}`}</h6>
            </div>
          </div>
          <Row>
            <Formik
              enableReinitialize={true}
              initialValues={{
                firstName: firstName,
                lastName: lastName,
                address1: address1,
                address2: address2,
                email: email,
                state: state,
                city: city,
                zipCode: zipCode,
                phone: phone,
                student: isParent ? student : userStudentId,
              }}
              validationSchema={SignInSchema}
              onSubmit={(values, { resetForm }) => submit(values, { resetForm })}
            >
              {(formik) => {
                const { setFieldValue, handleSubmit, handleBlur, isValid } = formik;
                return (
                  <div>
                    <Form onSubmit={handleSubmit}>
                      <Row className="px-3">
                        {isParent && (
                          <Col sm={6} md={6}>
                            <Form.Group className="form-row mt-3">
                              <Label notify={true}>Select Student</Label>
                              <Select
                                value={student}
                                styles={customStyles}
                                placeholder="Select Student"
                                name="student"
                                onChange={(e) => {
                                  if (e.value === "Enroll Student") {
                                    history.push("/student/signup", {
                                      courseId: courseId,
                                    });
                                  } else {
                                    setState({
                                      student: e,
                                      studentId: e.value,
                                    });
                                  }
                                }}
                                options={[
                                  {
                                    value: "Enroll Student",
                                    label: "Enroll Student",
                                  },
                                  {
                                    options: studentList?.map((list) => ({
                                      value: list?.id,
                                      label: `${list?.firstName} ${list?.lastName}`,
                                      isDisabled: !list?.activeStatus,
                                    })),
                                  },
                                ]}
                              />
                              <ErrorMessage
                                name="student"
                                component="span"
                                className="error text-danger error-message m-0"
                              />
                            </Form.Group>
                          </Col>
                        )}
                        <Col
                          xs={12}
                          sm={6}
                          md={6}
                          className="checkbox-content d-flex justify-content-start align-items-center"
                        >
                          <Form.Group className="form-row mt-4">
                            <Form.Check
                              className="checkbox-style"
                              type="checkbox"
                              label="Billing Information Same As Registration Information"
                              checked={checked}
                              onChange={() => {
                                setChecked(!checked);
                                checkBox();
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="px-3 pt-2">
                        <Col sm={6} md={6}>
                          <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                            <Label notify={true}>First Name</Label>
                            <FormControl
                              type="type"
                              name="firstName"
                              placeholder="First Name as displayed in Credit card"
                              id="firstName"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage
                              name="firstName"
                              component="span"
                              className="error text-danger error-message m-0 "
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6} md={6}>
                          <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                            <Label notify={true}>Last Name</Label>
                            <FormControl
                              type="type"
                              name="lastName"
                              placeholder="Last Name as displayed in Credit card"
                              id="lastName"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage
                              name="lastName"
                              component="span"
                              className="error text-danger error-message m-0"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="px-3 pt-2">
                        <Col sm={6} md={6}>
                          <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                            <Label notify={true}>Address Line 1</Label>
                            <FormControl
                              type="type"
                              name="address1"
                              placeholder="Address Line 1"
                              id="address1"
                              value={address1}
                              onChange={(e) => setAddress1(e.target.value)}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage
                              name="address1"
                              component="span"
                              className="error text-danger error-message m-0"
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6} md={6}>
                          <Form.Group className="form-row" style={{ width: "100%" }}>
                            <Label>Address Line 2</Label>
                            <FormControl
                              type="type"
                              name="address2"
                              placeholder="Address Line 2"
                              id="address2"
                              value={address2}
                              onChange={(e) => setAddress2(e.target.value)}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage
                              name="address2"
                              component="span"
                              className="error text-danger error-message m-0"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="px-3 pt-2">
                        <Col sm={6} md={6}>
                          <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                            <Label notify={true}>Email</Label>
                            <FormControl
                              type="type"
                              name="email"
                              placeholder="Email"
                              id="email"
                              style={{ textTransform: "lowercase" }}
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage
                              name="email"
                              component="span"
                              className="error text-danger error-message m-0"
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6} md={6}>
                          <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                            <Label notify={true}>Phone Number</Label>
                            <br />
                            <InputGroup className="mb-3">
                              <InputGroup.Text id="basic-addon1">+1</InputGroup.Text>
                              <FormControl
                                maxlength="10"
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                            </InputGroup>
                            <ErrorMessage
                              name="phone"
                              component="span"
                              className="error text-danger error-message m-0"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="px-3 pt-2">
                        <Col sm={4} md={4}>
                          <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                            <Label notify={true}>State</Label>

                            <Select
                              value={state}
                              styles={customStyles}
                              name="state"
                              placeholder="State"
                              onChange={(e) => {
                                Index(e);
                                setFieldValue("state", e);
                                setState(e);
                                setStateValue(e.value);
                                setCityValue("");
                                setCity("");
                              }}
                              options={states.map((item) => ({
                                label: item.state,
                                value: item.state,
                              }))}
                            />
                            <ErrorMessage
                              name="state"
                              component="span"
                              className="error text-danger error-message m-0"
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={4} md={4}>
                          <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                            <Label notify={true}>City</Label>
                            <br />
                            <Select
                              placeholder="City"
                              styles={customStyles}
                              value={city}
                              name="city"
                              onChange={(e) => {
                                setFieldValue("city", e);
                                setCityValue(e.value);
                                setCity(e);
                              }}
                              options={states[stateCode]?.cities?.map((item, key) => ({
                                label: item,
                                value: item,
                              }))}
                            />
                            <ErrorMessage
                              name="city"
                              component="span"
                              className="error text-danger error-message m-0"
                            />
                          </Form.Group>
                        </Col>

                        <Col sm={4} md={4}>
                          <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                            <Label notify={true}>Zip Code</Label>
                            <FormControl
                              type="type"
                              name="zipCode"
                              maxLength="5"
                              placeholder="Zip Code"
                              id="zipCode"
                              value={zipCode}
                              onChange={(e) => setZipCode(e.target.value)}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage
                              name="zipCode"
                              component="span"
                              className="error text-danger error-message m-0"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <CardSection />
                      </Row>
                      <div className="d-flex justify-content-end mt-4 px-3 mb-4">
                        <Button
                          disabled={!isValid || isSubmit}
                          className={`${!isValid || isSubmit ? "checkout-disable" : "checkout-active"}`}
                          variant="primary"
                          type="submit"
                        >
                          Pay Now ${payment}
                        </Button>
                      </div>
                    </Form>
                  </div>
                );
              }}
            </Formik>
          </Row>
          <div>
            <Modal show={show} backdrop="static" keyboard={false} centered onHide={() => handleModal()}>
              <Modal.Body>
                <Row>
                  {isProcessing ? (
                    <div className="processing-content">
                      <Spinner animation="grow" variant="secondary" />
                      <h4 style={{ paddingLeft: 20 }}>Processing...</h4>
                    </div>
                  ) : (
                    <div>
                      <div className="success-content">
                        <p className="payment-success-style">Payment Success!</p>
                      </div>
                      <div className="ok-button-container">
                        <Button
                          className="ok-button-style"
                          variant="contained"
                          color="primary"
                          onClick={() => history.push("/dashboard")}
                        >
                          Go To Dashboard
                        </Button>
                      </div>
                    </div>
                  )}
                </Row>
              </Modal.Body>
            </Modal>
          </div>
          <div>
            <Modal show={view} backdrop="static" keyboard={false} centered onHide={() => handleFailed()}>
              <Modal.Body>
                <Row>
                  <div className="payment-details">
                    <FaExclamationCircle size={40} />
                  </div>
                  <h5 className="text-center">{errorText}</h5>
                </Row>
              </Modal.Body>
              <div className="ok-button-container">
                <Button className="ok-button-style" variant="contained" color="primary" onClick={() => setView(false)}>
                  Retry
                </Button>
              </div>
            </Modal>
          </div>
        </Container>
      )}
    </div>
  );
};
export default function InjectedCheckoutForm(props) {
  return (
    <ElementsConsumer>
      {({ stripe, elements }) => <CourseCheckoutScreen stripe={stripe} elements={elements} props={props.props} />}
    </ElementsConsumer>
  );
}
