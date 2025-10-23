import React, { useState, useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  InputGroup,
  Form,
  FormControl,
  Container,
  Col,
  Row,
  Card,
} from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import { convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// Styles
import "../../css/ParentSignup.scss";
// Api
import Api from "../../Api";
// Component
import Label from "../../components/core/Label";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import {
  faEye,
  faEyeSlash,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import { customStyles } from "../core/Selector";

const TeacherSignup = () => {
  const history = useHistory();

  const [details, setDetails] = useState([]);
  const [parentId, setParentId] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [hearAboutUs, setHearAboutUs] = useState("");
  const [type, setType] = useState("text");
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [specialityDescription, setSpecialityDescription] = useState(EditorState.createEmpty());
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [skills, setSkills] = useState("");
  const [captcha, setCaptcha] = useState("");

  // Validations
const SignInSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .matches(/^[A-Z]/, "First Letter Must Be In Capital")
    .required("First Name Is Required"),
  middleName: Yup.string()
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .matches(/^[A-Z]/, "First Letter Must Be In Capital")
    .nullable(),
  lastName: Yup.string()
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .matches(/^[A-Z]/, "First Letter Must Be In Capital")
    .required("Last Name Is Required"),
  phone: Yup.string()
    .matches(/^[0-9\s]+$/, "Enter Valid Phone Number")
    .max(10, "Enter valid number")
    .min(10, "Enter valid number")
    .length(10)
    .required("Phone Number Is Required"),
  email: Yup.string().email("Enter Valid Email").required("Email Is Required"),
  speciality: Yup.string().required("Speciality Is Required"),
  descriptionValue: Yup.string().required("Speciality Description Is Required"),
  // hearAboutUs:Yup.string().required("Required Field"),
  userName: Yup.string().required("User Name Is Required"),
  password: Yup.string()
    .matches(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#*$%^&*])",
      "Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
    )
    .min(8, "Password Required Minimum 8 Characters")
    .required("Password Is Required"),
  confirmPassword: Yup.string()
    .matches(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#*$%^&*])",
      "Confirm Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
    )
    .oneOf([Yup.ref("password"), null], "Password Did Not Match")
    .required("Confirm Password Is Required"),
  captcha: Yup.string()
    .required("Captcha Is Required")
    .min(6, "Captcha required minimum 6 characters ")
    .max(6, "Captcha maximum 6 characters"),
});

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  // Validations
  const SignInSchema = Yup.object().shape({
    firstName: Yup.string()
      .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
      .matches(/^[A-Z]/, "First Letter Must Be In Capital")
      .required("First Name Is Required"),

    middleName: Yup.string()
      .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
      .matches(/^[A-Z]/, "First Letter Must Be In Capital")
      .nullable(),

    lastName: Yup.string()
      .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
      .matches(/^[A-Z]/, "First Letter Must Be In Capital")
      .required("Last Name Is Required"),

    phone: Yup.string()
      .matches(/^[0-9\s]+$/, "Enter Valid Phone Number")
      .max(10, "Enter valid number")
      .min(10, "Enter valid number")
      .length(10)
      .required("Phone Number Is Required"),
    email: Yup.string().email("Enter Valid Email").required("Email Is Required"),
    speciality: Yup.string().required("Speciality Is Required"),
    descriptionValue: Yup.string().required("Speciality Description Is Required"),
    // hearAboutUs:Yup.string().required("Required Field"),
    userName: Yup.string().required("User Name Is Required"),
    password: Yup.string()
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#*$%^&*])",
        "Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
      )
      .min(8, "Password Required Minimum 8 Characters")
      .required("Password Is Required"),

    confirmPassword: Yup.string()
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#*$%^&*])",
        "Confirm Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
      )
      .oneOf([Yup.ref("password"), null], "Password Did Not Match")
      .required("Confirm Password Is Required"),
    captcha: Yup.string()
      .required("Captcha Is Required")
      .min(6, "Captcha required minimum 6 characters ")
      .max(6, "Captcha maximum 6 characters"),
  });

  const onChangeDescription = ({ setFieldValue }, e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    setFieldValue("descriptionValue", editedText.blocks[0].text);
  };

  const getRandomCaptcha = () => {
    let randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    setCaptcha(result);
  };

  const submitForm = (values, { resetForm }) => {
    const user_captcha = values.captcha;
    const email = values.email.toLowerCase();
    const convertedData = JSON.stringify(convertToRaw(specialityDescription.getCurrentContent()));
    const skillsData = JSON.stringify(values.skills);

    if (values.password === values.confirmPassword && captcha === user_captcha) {
      getRandomCaptcha();
      setIsSubmit(true);
      Api.post("api/v1/teacher/signup", {
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.middleName,
        phone: values.phone,
        email: email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        hearAboutUs: hearAboutUs,
        speciality: values.speciality,
        userName: userName,
        specialityDescription: convertedData,
        skills: skillsData,
      })
        .then((response) => {
          const status = response.status;
          if (status === 201) {
            setIsSubmit(false);
            resetForm({ values: "" });
            const role = response.data.teacherLogin.role;
            const userId = response.data.teacherLogin.id;
            const teacherId = response.data.teacherLogin.teacherId;
            const token = response.data.teacherLogin.token;
            localStorage.setItem("role", role);
            localStorage.setItem("userId", userId);
            localStorage.setItem("teacherId", teacherId);
            localStorage.setItem("token", token);
            history.push({
              pathname: "/teacher/application/form",
              state: { sidebar: true },
            });
          } else {
            setIsSubmit(false);
            toast.error("Teacher Already Exists");
          }
        })
        .catch((error) => {
          const errorValue = error.response.status;
          if (errorValue === 400) {
            toast.error("Teacher Already Exists");
          }
        });
    } else {
      setIsSubmit(false);
      toast.error("Captcha Does Not Match");
      values.captcha = "";
      getRandomCaptcha();
    }
  };

  const getUsername = (e) => {
    let username = e.target.value;
    let laststr = username.substr(username.length - 1);

    let format = /^[!@#$%^&*()_+\- =[\]{};':"\\|,.<>/?]*$/;
    if (laststr.match(format)) {
      let name = username.replace(laststr, " ");
      setUserName(name);
    } else {
      setUserName(username);
    }

    Api.get("api/v1/teacher/check/username", {
      params: {
        userName: username,
      },
    }).then((response) => {
      let status = response?.data?.data?.userName;
      if (username.toLowerCase() === status?.toLowerCase()) {
        let errMsg = "Username Is Already Exist";
        setErrorMessage(errMsg);
      } else {
        setErrorMessage("");
      }
    });
  };

  const getCategoryList = () => {
    Api.get("api/v1/category").then((res) => {
      const option = res.data.data.data;
      setCategoryList(option);
    });
  };

  useEffect(() => {
    getCategoryList();
    getRandomCaptcha();
  }, []);

  return (
    <Container className=" my-2 px-3" fluid>
      <Card className="p-md-3 p-lg-4 teacer-sign-background">
        <div className="row  mt-2">
          <div className="col-sm-12" style={{ height: "auto" }}>
            <h4 className="d-flex justify-content-center mb-4" style={{ fontFamily: "none", fontWeight: "bold" }}>
              Teacher Sign Up
            </h4>

            <div className="d-flex justify-content-center align-items-center mb-2 mt-3">
              <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" color="#1d1464" />
            </div>
            <div>
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  middleName: "",
                  phone: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                  hearAboutUs: "",
                  speciality: "",
                  descriptionValue: "",
                  userName: "",
                  skills: "",
                  captcha: "",
                }}
                validationSchema={SignInSchema}
                onSubmit={(values, { resetForm }) => submitForm(values, { resetForm })}
              >
                {(formik) => {
                  const { values, handleChange, handleSubmit, handleBlur, isValid, setFieldValue } = formik;
                  return (
                    <div>
                      <Form onSubmit={handleSubmit}>
                        <div className="row d-flex justify-content-center">
                          <Col xs={12} sm={4}>
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>First Name</Label>
                              <br />
                              <FormControl
                                type="type"
                                name="firstName"
                                id="firstName"
                                placeholder="Enter Your First Name"
                                value={values.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="firstName" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={4}>
                            <Form.Group className="form-row mb-3">
                              <Label>Middle Name</Label>
                              <br />
                              <FormControl
                                type="type"
                                name="middleName"
                                id="middleName"
                                placeholder="Enter Your Middle Name"
                                value={values.middleName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="middleName" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={4}>
                            <Form.Group className="form-row" style={{ width: "100%" }}>
                              <Label notify={true}>Last Name</Label>
                              <br />
                              <FormControl
                                type="type"
                                name="lastName"
                                id="lastName"
                                placeholder="Enter Your Last Name"
                                value={values.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="lastName" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                        </div>
                        <div className="row d-flex justify-content-center">
                          <Col>
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>User Name</Label>
                              <br />
                              <FormControl
                                type="userName"
                                name="userName"
                                id="userName"
                                placeholder="Enter User Name"
                                value={values.userName}
                                onChange={(e) => {
                                  setFieldValue("userName", e.target.value.replace(/\s/g, "-"));
                                  getUsername(e);
                                }}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage name="userName" component="span" className="error text-danger" />

                              <p className="error text-danger"> {errorMessage} </p>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}> Email</Label>
                              <br />
                              <FormControl
                                type="email"
                                name="email"
                                id="email"
                                style={{ textTransform: "lowercase" }}
                                placeholder="Enter Your Email "
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="email" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                        </div>
                        <div className="row d-flex justify-content-center">
                          <Col>
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>Phone Number</Label>
                              <br />
                              <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">+1</InputGroup.Text>
                                <FormControl
                                  name="phone"
                                  id="phone"
                                  maxLength="10"
                                  type="tel"
                                  placeholder="Enter Your Phone Number"
                                  value={values.phone}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                              </InputGroup>
                              <ErrorMessage name="phone" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={6}>
                            <Form.Group className="form-row mb-3">
                              <Label>How Did You Hear About Us?</Label>
                              <br />
                              <Select
                                value={values.hearAboutUs}
                                styles={customStyles}
                                placeholder="How Did You Hear About Us?"
                                name="hearAboutUs"
                                onChange={(e) => {
                                  setFieldValue("hearAboutUs", e);
                                  setHearAboutUs(e.value);
                                }}
                                options={[
                                  {
                                    value: "Referred By A Friend",
                                    label: "Referred By A Friend",
                                  },
                                  {
                                    value: "Web Search",
                                    label: "Web Search",
                                  },
                                  {
                                    value: "Social Media",
                                    label: "Social Media",
                                  },
                                ]}
                              />
                              <ErrorMessage name="hearAboutUs" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                        </div>
                        <div></div>
                        <div className="row d-flex justify-content-center">
                          <Col xs={12} sm={6}>
                            <Form.Group className="form-row mb-3">
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
                              <ErrorMessage name="password" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={6}>
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>Confirm Password</Label>
                              <InputGroup>
                                <FormControl
                                  type={confirmPasswordShown ? "text" : "password"}
                                  name="confirmPassword"
                                  id="confirmPassword"
                                  value={values.confirmPassword}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                  placeholder="Confirm Password"
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
                                    icon={confirmPasswordShown ? faEye : faEyeSlash}
                                    style={{ cursor: "pointer" }}
                                    onClick={toggleConfirmPasswordVisibility}
                                    size="1x"
                                  />
                                </InputGroup.Text>
                              </InputGroup>
                              <ErrorMessage name="confirmPassword" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                        </div>
                        <div className="row d-flex justify-content-left">
                          <Col>
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>Speciality</Label>
                              <br />
                              <FormControl
                                type="speciality"
                                name="speciality"
                                id="speciality"
                                placeholder="Enter Your Speciality"
                                value={values.speciality}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="speciality" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="form-row mb-3">
                              <Label>Skills</Label>
                              <br />
                              <Select
                                value={values.skills}
                                styles={customStyles}
                                placeholder="Add Your Skills"
                                name="skills"
                                onChange={(e) => {
                                  setFieldValue("skills", e);
                                }}
                                options={[
                                  {
                                    options: categoryList.map((list) => ({
                                      value: list.id,
                                      label: list.name,
                                    })),
                                  },
                                ]}
                                isMulti
                              />
                              <ErrorMessage name="skills" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                        </div>
                        <div className="d-flex justify-content-center mb-4">
                          <Form.Group className="form-row" style={{ width: "100%" }}>
                            <Label notify={true}>Speciality Description</Label>
                            <br />
                            <div className="teacher-description">
                              <Editor
                                spellCheck
                                name="descriptionValue"
                                editorState={specialityDescription}
                                onEditorStateChange={(e) => {
                                  setSpecialityDescription(e);
                                  onChangeDescription({ setFieldValue }, e);
                                }}
                                toolbar={{
                                  options: ["inline", "list", "textAlign"],
                                }}
                              />
                            </div>
                            <ErrorMessage name="descriptionValue" component="span" className="error text-danger" />
                          </Form.Group>
                        </div>
                        <div className="mb-5">
                          <Form.Group>
                            {" "}
                            <Label notify={true}>Captcha</Label>
                          </Form.Group>
                          <Row>
                            <Col>
                              <Form.Group>
                                <Form.Control
                                  placeholder="Captcha"
                                  name="captcha"
                                  type="text"
                                  id="captcha"
                                  value={values.captcha}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  onPaste={(e) => {
                                    e.preventDefault();
                                    return false;
                                  }}
                                />
                                <ErrorMessage name="captcha" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                            <Col className="d-flex flex-direction-row align-items-center">
                              <s
                                className="border border-primary captcha-form-alignment  px-4 mx-4 "
                                style={{
                                  backgroundColor: "azure",
                                  color: "black",
                                }}
                                onCopy={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                              >
                                {captcha}
                              </s>
                              <FontAwesomeIcon
                                icon={faRedoAlt}
                                size="1x"
                                color="blue"
                                className="captcha-icon"
                                onClick={getRandomCaptcha}
                              />
                            </Col>
                          </Row>
                        </div>
                        <div className="d-flex justify-content-center mt-3 mb-3">
                          <Button
                            variant="contained"
                            type="submit"
                            className="blue-button-1 button-width"
                            disabled={isSubmit || !isValid}
                          >
                            {isSubmit ? "Loading..." : "Sign Up"}
                          </Button>
                        </div>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default TeacherSignup;
