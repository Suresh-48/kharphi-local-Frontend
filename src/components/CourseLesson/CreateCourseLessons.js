import React, { useState, useEffect } from "react";
import { Container, Row, Col, FormControl, Form, InputGroup } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import Button from "@material-ui/core/Button";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw } from "draft-js";
import * as Yup from "yup";
// Styles
import "../../css/CreateCourseLesson.scss";

// Api
import Api from "../../Api";

// Component
import { toast } from "react-toastify";
import Label from "../../components/core/Label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";

const CreateCourseLessons = (props) => {
  const [duration, setDuration] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [courseName, setCourseName] = useState(props?.location?.state?.courseName);
  const [courseId, setCourseId] = useState(props?.location?.state?.courseId);
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [zoomLink, setZoomLink] = useState("");
  const [zoomPassword, setZoomPassword] = useState("");
  const [courseActualAmount, setCourseActualAmount] = useState("");
  const [courseDiscountAmount, setCourseDiscountAmount] = useState("");
  const [overAllLessonTotal, setOverAllLessonTotal] = useState("");

  useEffect(() => {
    getCourseData();
  }, []);

  // Validations
const createLessonSchema = Yup.object().shape({
  lessonNumber: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{0,4}?[ \\-]*[0-9]{0,4}?$/,
      "This Field Accept Numbers Only"
    )
    .required("Lesson Number Is Required"),
  lessonName: Yup.string().required("Lesson Name Is Required"),
  descriptionValue: Yup.string().required("Description Is Required"),
  lessonActualAmount: Yup.string().required("Lesson Amount Is Required"),
  lessonDiscountAmount: Yup.string().required("Lesson Discount Amount Is Required"),
});

  // Description on change
  const onChangeDescription = ({ setFieldValue }, e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    setFieldValue("descriptionValue", editedText.blocks[0].text);
  };

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(props.history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Get Course Details
  const getCourseData = () => {
    const userId = localStorage.getItem("userId");
    Api.get(`api/v1/course/${courseId}`, { headers: { userId: userId } })
      .then((res) => {
        const data = res.data.data;
        setCourseActualAmount(data?.actualAmount);
        setCourseDiscountAmount(data?.discountAmount);
        getLessonData(data?.discountAmount);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const getLessonData = (discountAmount) => {
    const userId = localStorage.getItem("userId");

    const disAmount = courseDiscountAmount? courseDiscountAmount :discountAmount;
    Api.get("api/v1/courseLesson/details", {
      params: {
        courseId: courseId,
        userId: userId,
      },
    })
      .then((res) => {
        const total = res.data.lessonTotal;
        setOverAllLessonTotal(total);
        if (total > disAmount) {
          toast.error("Over All Lesson Amount exceed than course Amount");
          setIsSubmit(true);
        }
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  //Get Zoom Link
  const getZoomLink = () => {
    const data = {
      email: "kharphi2022@gmail.com",
    };
    const userId = localStorage.getItem("userId");

    Api.post(`/api/v1/courseSchedule/zoom/meeting`, data, {
      headers: { userId: userId },
    })
      .then((response) => {
        const url = response.data.data.zoomURL;
        const pass = response.data.data.zoomPassword;
        setZoomLink(url);
        setZoomPassword(pass);

        const msg = response.data.message;

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

  // Submit form
  const submitForm = (values) => {
    const convertedData = JSON.stringify(convertToRaw(description.getCurrentContent()));
    const userId = localStorage.getItem("userId");

    const actualAmount = parseInt(values.lessonActualAmount);
    const discountAmount = parseInt(values.lessonDiscountAmount);
    if (discountAmount > actualAmount) {
      toast.error("Lesson Discount Amount Should Be Lesser Than Actual Amount ");
    } else {
      Api.post("api/v1/courseLesson/", {
        courseId: courseId,
        lessonNumber: values.lessonNumber,
        lessonName: values.lessonName,
        lessonActualAmount: actualAmount,
        lessonDiscountAmount: discountAmount,
        zoomId: zoomLink,
        zoomPassword: zoomPassword,
        description: convertedData,
        duration: duration,
        userId: userId,
      })
        .then((response) => {
          const status = response.status;
          if (status === 201) {
            setIsSubmit(false);
            props.history.goBack();
          } else {
            toast.error(response.data.message);
            setIsSubmit(false);
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
            setIsSubmit(false);
          }
          const errorStatus = error?.response?.status;
          if (errorStatus === 401) {
            logout();
            toast.error("Session Timeout");
          }
          setIsSubmit(false);
        });
    }
  };

  // Validations


  return (
    <div>
      <Container>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <div className=" mt-2 mb-4">
              <h4>{courseName}</h4>
            </div>
            <h5 className="text-center mb-3">Lesson Create</h5>
            <Formik
              initialValues={{
                lessonNumber: "",
                lessonName: "",
                lessonActualAmount: "",
                lessonDiscountAmount: "",
                zoomLink: zoomLink,
                zoomPassword: "",
                description: "",
                descriptionValue: "",
              }}
              validationSchema={createLessonSchema}
              onSubmit={(values) => submitForm(values)}
            >
              {(formik) => {
                const { values, setFieldValue, handleChange, handleSubmit, handleBlur, isValid } = formik;
                return (
                  <div>
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col xs={12} sm={6}>
                          <Form.Group className="form-row mb-3">
                            <Label notify={true}>Lesson Number</Label>
                            <FormControl
                              type="type"
                              name="lessonNumber"
                              id="lessonNumber"
                              placeholder="Lesson Number"
                              value={values.lessonNumber}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-styles"
                            />
                            <ErrorMessage name="lessonNumber" component="span" className="error text-danger" />
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                          <Form.Group className="form-row mb-3">
                            <Label notify={true}>Lesson Name</Label>
                            <FormControl
                              type="type"
                              name="lessonName"
                              id="lessonName"
                              placeholder="Enter Lesson Name"
                              value={values.lessonName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-styles"
                            />
                            <ErrorMessage name="lessonName" component="span" className="error text-danger" />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} sm={6}>
                          <Form.Group className="form-row mb-3">
                            <Label notify={true}> Actual Amount</Label>
                            <InputGroup className="input-group ">
                              <InputGroup.Text>
                                <FontAwesomeIcon icon={faDollarSign} size="1x" />
                              </InputGroup.Text>
                              <FormControl
                                type="type"
                                name="lessonActualAmount"
                                id="lessonActualAmount"
                                placeholder=" Actual Amount"
                                value={values.lessonActualAmount}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-styles"
                              />
                            </InputGroup>
                            <ErrorMessage name="lessonActualAmount" component="span" className="error text-danger" />
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                          <Form.Group className="form-row mb-3">
                            <Label notify={true}> Discount Amount</Label>
                            <InputGroup className="input-group ">
                              <InputGroup.Text>
                                <FontAwesomeIcon icon={faDollarSign} size="1x" />
                              </InputGroup.Text>
                              <FormControl
                                type="type"
                                name="lessonDiscountAmount"
                                id="lessonDiscountAmount"
                                placeholder=" Discount Amount"
                                value={values.lessonDiscountAmount}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-styles"
                              />
                            </InputGroup>
                            <ErrorMessage name="lessonDiscountAmount" component="span" className="error text-danger" />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} sm={6} md={6}>
                          <Form.Group className="form-row mb-3">
                            <Label>Zoom Link</Label>
                            <FormControl
                              type="text"
                              id="zoomLink"
                              disabled={true}
                              placeholder="Zoom Link"
                              value={zoomLink}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-styles"
                            />
                            <ErrorMessage
                              name="zoomLink"
                              component="span"
                              className="error text-danger error-message"
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={6} md={6}>
                          <Form.Group className="form-row mb-3">
                            <Label>Zoom Password</Label>
                            <FormControl
                              type="type"
                              disabled={true}
                              // name="zoomPassword"
                              id="zoomPassword"
                              placeholder="Zoom Password"
                              value={zoomPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-styles"
                            />
                            <ErrorMessage
                              name="zoomPassword"
                              component="span"
                              className="error text-danger error-message"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <div>
                        <Label notify={true}>Description</Label>
                        <div className="description">
                          <Editor
                            spellCheck
                            name="descriptionValue"
                            editorState={description}
                            onEditorStateChange={(e) => {
                              setDescription(e);
                              onChangeDescription({ setFieldValue }, e);
                            }}
                            toolbar={{
                              options: ["inline", "list", "textAlign"],
                            }}
                          />
                        </div>
                        <ErrorMessage name="descriptionValue" component="span" className="error text-danger" />
                      </div>
                      <div className="d-xs-block d-sm-block d-md-flex d-lg-flex mb-4 justify-content-between">
                        <Button
                          variant="contained"
                          className="create-active mt-3"
                          onClick={() => {
                            getZoomLink();
                          }}
                        >
                          CREATE ZOOM LINK
                        </Button>
                        <div className="d-flex mt-3">
                          <Button
                            className="px-3 Kharpi-cancel-btn"
                            onClick={() => {
                              props.history.goBack();
                            }}
                          >
                            CANCEL
                          </Button>
                          <Button
                            type="submit"
                            disabled={!isValid || isSubmit}
                            variant="contained"
                            className={`${!isValid || isSubmit ? "create-disable ms-3" : "create-active ms-3"}`}
                          >
                            CREATE
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                );
              }}
            </Formik>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateCourseLessons;
