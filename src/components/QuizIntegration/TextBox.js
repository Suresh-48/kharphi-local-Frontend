import React, { useState } from "react";
import { Form } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";

// Api
import Api from "../../Api";

const TextBox = (props) => {
  const [courseId, setCourseId] = useState(props?.courseId);
  const [lessonId, setLessonId] = useState(props?.lessonId);
  const [questionNumber, setQuestionNumber] = useState("");
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("text");
  const [isSubmit, setIsSubmit] = useState(false);

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      props.history.push("/kharpi");
      window.location.reload();
    }, 2000);
  };

  const handleSubmit = () => {
    setIsSubmit(true);
    const userId = localStorage.getItem("userId");
    Api.post(`api/v1/lessonQuiz/add`, {
      courseId: courseId,
      courseLessonId: lessonId,
      question: question,
      questionNumber: questionNumber,
      type: type,
      userId: userId,
    })
      .then((response) => {
        toast.success("Created Successfully");
        setQuestionNumber("");
        setQuestion("");
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
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  return (
    <div className="input-style mt-3">
      <div className="px-2">
        <div className="d-flex">
          {/* <TextField
            id="filled-basic"
            label="No."
            variant="filled"
            name="questionNumber"
            value={questionNumber}
            className="mt-4"
            onChange={(e) => {
              setQuestionNumber(e.target.value);
            }}
            style={{ width: "12%", marginRight: "1%" }}
          /> */}
          <TextField
            fullWidth
            className="mt-4"
            multiline
            name="question"
            id="filled-basic"
            value={question}
            label="Enter Your Question"
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            variant="filled"
          />
        </div>
        <Form>
          <Form.Group className="mt-4">
            <Form.Control
              disabled
              as="textarea"
              rows={3}
              placeholder="Enter Your Answer"
              style={{ backgroundColor: "#f0f0f0" }}
            />
          </Form.Group>
        </Form>
        <div className="mt-3 d-flex justify-content-end">
          <Button
            variant="contained"
            className="Kharpi-save-btn"
            color="primary"
            type="submit"
            disabled={
              // questionNumber === "" ||
              question === "" || isSubmit
            }
            onClick={() => handleSubmit()}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextBox;
