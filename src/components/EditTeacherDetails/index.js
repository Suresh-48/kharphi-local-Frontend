import React, { Component, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, FormControl, Dropdown, InputGroup, ToggleButton, Modal } from "react-bootstrap";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, convertFromRaw } from "draft-js";
import { toast } from "react-toastify";
import { TEACHER_ACCOUNT_TYPE, TEACHER_ACCOUNT_COUNTRY, TEACHER_ACCOUNT_CURRENCY } from "../../constants/roles.js";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faBuildingColumns, faUserPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

// Styles
import "../../css/EditTeacherDetails.scss";

// Component
import Label from "../../components/core/Label";
import states from "../../components/core/States";
import Loader from "../../components/core/Loader";
import profile from "../core/NoProfile.png";

// Api
import Api from "../../Api";
import { customStyles } from "../core/Selector";

//Tabs
import { Tab, Tabs } from "@material-ui/core";
// Validation
const EmailSignInSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[A-Z]/, "First Letter Must Be Capital")
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .required("First Name Is Required"),

  lastName: Yup.string()
    .matches(/^[A-Z]/, "First Letter Must Be Capital")
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .required("Last Name Is Required"),

  password: Yup.string()
    .matches(
      "^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#$%^&])",
      "Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
    )
    .min(8, "Password Required Minimum 8 Characters")
    .required("Password Is Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .matches(
      "^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#$%^&])",
      "Confirm Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
    )
    .required("Confirm Password Is Required"),

  zipCode: Yup.string()
    .matches(
      /^((\+[1-9]{1,4}[ \-])|(\([0-9]{2,3}\)[ \-])|([0-9]{2,4})[ \-])?[0-9]{0,4}?[ \-]*[0-9]{0,4}?$/,
      "Enter Valid Zip Code"
    )
    .matches(/^[0-9]{5}$/, "Zip Code Must Be 5 Digits")
    .nullable(),

  phone: Yup.string()
    .matches(/^[0-9\s]+$/, "Enter Valid Phone Number")
    .max(10, "Enter Valid number")
    .min(10, "Enter Valid number")
    .required("Phone Number Is Required"),

  email: Yup.string().email("Enter Valid Email").required("Email Is Required"),

  alternativeEmail: Yup.string().email("Enter Valid Email").nullable(),

  speciality: Yup.string().required("Speciality Is Required"),

  descriptionValue: Yup.string().required("Speciality Description Is Required"),

  aboutUsValue: Yup.string().required("About Us Is Required"),
});

const GoogleAndFacebookSignInSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[A-Z]/, "First Letter Must Be Capital")
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .required("First Name Is Required"),

  lastName: Yup.string()
    .matches(/^[A-Z]/, "First Letter Must Be Capital")
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .required("Last Name Is Required"),

  zipCode: Yup.string()
    .matches(
      /^((\+[1-9]{1,4}[ \-])|(\([0-9]{2,3}\)[ \-])|([0-9]{2,4})[ \-])?[0-9]{0,4}?[ \-]*[0-9]{0,4}?$/,
      "Enter Valid Zip Code"
    )
    .matches(/^[0-9]{5}$/, "Zip Code Must Be 5 Digits")
    .nullable(),

  phone: Yup.string()
    .matches(/^[0-9\s]+$/, "Enter Valid Phone Number")
    .required("Phone Number Is Required"),

  email: Yup.string().email("Enter Valid Email").required("Email Is Required"),

  alternativeEmail: Yup.string().email("Enter Valid Email").nullable(),

  speciality: Yup.string().required("Speciality Is Required"),

  descriptionValue: Yup.string().required("Speciality Description Is Required"),

  aboutUsValue: Yup.string().required("About Us Is Required"),
});

const BankDetails = Yup.object().shape({
  accountName: Yup.string().required("Account Name is Required"),
  routingNumber: Yup.string().required(" Account Routing Number is Required"),
  bankName: Yup.string().required("Bank Name is Required"),
  accountNumber: Yup.number().typeError("Please Enter Numbers Only").required("Account Number is Required"),
  confirmAccountNumber: Yup.number()
    .typeError("Please Enter Numbers Only")
    .oneOf([Yup.ref("accountNumber"), null], "Accounts Number is must atch")
    .required("Confirm Account Number is Required"),
  // customerId: Yup.string().required("customer Id is Required"),
});

const EditTeacherDetails = (props) => {
  const [hearAboutUs, setHearAboutUs] = useState("");
  const [teacherId, setTeacherId] = useState(props?.match?.params?.id);
  const [teacherDetails, setTeacherDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [stateCode, setStateCode] = useState(0);
  const [city, setCity] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [alternativeEmail, setAlternativeEmail] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [hearAboutUsValue, setHearAboutUsValue] = useState("");
  const [specialityDescription, setSpecialityDescription] = useState(EditorState.createEmpty());
  const [aboutUs, setAboutUs] = useState(EditorState.createEmpty());
  const [descriptionValue, setDescriptionValue] = useState("");
  const [aboutUsValue, setAboutUsValue] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [isEnable, setIsEnable] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [skills, setSkills] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [value, setValue] = useState(0);
  const [teacherBankDetails, setTeacherBankDetails] = useState("");
  const [teacherUpdateId, setTeacherUpdateId] = useState("");
  const inputReference = useRef(null);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState();

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(props.history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  const fileUploadAction = () => inputReference.current.click();

  const fileUploadInputChange = async (e) => {
    const file = e.target.files[0];
    const type = file?.type?.split("/")[0];
    const base64 = await convertBase64(file);
    setImagePreview(base64);
    const userId = localStorage.getItem("userId");
    if (type === "image") {
      Api.patch("api/v1/teacher/image/upload", {
        teacherId: teacherId,
        image: imagePreview,
        userId: userId,
      })
        .then((response) => {
          toast.success("Profile Updated Successfully");
        })
        .catch((error) => {
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

  // Delete Image
  const removeImage = () => {
    const userId = localStorage.getItem("userId");
    Api.delete("api/v1/teacher/remove/image", {
      params: {
        teacherId: teacherId,
        userId: userId,
      },
    })
      .then((response) => {
        getTeacherDetail();
        window.location.reload();
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
    setImagePreview("");
  };
  // Convert Image to Base64
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

  useEffect(() => {
    getTeacherDetail();
    getCategory();
    getTeacherBankDetails();
  }, []);

  // Get category list option
  const getCategory = () => {
    const userId = localStorage.getItem("userId");
    Api.get("api/v1/category").then((res) => {
      setCategoryList(res.data.data.data);
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };
  const role = localStorage.getItem("role");

  const changeToHtml = (data) => {
    const contentState = convertFromRaw(JSON.parse(data));
    const editorState = EditorState.createWithContent(contentState);
    const editedText = convertToRaw(editorState.getCurrentContent());
    return { editedText, editorState };
  };

  // Get Teacher Details
  const getTeacherDetail = () => {
    const userId = localStorage.getItem("userId");
    Api.get(`api/v1/teacher/${teacherId}`).then((response) => {
      const data = response.data.data.getOne;
      const selectSkill = data.skills ? JSON.parse(data.skills) : "";
      const specialityDescriptionData = data?.specialityDescription ? changeToHtml(data?.specialityDescription) : "";
      setTeacherDetails(data);
      setUserName(data?.userName ? data?.userName : "");
      setFirstName(data?.firstName);
      setLastName(data?.lastName);
      setMiddleName(data?.middleName);
      setPhone(data?.phone);
      setEmail(data?.email);
      setAddress1(data?.address1);
      setAddress2(data?.address2);
      setPassword(data?.password);
      setConfirmPassword(data?.password);
      setState(data?.state ? { value: data.state, label: data.state } : "");
      setStateValue(data.state);
      setCity(data?.city ? { value: data.city, label: data.city } : "");
      setCityValue(data.city);
      setZipCode(data?.zipCode);
      setAlternativeEmail(data?.alternateEmail);
      setSpeciality(data?.speciality);
      setHearAboutUsValue(data?.hearAboutUs);
      setHearAboutUs(data?.hearAboutUs ? { value: data.hearAboutUs, label: data.hearAboutUs } : "");
      setImagePreview(data?.imageUrl);
      setSpecialityDescription(data?.specialityDescription ? specialityDescriptionData.editorState : "");
      setDescriptionValue(data?.specialityDescription ? specialityDescriptionData.editedText.blocks[0].text : "");
      setSkills(selectSkill);
      setIsLoading(false);
      const aboutUsData = data?.aboutUs ? changeToHtml(data?.aboutUs) : "";
      setAboutUs(data?.aboutUs ? aboutUsData.editorState : "");
      setAboutUsValue(data?.aboutUs ? aboutUsData.editedText.blocks[0].text : "");
      setIsEnable(data?.isPublic);
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

  const onChangeDescription = ({ setFieldValue }, e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    setDescriptionValue(editedText.blocks[0].text);
    setFieldValue("descriptionValue", editedText.blocks[0].text);
  };

  const onChangeAboutUs = ({ setFieldValue }, e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    setAboutUsValue(editedText.blocks[0].text);
    setFieldValue("aboutUsValue", editedText.blocks[0].text);
  };

  // Submit Form
  const submitForm = (values, { resetForm }) => {
    const email = values.email.toLowerCase();
    const alternativeEmail = values?.alternativeEmail?.toLowerCase();
    setIsSubmit(true);
    const convertedData = JSON.stringify(convertToRaw(specialityDescription.getCurrentContent()));
    const aboutUsConvertedData = JSON.stringify(convertToRaw(aboutUs.getCurrentContent()));
    const skillsData = JSON.stringify(values.skills);
    const state = values?.state?.value ? values?.state?.value : "";
    const city = values?.city?.value ? values?.city?.value : "";
    const hearAboutUs = values?.hearAboutUs?.value ? values?.hearAboutUs?.value : "";
    const userId = localStorage.getItem("userId");
    Api.patch(`api/v1/teacher/${teacherId}`, {
      firstName: values.firstName,
      lastName: values.lastName,
      middleName: values.middleName,
      address1: values.address1,
      address2: values.address2,
      password: values.password,
      confirmPassword: values.confirmPassword,
      city: city,
      state: state,
      zipCode: values.zipCode,
      phone: values.phone,
      email: email,
      alternateEmail: alternativeEmail,
      hearAboutUs: hearAboutUs,
      speciality: values.speciality,
      specialityDescription: convertedData,
      aboutUs: aboutUsConvertedData,
      isPublic: isEnable,
      skills: skillsData,
      loginType: teacherDetails.loginType,
      userId: userId,
    })
      .then((response) => {
        const status = response.status;
        if (status === 201) {
          setIsSubmit(false);
          toast.success("Updated");
          getTeacherDetail();
          props.history.push({ state: { sidebar: true } });
        } else {
          setIsSubmit(false);
          toast.error("Email Already Exist");
        }
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
        if (error.response.data.error.statusCode === 500) {
          toast.error("Details already exits");
        } else {
          toast.error(error.response.data.message);
        }
      });
  };

  const options = [
    {
      options: categoryList.map((list) => ({
        value: list.id,
        label: list.name,
      })),
    },
  ];

  const submitBankDetails = (values) => {
    const userId = localStorage.getItem("userId");
    const teacherId = localStorage.getItem("teacherId");
    Api.post("/api/v1/teacher/create/customer", {
      accountType: TEACHER_ACCOUNT_TYPE,
      country: TEACHER_ACCOUNT_COUNTRY,
      currency: TEACHER_ACCOUNT_CURRENCY,
      accountHolderName: values.accountName,
      routingNumber: values.routingNumber,
      bankName: values.bankName,
      accountNumber: values.accountNumber,
      confirmAccountNumber: values.confirmAccountNumber,
      userId: userId,
      teacherId: teacherId,
    })
      .then((res) => {
        getTeacherBankDetails();
        toast.success(res.data.message);
      })
      .catch((error) => {
        if (error.response.status >= 400) {
          toast.error(error.response.data.message);
          setIsSubmit(false);
        }
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const getTeacherBankDetails = () => {
    const userId = localStorage.getItem("userId");
    Api.get("/api/v1/teacher/bank/details", {
      params: {
        teacherId: teacherId,
        userId: userId,
      },
    })
      .then((res) => {
        const data = res.data.data;
        setTeacherBankDetails(data);
        setTeacherUpdateId(data?.id);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const updateTeacherBankDetails = (values) => {
    const userId = localStorage.getItem("userId");
    Api.patch("/api/v1/teacher/bank/details", {
      accountName: values.accountName,
      routingNumber: values.routingNumber,
      bankName: values.bankName,
      accountNumber: values.accountNumber,
      confirmAccountNumber: values.confirmAccountNumber,
      id: teacherUpdateId,
      customerId: values.customerId,
      userId: userId,
    })
      .then((res) => {
        getTeacherBankDetails();
        const msg = res.data.message;
        toast.success(msg);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-2">
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            aria-label="primary tabs example"
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <Tab
              label={
                <Row>
                  <Col>
                    <p className="tab-titles mt-2">
                      <FontAwesomeIcon icon={faUserPlus} size="lg" color="#1d1464" className="me-3" /> Profile{" "}
                    </p>
                  </Col>
                </Row>
              }
              style={{ minWidth: "50%" }}
              value={0}
            />
            <Tab
              label={
                <Row>
                  <Col>
                    <p className="tab-titles mt-2">
                      <FontAwesomeIcon icon={faBuildingColumns} size="lg" color="#1d1464" className="me-3" />
                      Bank Details
                    </p>
                  </Col>
                </Row>
              }
              style={{ minWidth: "50%" }}
              value={1}
            />
          </Tabs>
          <div>
            {value === 0 && (
              <Formik
                initialValues={{
                  firstName: firstName,
                  lastName: lastName,
                  middleName: middleName,
                  address1: address1,
                  address2: address2,
                  password: password,
                  confirmPassword: confirmPassword,
                  zipCode: zipCode,
                  phone: phone,
                  email: email,
                  alternativeEmail: alternativeEmail,
                  speciality: speciality,
                  hearAboutUs: hearAboutUs,
                  descriptionValue: descriptionValue,
                  aboutUsValue: aboutUsValue,
                  skills: skills,
                }}
                enableReinitialize
                validationSchema={EmailSignInSchema}
                onSubmit={submitForm}
              >
                {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, errors, touched }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col sm={4} xs={12} className="px-4 pt-4">
                        <Dropdown className="dropdown-profile-list">
                          <Dropdown.Toggle className="teacher-menu-dropdown p-0" varient="link">
                            <div>
                              <div>
                                {imagePreview ? (
                                  // <Avatar
                                  //   src={this.state.imagePreview}
                                  //   size="150"
                                  //   round={true}
                                  //   color="silver"
                                  //   className="image-size"
                                  // />
                                  <img
                                    src={imagePreview}
                                    width="220"
                                    height="220"
                                    style={{ borderRadius: "50%" }}
                                    alt=""
                                  />
                                ) : (
                                  <Avatar src={profile} size="150" round={true} color="silver" />
                                )}
                              </div>
                              <div className="d-flex justify-content-center mt-3">
                                <p style={{ fontSize: 11, color: "black" }}>Click Here To Upload Profile</p>
                                <FontAwesomeIcon icon={faPen} size="sm" color="#1d1464" className="mx-1" />
                              </div>
                            </div>
                          </Dropdown.Toggle>
                          <Dropdown.Menu center className="profile-dropdown-status py-0">
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
                        <Form.Group className="form-row mb-2">
                          <Label className="label-title" notify={true}>
                            First Name
                          </Label>
                          <FormControl
                            type="type"
                            name="firstName"
                            id="firstName"
                            placeholder="First Name"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width"
                          />
                          <ErrorMessage name="firstName" component="span" className="error text-danger" />
                        </Form.Group>
                        <Form.Group className="form-row mb-2">
                          <Label className="label-title">Middle Name</Label>
                          <FormControl
                            type="type"
                            id="middleName"
                            placeholder="Middle Name"
                            value={values.middleName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width"
                          />
                        </Form.Group>
                        <Form.Group className="form-row mb-2">
                          <Label className="label-title" notify={true}>
                            Last Name
                          </Label>
                          <FormControl
                            type="type"
                            name="lastName"
                            id="lastName"
                            placeholder="Last Name"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width"
                          />
                          <ErrorMessage name="lastName" component="span" className="error text-danger" />
                        </Form.Group>
                        <Form.Group className="form-row mb-2">
                          <Label className="label-title" notify={true}>
                            Email
                          </Label>
                          <FormControl
                            type="email"
                            name="email"
                            id="email"
                            disabled={teacherDetails.loginType !== "Email"}
                            placeholder="Primary Email"
                            style={{ textTransform: "lowercase" }}
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width"
                          />
                          <ErrorMessage name="email" component="span" className="error text-danger" />
                        </Form.Group>
                        <Form.Group className="form-row mb-2">
                          <Label className="label-title">Alternative Email</Label>
                          <FormControl
                            type="email"
                            name="alternativeEmail"
                            id="alternativeEmail"
                            placeholder="Alternative Email"
                            style={{ textTransform: "lowercase" }}
                            value={values.alternativeEmail}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width"
                          />
                          <ErrorMessage name="alternativeEmail" component="span" className="error text-danger" />
                        </Form.Group>
                        <Form.Group className="form-row mb-2">
                          <Label className="label-title" notify={true}>
                            Phone Number
                          </Label>
                          <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">+1</InputGroup.Text>
                            <FormControl
                              type="tel"
                              name="phone"
                              id="phone"
                              maxlength="10"
                              placeholder="Phone Number"
                              value={values.phone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                          </InputGroup>
                          <ErrorMessage name="phone" component="span" className="error text-danger" />
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={8} className="px-4">
                        <div className="row d-flex justify-content-center">
                          <Col sm={6} xs={12}>
                            <Form.Group className="form-row mb-3 pt-4">
                              <Label className="label-title">Address Line 1</Label>
                              <FormControl
                                type="type"
                                id="address1"
                                placeholder="Address 1"
                                value={values.address1}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="address1" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                          <Col sm={6} xs={12}>
                            <Form.Group className="form-row mb-3 pt-4">
                              <Label className="label-title">Address Line 2</Label>
                              <FormControl
                                type="text"
                                id="address2"
                                placeholder="Address 2"
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
                              <Label className="label-title">State</Label>
                              <Select
                                value={values.state}
                                styles={customStyles}
                                name="state"
                                placeholder="State"
                                onChange={(e) => {
                                  Index(e);
                                  setFieldValue("state", e);
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
                              <ErrorMessage name="state" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                          <Col sm={4} xs={12}>
                            <Form.Group className="form-row mb-3">
                              <Label className="label-title">City</Label>
                              <Select
                                name="city"
                                styles={customStyles}
                                placeholder="City"
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
                              <ErrorMessage name="city" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                          <Col sm={4} xs={12}>
                            <Form.Group className="form-row mb-3">
                              <Label className="label-title">Zip Code</Label>
                              <FormControl
                                type="text"
                                name="zipCode"
                                id="zipCode"
                                maxLength="5"
                                placeholder="ZipCode"
                                value={values.zipCode}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="zipCode" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                        </div>
                        <div className=" row d-flex justify-content-center">
                          <Col xs={12} sm={6}>
                            <Form.Group className="form-row mb-3">
                              <Label className="label-title" notify={true}>
                                Speciality
                              </Label>
                              <FormControl
                                type="speciality"
                                name="speciality"
                                id="speciality"
                                placeholder="Speciality"
                                value={values.speciality}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="speciality" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={6}>
                            <Form.Group className="form-row mb-3">
                              <Label className="label-title" notify={true}>
                                How did you hear about us?
                              </Label>
                              <Select
                                value={values.hearAboutUs}
                                styles={customStyles}
                                placeholder="How did you hear about us?"
                                name="hearAboutUs"
                                onChange={(e) => {
                                  setFieldValue("hearAboutUs", e);
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
                        <div className="row d-flex justify-content-left">
                          <Col xs={12}>
                            <Form.Group className="form-row mb-3">
                              <Label>Skills</Label>
                              <br />

                              <div>
                                <Select
                                  value={values.skills}
                                  options={options}
                                  styles={customStyles}
                                  name="skills"
                                  onChange={(e) => {
                                    setFieldValue("skills", e);
                                  }}
                                  isMulti
                                ></Select>
                              </div>
                              {/* <ErrorMessage name="hearAboutUs" component="span" className="error text-danger" /> */}
                            </Form.Group>
                          </Col>
                        </div>
                        <Form.Group className="form-row mb-3">
                          <Label className="label-title" notify={true}>
                            Speciality Description
                          </Label>
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
                        <Form.Group className="form-row mb-3">
                          <Label className="label-title" notify={true}>
                            About Me
                          </Label>
                          <div className="teacher-description">
                            <Editor
                              spellCheck
                              name="aboutUsValue"
                              editorState={aboutUs}
                              onEditorStateChange={(e) => {
                                setAboutUs(e);
                                onChangeAboutUs({ setFieldValue }, e);
                              }}
                              toolbar={{
                                options: ["inline", "list", "textAlign"],
                              }}
                            />
                          </div>
                          <ErrorMessage name="aboutUsValue" component="span" className="error text-danger" />
                        </Form.Group>

                        <div className="mt-0">
                          <Link
                            className="link-decoration ps-1"
                            style={{
                              fontSize: 17,
                              fontFamily: "none",
                              color: "#375474",
                            }}
                            to={{
                              pathname: `/set/password`,
                            }}
                          >
                            Reset Password
                          </Link>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                          <Button
                            className={`${isSubmit ? "teacher-save-changes-disable" : "teacher-save-changes-active"}`}
                            variant="contained"
                            color="primary"
                            disabled={isSubmit === true}
                            type="submit"
                          >
                            SAVE CHANGES
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            )}
            {value === 1 && (
              <Formik
                enableReinitialize={true}
                initialValues={{
                  accountName: teacherBankDetails?.accountName,
                  routingNumber: teacherBankDetails?.routingNumber,
                  bankName: teacherBankDetails?.bankName,
                  accountNumber: teacherBankDetails?.accountNumber,
                  confirmAccountNumber: teacherBankDetails?.confirmAccountNumber,
                  // customerId: teacherBankDetails?.customerId,
                  customerId: teacherBankDetails?.customerId,
                }}
                validationSchema={BankDetails}
                onSubmit={(values) => (teacherUpdateId ? updateTeacherBankDetails(values) : submitBankDetails(values))}
              >
                {(formik) => {
                  const { handleSubmit, handleBlur, values, handleChange, handleReset } = formik;
                  return (
                    <Row>
                      <Col></Col>
                      <Col sm={12} md={9} lg={9}>
                        <Form
                          className="mx-3  mt-sm-3 mt-md-5 border p-4 mb-3 bank-details-bg "
                          onSubmit={handleSubmit}
                          onReset={handleReset}
                        >
                          <fieldset disabled={role === "admin" ? false : false}>
                            <h4>Bank Account Information</h4>
                            <Form.Group className="form-row mb-3 mt-3">
                              <Label notify={true}>Account Holder Name </Label>
                              <Form.Control
                                placeholder="Account Holder Number"
                                name="accountName"
                                id="accountName"
                                value={values.accountName}
                                type="string"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="accountName" component="span" className="error text-danger" />
                            </Form.Group>
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>Account Routing Number </Label>
                              <Form.Control
                                placeholder="Account Routing Number"
                                name="routingNumber"
                                id="routingNumber"
                                type="string"
                                value={values.routingNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="routingNumber" component="span" className="error text-danger" />
                            </Form.Group>
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>Bank Name </Label>
                              <Form.Control
                                placeholder="Bank Name"
                                name="bankName"
                                id="bankName"
                                type="string"
                                value={values.bankName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="bankName" component="span" className="error text-danger" />
                            </Form.Group>
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>Account Number </Label>
                              <Form.Control
                                name="accountNumber"
                                id="accountNumber"
                                placeholder="Account Number"
                                type="string"
                                value={values.accountNumber}
                                onChange={handleChange}
                                Confirm
                                Account
                                Number
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="accountNumber" component="span" className="error text-danger" />
                            </Form.Group>
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>Confirm Account Number </Label>
                              <Form.Control
                                name="confirmAccountNumber"
                                id="confirmAccountNumber"
                                placeholder="Confirm Account Number"
                                type="string"
                                value={values.confirmAccountNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage
                                name="confirmAccountNumber"
                                component="span"
                                className="error text-danger"
                              />
                            </Form.Group>
                            {/* <Form.Group className="form-row mb-3">
                              <Label>Customer Id </Label>
                              <Form.Control
                                name="customerId"
                                id="customerId"
                                placeholder="Customer Id"
                                type="string"
                                value={values.customerId}
                                className="form-width"
                                disabled
                              />
                            </Form.Group> */}

                            <Row className="mt-4 mb-3">
                              <Col className="d-flex justify-content-end">
                                <Button className="me-2 confirm-payment-cancel-btn px-3" type="reset">
                                  Cancel
                                </Button>
                                <Button type="submit" className="bank-save-btn px-4">
                                  Save
                                </Button>
                              </Col>
                            </Row>
                          </fieldset>
                        </Form>
                      </Col>
                      <Col></Col>
                    </Row>
                  );
                }}
              </Formik>
            )}
          </div>
        </div>
      )}
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <Button variant="contained" component="label" className="secondary-button">
              Choose File
              <input type="file" hidden onChange={fileUploadInputChange} />
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditTeacherDetails;
