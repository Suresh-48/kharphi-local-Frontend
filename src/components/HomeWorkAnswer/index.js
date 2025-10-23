import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@material-ui/core/Button";
import { Checkbox, FormGroup } from "@mui/material";

// Component
import Loader from "../core/Loader";
import HomeWorkImage from "../HomeWork/HomeWorkImage.png";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faFileAlt,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

// Styles
import "../../css/QuizPreview.scss";

const HomeWorkAnswer = (props) => {
  const [isLoading] = useState(false);
  const [homeworkScheduleId] = useState(props?.location?.state?.id);
  const [lessonNumber] = useState(
    props?.location?.state?.courseLessonId?.lessonNumber
  );
  const [lessonName] = useState(
    props?.location?.state?.courseLessonId?.lessonName
  );
  const [courseName] = useState(props?.location?.state?.courseId?.name);
  const [questionCount] = useState(props?.location?.state?.questions?.length);
  const [reviewAnswer] = useState(props?.location?.state?.reviewAnswer);
  const [scored] = useState(props?.location?.state?.scored);
  const [isSubmit] = useState(false);
  const [reviewStatus] = useState(props?.location?.state?.reviewStatus);
  const [question] = useState(props?.location?.state?.questions);

  return (
    <div className="footer-bottom-alignments">
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Row>
            <Col
              xs={12}
              sm={5}
              className="d-flex justiy-content-center align-items-center"
            >
              <img
                src={HomeWorkImage}
                alt="Snow"
                width={"18%"}
                height={"80%"}
              />
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
              <div style={{ minHeight: "365px" }}>
                {question.map((list, index) => (
                  <div className="px-2">
                    <div className="d-flex" key={index}>
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
                            disabled
                            value={list?.answer}
                            rows={3}
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
                            disabled
                            value={list?.answer}
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
                              control={
                                <Checkbox
                                  checked={list.answer.checkBox1}
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
                                  checked={list.answer.checkBox2}
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
                                  checked={list.answer.checkBox3}
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
                                  checked={list.answer.checkBox4}
                                  name="checkBox4"
                                />
                              }
                              label={list.checkBox4}
                            />
                          </FormGroup>
                        </FormControl>
                      </div>
                    )}
                    {list.type === "fileUpload" &&
                      (list.answer ? (
                        <div className="mt-3 px-1">
                          <div className="d-flex justify-content-start align-items-center mb-3 file-upload-answer">
                            <FontAwesomeIcon
                              icon={faFileAlt}
                              size="2x"
                              color="gray"
                              className="me-2"
                            />
                            <p className="mb-0">{list.answer}</p>
                          </div>
                          <div className="d-flex justify-content-start mx-5">
                            <Button
                              variant="contained"
                              color="primary"
                              rel="noopener noreferrer"
                              target="_blank"
                              onClick={() => window.open(list.answer, "_blank")}
                            >
                              <FontAwesomeIcon
                                icon={faDownload}
                                size="1x"
                                color="primary"
                                className="me-2"
                              />
                              Download
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="my-3 ps-5">
                          <h6>Not Answered</h6>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </Col>
            <Col xs={12} sm={12} md={5}>
              <h5 className="d-flex justify-content-center mt-3">
                HomeWork Result
              </h5>
              <div className="result-container">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Questions</th>
                      <th>Answers</th>
                      <th>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(questionCount)].length > 0 &&
                      reviewAnswer?.map((list, index) => (
                        <tr>
                          <div className="d-flex justify-content-center ">
                            <tr>Q-{index + 1}</tr>
                          </div>
                          <td style={{ textAlign: "center" }}>
                            {list.answer ? (
                              <FontAwesomeIcon
                                icon={faCheck}
                                size="md"
                                color="green"
                                className="mx-1"
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faTimes}
                                size="md"
                                color="#cf2b2be8"
                              />
                            )}
                          </td>
                          <td>
                            {list.comment ? (
                              <textarea className="textarea" disabled={true}>
                                {list.comment}
                              </textarea>
                            ) : (
                              <p>-</p>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="score-container">
                <p className="score-text-style">Scored : </p>
                <p className="score-count-style">{scored} %</p>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default HomeWorkAnswer;
