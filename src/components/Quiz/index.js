import React, { Component, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "survey-react/survey.css";
import { Form } from "react-bootstrap";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { FormGroup, Checkbox } from "@mui/material";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";

// Api
import Api from "../../Api";

// Component
import Loader from "../../components/core/Loader";
import QuizImage from "./quizImage.png";

// Styles
import "../../css/Quiz.scss";

const Quiz = (props) => {
  const [quizScheduleId, setQuizScheduleId] = useState(props?.location?.state?.id);
  const [courseLessonId, setCourseLessonId] = useState(props?.location?.state?.courseLessonId?._id);
  const [lessonNumber, setLessonNumber] = useState(props?.location?.state?.courseLessonId?.lessonNumber);
  const [lessonName, setLessonName] = useState(props?.location?.state?.courseLessonId?.lessonName);
  const [courseName, setCourseName] = useState(props?.location?.state?.courseId?.name);
  const [answer1, setAnswer1] = useState({});
  const [question, setQuestion] = useState(props?.location?.state?.questions);
  const [isSubmit, setIsSubmit] = useState(false);
  const [checked, setChecked] = useState({
    checkBox1: false,
    checkBox2: false,
    checkBox3: false,
    checkBox4: false,
  });

  // Logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      props.history.push("/kharpi");
      window.location.reload();
    }, 2000);
  };

  const handleChange = (e, index, list) => {
    const indexCount = index + 1;
    let answerType = list.type !== "fileUpload" ? e.target.value : e.target.files[0];
    {
      list.type === "fileUpload" && (answerType.questionName = list._id);
    }
    const datas = {
      questionId: list._id,
      type: list.type,
      answer: answerType,
      questionNumber: indexCount,
    };
    setAnswer1(datas);
  };

  // Checkbox handle change
  const checkBoxHandleChange = (event, index, list) => {
    const { checked } = checked;
    const indexCount = index + 1;
    const data = { ...checked, [event.target.name]: event.target.checked };
    setChecked(data);
    const datas = {
      questionId: list._id,
      type: list.type,
      answer: data,
      questionNumber: indexCount,
    };
    setAnswer1(datas);
  };

  const updateAnswer = (answer) => {
    const userId = localStorage.getItem("userId");
    Api.post("api/v1/quizSchedule/student/answer", {
      quizId: quizScheduleId,
      answers: answer,
      courseLessonId: courseLessonId,
      userId: userId,
    })
      .then((res) => {
        toast.success("Submitted Successfully");
        setIsSubmit(false);
        props.history.goBack();
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
      });
  };

  const handleSubmit = async () => {
    // setIsSubmit(true);
    let result = [];
    const count = question.length;
    let formData = new FormData();
    formData.append("lessonName", lessonName);
    formData.append("questionModel", "quiz");
    const userId = localStorage.getItem("userId");

    const fileUploadCount = [];
    for (let i = 1; i <= count; i++) {
      const data = answer1;

      if (data.type === "fileUpload") {
        formData.append("questionNumber", data.questionNumber);
        formData.append("fileUpload", data.answer);
        fileUploadCount.push(i);
      }
      result.push(answer1);
    }
    if (fileUploadCount.length === 0) {
      updateAnswer(result);
    } else {
      Api.post("api/v1/quizSchedule/file/upload", formData, { headers: { userId: userId } })
        .then((res) => {
          const fileUrl = res.data.file;
          const qusNumbers = res.data.questionNumbers;

          qusNumbers.forEach((res, i) => {
            const number = parseInt(res);
            const ff = result.findIndex((value) => value.questionNumber === number);
            result[ff].answer = fileUrl[i].location;
          });
          updateAnswer(result);
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
        });
    }
  };

  return (
    <div>
      <Container>
        <Row>
          <Col xs={12} sm={5} className="d-flex justiy-content-center align-items-center">
            <img src={QuizImage} alt="Snow" width={"18%"} height={"80%"} />
            <div>
              <p className="mb-0 welcome-text">Welcome</p>
              <h6>{`Quiz for Lesson ${lessonNumber}`}</h6>
            </div>
          </Col>
          <Col xs={12} sm={7} className="quiz-heading ">
            <p className="coursename-text mb-0">{`${courseName}-${lessonName}`}</p>
          </Col>
        </Row>
        <hr className="heading-bottom" />
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
                    <Form.Control as="textarea" rows={3} onChange={(e) => handleChange(e, index, list)} />
                  </Form.Group>
                </Form>
              )}
              {list.type === "radio" && (
                <div className="option-list mt-3">
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue=""
                      value={answer1.answer}
                      onChange={(e) => handleChange(e, index, list)}
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
                    <FormGroup>
                      <FormControlLabel
                        className="mb-2"
                        value={list.option1}
                        control={
                          <Checkbox
                            checked={checked.checkBox1}
                            onChange={(e) => checkBoxHandleChange(e, index, list)}
                            name="checkBox1"
                          />
                        }
                        label={list.checkBox1}
                      />
                      <FormControlLabel
                        className="mb-2"
                        value={list.option2}
                        control={
                          <Checkbox
                            checked={checked.checkBox2}
                            onChange={(e) => checkBoxHandleChange(e, index, list)}
                            name="checkBox2"
                          />
                        }
                        label={list.checkBox2}
                      />
                      <FormControlLabel
                        value={list.option3}
                        className="mb-2"
                        control={
                          <Checkbox
                            checked={checked.checkBox3}
                            onChange={(e) => checkBoxHandleChange(e, index, list)}
                            name="checkBox3"
                          />
                        }
                        label={list.checkBox3}
                      />
                      <FormControlLabel
                        value={list.option4}
                        className="mb-2"
                        control={
                          <Checkbox
                            checked={checked.checkBox4}
                            onChange={(e) => checkBoxHandleChange(e, index, list)}
                            name="checkBox4"
                          />
                        }
                        label={list.checkBox4}
                      />
                    </FormGroup>
                  </FormControl>
                </div>
              )}
              {list.type === "fileUpload" && (
                <Form.Group controlId="formFile" className="mb-3 mx-4">
                  <Form.Control type="file" onChange={(e) => handleChange(e, index, list)} />
                </Form.Group>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 mx-3 mb-3 d-flex justify-content-end">
          <Button variant="contained" color="primary" type="submit" disabled={isSubmit} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Quiz;
