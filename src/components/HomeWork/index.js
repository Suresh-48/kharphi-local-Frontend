import React, { useState } from "react";
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
import HomeWorkImage from "./HomeWorkImage.png";

// Styles
import "../../css/Quiz.scss";

const HomeWork = (props) => {
  const [homeworkScheduleId] = useState(props?.location?.state?.id);
  const [courseLessonId] = useState(
    props?.location?.state?.courseLessonId?._id
  );
  const [lessonNumber] = useState(
    props?.location?.state?.courseLessonId?.lessonNumber
  );
  const [lessonName] = useState(
    props?.location?.state?.courseLessonId?.lessonName
  );
  const [courseName] = useState(props?.location?.state?.courseId?.name);
  const [answer1, setAnswer1] = useState({});
  const [answer2, setAnswer2] = useState({});
  const [answer3, setAnswer3] = useState({});
  const [answer4, setAnswer4] = useState({});
  const [answer5, setAnswer5] = useState({});
  const [answer6, setAnswer6] = useState({});
  const [answer7, setAnswer7] = useState({});
  const [answer8, setAnswer8] = useState({});
  const [answer9, setAnswer9] = useState({});
  const [answer10, setAnswer10] = useState({});
  const [question, setQuestion] = useState(props?.location?.state?.questions);
  const [isSubmit, setIsSubmit] = useState(false);
  const [checked, setChecked] = useState({
    checkBox1: false,
    checkBox2: false,
    checkBox3: false,
    checkBox4: false,
  });

  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 2000);
  };

  const handleChange = (e, index, list) => {
    const indexCount = index + 1;
    let answerType =
      list.type !== "fileUpload" ? e.target.value : e.target.files[0];
    {
      list.type === "fileUpload" && (answerType.questionName = list._id);
    }
    const datas = {
      questionId: list._id,
      type: list.type,
      answer: answerType,
      questionNumber: indexCount,
    };

    switch (indexCount) {
      case 1:
        setAnswer1(datas);
        break;
      case 2:
        setAnswer2(datas);
        break;
      case 3:
        setAnswer3(datas);
        break;
      case 4:
        setAnswer4(datas);
        break;
      case 5:
        setAnswer5(datas);
        break;
      case 6:
        setAnswer6(datas);
        break;
      case 7:
        setAnswer7(datas);
        break;
      case 8:
        setAnswer8(datas);
        break;
      case 9:
        setAnswer9(datas);
        break;
      case 10:
        setAnswer10(datas);
        break;
      default:
        break;
    }
  };

  // checkbox handle change
  const checkBoxHandleCHange = (event, index, list) => {
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

    switch (indexCount) {
      case 1:
        setAnswer1(datas);
        break;
      case 2:
        setAnswer2(datas);
        break;
      case 3:
        setAnswer3(datas);
        break;
      case 4:
        setAnswer4(datas);
        break;
      case 5:
        setAnswer5(datas);
        break;
      case 6:
        setAnswer6(datas);
        break;
      case 7:
        setAnswer7(datas);
        break;
      case 8:
        setAnswer8(datas);
        break;
      case 9:
        setAnswer9(datas);
        break;
      case 10:
        setAnswer10(datas);
        break;
      default:
        break;
    }
  };

  const updateAnswer = (answer) => {
    const userId = localStorage.getItem("userId");
    Api.post("api/v1/homeworkSchedule/student/answer", {
      homeworkId: homeworkScheduleId,
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
    setIsSubmit(true);
    const userId = localStorage.getItem("userId");
    let result = [];
    const count = question.length;
    let formData = new FormData();
    formData.append("lessonName", lessonName);
    formData.append("questionModel", "homework");
    const fileUploadCount = [];
    for (let i = 1; i <= count; i++) {
      const data = eval("answer" + i);
      if (data.type === "fileUpload") {
        formData.append("questionNumber", data.questionNumber);
        formData.append("fileUpload", data.answer);
        fileUploadCount.push(i);
      }
      result.push(eval("answer" + i));
    }
    if (fileUploadCount.length === 0) {
      updateAnswer(result);
    } else {
      Api.post("api/v1/homeworkSchedule/file/upload", formData, {
        headers: { userId: userId },
      })
        .then((res) => {
          const fileUrl = res.data.file;
          const qusNumbers = res.data.questionNumbers;
          qusNumbers.forEach((res, i) => {
            const number = parseInt(res);
            const ff = result.findIndex(
              (value) => value.questionNumber === number
            );
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
          <Col
            xs={12}
            sm={5}
            className="d-flex justiy-content-center align-items-center"
          >
            <img src={HomeWorkImage} alt="Snow" width={"18%"} height={"80%"} />
            <div>
              <p className="mb-0 welcome-text">Welcome</p>
              <h6>{`Home Work for Lesson ${lessonNumber}`}</h6>
            </div>
          </Col>
          <Col xs={12} sm={7} className="quiz-heading ">
            <p className="coursename-text mb-0">{`${courseName}-${lessonName}`}</p>
          </Col>
        </Row>
        <hr className="heading-bottom" />
        <div>
          {question?.map((list, index) => (
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
                  <Form.Group
                    className="mb-2 mx-4 my-4"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Control
                      as="textarea"
                      rows={3}
                      onChange={(e) => handleChange(e, index, list)}
                    />
                  </Form.Group>
                </Form>
              )}
              {list.type === "radio" && (
                <div className="option-list mt-3">
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue=""
                      value={eval("answer" + (index + 1)).answer}
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
                            onChange={(e) =>
                              checkBoxHandleCHange(e, index, list)
                            }
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
                            onChange={(e) =>
                              checkBoxHandleCHange(e, index, list)
                            }
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
                            onChange={(e) =>
                              checkBoxHandleCHange(e, index, list)
                            }
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
                            onChange={(e) =>
                              checkBoxHandleCHange(e, index, list)
                            }
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
                  <Form.Control
                    type="file"
                    onChange={(e) => handleChange(e, index, list)}
                  />
                </Form.Group>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 mx-3 d-flex justify-content-end">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmit}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default HomeWork;
