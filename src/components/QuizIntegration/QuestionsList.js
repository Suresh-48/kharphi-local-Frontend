import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import { Form, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

// Api
import Api from "../../Api";

// Component
import Loader from "../core/Loader";

const QuestionsList = (props) => {
  const history = useHistory();
  const [lessonId, setlessonId] = useState(props?.lessonId);
  const [questionsList, setquestionsList] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [count, setCount] = useState(0);
  const userId = localStorage.getItem("userId");

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    questionList();
  }, []);

  const questionList = () => {
    Api.get("api/v1/lessonQuiz/list", {
      params: {
        courseLessonId: lessonId,
        userId: userId,
      },
    })
      .then((res) => {
        const data = res.data.quizData;
        const datacount = data.length;
        setCount(datacount);
        setquestionsList(data);
        setisLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
          this.setState({ isSubmit: false, show: false });
        }
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const deleteQuestions = (quizId) => {
    setisLoading(true);
    Api.delete(`api/v1/lessonQuiz/${quizId}`, { headers: { userId: userId } })
      .then((response) => {
        toast.success("Deleted");
        questionList();
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
      ) : count > 0 ? (
        <div className="input-style">
          <div className="px-4 pt-2">
            <h6>Questions List</h6>
          </div>
          {questionsList.map((list, index) => (
            <Row>
              <Col xs={10} sm={11} md={11} lg={11}>
                <div className="px-2">
                  <div className="d-flex">
                    <TextField
                      fullWidth
                      id="standard-basic"
                      variant="standard"
                      name="no"
                      value={`${index + 1 + "."}`}
                      className="mt-4"
                      style={{ width: "3%" }}
                    />
                    <TextField
                      fullWidth
                      className="mt-4"
                      name="question"
                      id="standard-basic"
                      value={list.question}
                      variant="standard"
                    />
                  </div>
                  {list.type === "text" && (
                    <Form>
                      <Form.Group className="mb-2 mx-4 my-4">
                        <Form.Control disabled as="textarea" rows={3} />
                      </Form.Group>
                    </Form>
                  )}
                  {list.type === "radio" && (
                    <div>
                      <div className="option-list mt-3">
                        <Radio value="" name="radio-buttons" disabled />
                        <p className="ms-2 mb-0">{list.option1}</p>
                      </div>
                      <div className="option-list mt-3">
                        <Radio value="" name="radio-buttons" disabled />
                        <p className="ms-2 mb-0">{list.option2}</p>
                      </div>
                      <div className="option-list mt-3">
                        <Radio value="" name="radio-buttons" disabled />
                        <p className="ms-2 mb-0">{list.option3}</p>
                      </div>
                      <div className="option-list mt-3">
                        <Radio value="" name="radio-buttons" disabled />
                        <p className="ms-2 mb-0">{list.option4}</p>
                      </div>
                    </div>
                  )}
                  {list.type === "checkbox" && (
                    <div>
                      <div className="option-list mt-3">
                        <Checkbox value="" name="radio-buttons" className="pt-0" disabled />
                        <p className="ms-2 mb-0">{list.checkBox1}</p>
                      </div>
                      <div className="option-list mt-3">
                        <Checkbox value="" name="radio-buttons" className="pt-0" disabled />
                        <p className="ms-2 mb-0">{list.checkBox2}</p>
                      </div>
                      <div className="option-list mt-3">
                        <Checkbox value="" name="radio-buttons" className="pt-0" disabled />
                        <p className="ms-2 mb-0">{list.checkBox3}</p>
                      </div>
                      <div className="option-list mt-3">
                        <Checkbox value="" name="radio-buttons" className="pt-0" disabled />
                        <p className="ms-2 mb-0">{list.checkBox4}</p>
                      </div>
                    </div>
                  )}
                  {list.type === "fileUpload" && (
                    <Form.Group controlId="formFile" className="mb-3 mx-4">
                      <Form.Control disabled type="file" className="mt-2" />
                    </Form.Group>
                  )}
                </div>
              </Col>
              <Col xs={2} sm={1} md={1} lg={1}>
                <div className="px-2 mt-4">
                  <FontAwesomeIcon
                    icon={faPen}
                    color="#0071df"
                    onClick={() => {
                      history.push("/quiz/edit", {
                        type: list.type,
                        quizId: list.id,
                      });
                    }}
                    className="me-2 edit-delete-question"
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    color="#c62c2c"
                    onClick={() => deleteQuestions(list.id)}
                    className="edit-delete-question"
                  />
                </div>
              </Col>
            </Row>
          ))}
        </div>
      ) : (
        <div className="d-flex justify-content-center mt-5">
          <p>Questions Yet To Be Created !...</p>
        </div>
      )}
    </div>
  );
};

export default QuestionsList;
