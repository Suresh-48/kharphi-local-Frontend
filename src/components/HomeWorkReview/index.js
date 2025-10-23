import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import { Formik } from "formik";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import { Checkbox, FormGroup } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

// Api
import Api from "../../Api";

// Component
import Loader from "../../components/core/Loader";
import HomeWorkImage from "../HomeWork/HomeWorkImage.png";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faFileAlt, faDownload } from "@fortawesome/free-solid-svg-icons";

// Styles
import "../../css/Quiz.scss";
import { toast } from "react-toastify";

const HomeWorkReview = (props) => {
  const [homeworkScheduleId] = useState(props?.location?.state?.id);
  const [lessonNumber, setLessonNumber] = useState(props?.location?.state?.courseLessonId?.lessonNumber);
  const [lessonName, setLessonName] = useState(props?.location?.state?.courseLessonId?.lessonName);
  const [courseName, setCourseName] = useState(props?.location?.state?.courseId?.name);
  const [questionCount, setQuestionCount] = useState(props?.location?.state?.questions?.length);
  const [isSubmit, setIsSubmit] = useState(false);
  const [question, setQuestion] = useState(props?.location?.state?.questions);
  const [reviewAnswer, setReviewAnswer] = useState(
    props?.location?.state?.reviewAnswer
  );
  const [isLoading, setIsLoading] = useState(false);
  const [Q1, setQ1] = useState("");
  const [Q2, setQ2] = useState("");
  const [Q3, setQ3] = useState("");
  const [Q4, setQ4] = useState("");
  const [Q5, setQ5] = useState("");
  const [Q6, setQ6] = useState("");
  const [Q7, setQ7] = useState("");
  const [Q8, setQ8] = useState("");
  const [Q9, setQ9] = useState("");
  const [Q10, setQ10] = useState("");
  const [comment1, setComment1] = useState("");
  const [comment2, setComment2] = useState("");
  const [comment3, setComment3] = useState("");
  const [comment4, setComment4] = useState("");
  const [comment5, setComment5] = useState("");
  const [comment6, setComment6] = useState("");
  const [comment7, setComment7] = useState("");
  const [comment8, setComment8] = useState("");
  const [comment9, setComment9] = useState("");
  const [comment10, setComment10] = useState("");


  const logout = () => {
    setTimeout(() => {
      localStorage.clear(props.history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Comment onChange
  const commentChange = (text, index) => {
    const number = index + 1;
    const commentNumber = "comment" + number;
    switch (commentNumber) {
      case "comment1":
        setComment1(text);
        break;
      case "comment2":
        setComment2(text);
        break;
      case "comment3":
        setComment3(text);
        break;
      case "comment4":
        setComment4(text);
        break;
      case "comment5":
        setComment5(text);
        break;
      case "comment6":
        setComment6(text);
        break;
      case "comment7":
        setComment7(text);
        break;
      case "comment8":
        setComment8(text);
        break;
      case "comment9":
        setComment9(text);
        break;
      case "comment10":
        setComment10(text);
        break;
      default:
        break;
    }
  };

  const submitForm = (values) => {
    setIsSubmit(true);
    const mark = [];
    const markPerQuestion = 100 / questionCount;

    for (let i = 1; i <= questionCount; i++) {
      mark.push({
        answer: eval("Q" + i),
        comment: eval("comment" + i),
      });
    }

    const correctAnswer = mark.filter(function (mark) {
      return mark.answer === true;
    }).length;

    const markPercent = correctAnswer * markPerQuestion;
    const score = Math.round(markPercent);

    const validate = mark.filter(function (mark) {
      return mark.answer === "";
    }).length;
    const userId = localStorage.getItem("userId");

    if (validate === 0) {
      Api.patch("api/v1/homeworkSchedule/review/mark", {
        homeworkScheduleId: homeworkScheduleId,
        reviewAnswer: mark,
        scored: score,
        userId: userId,
      })
        .then((response) => {
          props.history.goBack();
          setIsSubmit(false);
        })
        .catch((error) => {
          const errorStatus = error?.response?.status;
          if (errorStatus === 401) {
            logout();
            toast.error("Session Timeout");
          }
        });
    } else {
      toast.error("Please Ckeck You have Corrected All the Questions ");
      setIsSubmit(false);
    }
  };

  // Correct Answer
  const correct = (index) => {
    const number = index + 1;
    const questionNo = "Q" + number;
    const questionValue = "QValue" + number;
    eval(`set${questionNo}(true)`);
    eval(`set${questionValue}('marked')`);
  };

  // Wrong Answer
  const wrong = (index, e) => {
    const number = index + 1;
    const questionNo = "Q" + number;
    const questionValue = "QValue" + number;
    eval(`set${questionNo}(false)`);
    eval(`set${questionValue}('marked')`);
  };

  return (
    <div className="footer-bottom-alignments">
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Row>
            <Col xs={12} sm={5} className="d-flex justiy-content-center align-items-center">
              <img src={HomeWorkImage} alt="Snow" width={"18%"} height={"80%"} />
              <div>
                <p className="mb-0 welcome-text">Welcome</p>
                <h6>{`HomeWork for Lesson ${lessonNumber}`}</h6>
              </div>
            </Col>
            <Col xs={12} sm={7} className="quiz-heading ">
              <p className="coursename-text mb-0">{`${courseName}-${lessonName}`}</p>
            </Col>
          </Row>
          <hr className="heading-bottom" />
          <Row>
            <Col xs={12} sm={12} md={7}>
              <div>
                {question.map((list, index) => (
                  <div className="px-2" key={index}>
                    <div className="d-flex">
                      <TextField
                        fullWidth
                        id="standard-basic"
                        variant="standard"
                        name="no"
                        disabled
                        value={`${index + 1 + "."}`}
                        className="mt-4"
                        style={{ width: "3%" }}
                      />
                      <TextField
                        fullWidth
                        className="mt-4"
                        multiline
                        name="question"
                        id="standard-basic"
                        disabled
                        value={list.question}
                        variant="standard"
                      />
                    </div>
                    {list.type === "text" && (
                      <Form>
                        <Form.Group className="mb-2 mx-4 my-4" controlId="exampleForm.ControlTextarea1">
                          <Form.Control as="textarea" disabled value={list?.answer} rows={3} />
                        </Form.Group>
                      </Form>
                    )}
                    {list.type === "radio" && (
                      <div className="option-list mt-3">
                        <FormControl>
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            value={list?.answer}
                            disabled
                            name="radio-buttons-group"
                          >
                            <FormControlLabel
                              className="mb-2"
                              value={list.option1}
                              control={<Radio />}
                              label={list.option1}
                            />
                            <FormControlLabel
                              className="mb-2"
                              value={list.option2}
                              control={<Radio />}
                              label={list.option2}
                            />
                            <FormControlLabel
                              className="mb-2"
                              value={list.option3}
                              control={<Radio />}
                              label={list.option3}
                            />
                            <FormControlLabel
                              className="mb-2"
                              value={list.option4}
                              control={<Radio />}
                              label={list.option4}
                            />
                          </RadioGroup>
                        </FormControl>
                      </div>
                    )}
                    {list.type === "checkbox" && (
                      <div className="option-list mt-3">
                        <FormControl>
                          <FormGroup disabled>
                            <FormControlLabel
                              className="mb-2"
                              value={list.option1}
                              control={<Checkbox checked={list.answer.checkBox1} name="checkBox1" />}
                              label={list.checkBox1}
                            />
                            <FormControlLabel
                              className="mb-2"
                              value={list.option2}
                              control={<Checkbox checked={list.answer.checkBox2} name="checkBox2" />}
                              label={list.checkBox2}
                            />
                            <FormControlLabel
                              value={list.option3}
                              className="mb-2"
                              control={<Checkbox checked={list.answer.checkBox3} name="checkBox3" />}
                              label={list.checkBox3}
                            />
                            <FormControlLabel
                              value={list.option4}
                              className="mb-2"
                              control={<Checkbox checked={list.answer.checkBox4} name="checkBox4" />}
                              label={list.checkBox4}
                            />
                          </FormGroup>
                        </FormControl>
                      </div>
                    )}
                    {list.type === "fileUpload" && (
                      <div className="mt-3 px-1">
                        {list.answer ? (
                          <div className="d-flex justify-content-start align-items-center mb-3 file-upload-answer">
                            <FontAwesomeIcon icon={faFileAlt} size="2x" color="gray" className="me-2" />
                            <p className="mb-0">{list?.answer}</p>
                          </div>
                        ) : (
                          <div className="my-3 ps-5">
                            <h6>Not Answered</h6>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Col>
            <Col xs={12} sm={12} md={5}>
              <div className="col-sm-12">
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    remark: "",
                  }}
                  onSubmit={(values) => submitForm(values)}
                >
                  {(formik) => {
                    const { handleSubmit, isValid } = formik;
                    return (
                      <Row>
                        <Form onSubmit={handleSubmit}>
                          <Row>
                            <div>
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th style={{ marginLeft: "30px" }}>Questions</th>
                                    <th>Options</th>
                                    <th>Marks</th>
                                    <th>Comments</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[...Array(questionCount)].map((list, index) => (
                                    <tr key={index}>
                                      <div className="d-flex justify-content-center ">
                                        <tr>Q-{index + 1}</tr>
                                      </div>
                                      <td style={{ textAlign: "center" }}>
                                        <div className="row">
                                          <Col>
                                            <FontAwesomeIcon
                                              icon={faCheck}
                                              size="md"
                                              color="green"
                                              className="position-relative"
                                              onClick={() => correct(index)}
                                            />
                                          </Col>
                                          <Col>
                                            <FontAwesomeIcon
                                              icon={faTimes}
                                              size="md"
                                              color="#cf2b2be8"
                                              className="position-relative"
                                              onClick={() => wrong(index)}
                                            />
                                          </Col>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex justify-content-center">
                                          {eval(`Q${index + 1}`) === "" ? (
                                            <div></div>
                                          ) : eval(`Q${index + 1}`) === true ? (
                                            <FontAwesomeIcon icon={faCheck} size="md" color="green" className="mx-1" />
                                          ) : (
                                            <FontAwesomeIcon icon={faTimes} size="md" color="#cf2b2be8" />
                                          )}
                                        </div>
                                      </td>
                                      <td>
                                        <textarea
                                          className="textarea"
                                          placeholder="Enter Your Comments..."
                                          onChange={(e) => commentChange(e.target.value, index)}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div className="d-flex justify-content-end align-items-center">
                              <Button
                                type="submit"
                                disabled={!isValid || isSubmit}
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={{ width: "40%" }}
                              >
                                Submit
                              </Button>
                            </div>
                          </Row>
                        </Form>
                      </Row>
                    );
                  }}
                </Formik>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default HomeWorkReview;
