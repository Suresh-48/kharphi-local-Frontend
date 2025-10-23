import React, { Component, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@mui/material/Checkbox";
import { toast } from "react-toastify";

// Api
import Api from "../../Api";

const CheckBox = (props) => {
  const [courseId, setCourseId] = useState(props?.courseId);
  const [lessonId, setLessonId] = useState(props?.lessonId);
  const [type, setType] = useState("checkbox");
  const [isSubmit, setIsSubmit] = useState(false);
  const [questionNumber, setQuestionNumber] = useState("");
  const [question, setQuestion] = useState("");
  const [checkBox1, setCheckBox1] = useState("");
  const [checkBox2, setCheckBox2] = useState("");
  const [checkBox3, setCheckBox3] = useState("");
  const [checkBox4, setCheckBox4] = useState("");

  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      props.history.push("/kharpi");
      window.location.reload();
    }, 2000);
  };

  const handleSubmit = () => {
    const userId = localStorage.getItem("userId");
    setIsSubmit(true);
    Api.post(`api/v1/lessonQuiz/add`, {
      courseId: courseId,
      courseLessonId: lessonId,
      question: question,
      questionNumber: questionNumber,
      checkBox1: checkBox1,
      checkBox2: checkBox2,
      checkBox3: checkBox3,
      checkBox4: checkBox4,
      type: type,
      userId: userId,
    })
      .then((response) => {
        toast.success("Created Successfully");
        setQuestionNumber("");
        setQuestion("");
        setCheckBox1("");
        setCheckBox2("");
        setCheckBox3("");
        setCheckBox4("");
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
            onChange={(e) => {
              setQuestionNumber(e.target.value);
            }}
            className="mt-4"
            style={{ width: "12%", marginRight: "1%" }}
          /> */}
          <TextField
            fullWidth
            className="mt-4"
            multiline
            id="filled-basic"
            label="Enter Your Question"
            name="question"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            variant="filled"
          />
        </div>
        <div className="d-flex mt-3 options">
          <Checkbox value="" disabled name="radio-buttons" className="radio-options" />
          <TextField
            id="standard-basic"
            label="Option 1"
            variant="standard"
            name="checkBox1"
            multiline
            fullWidth
            value={checkBox1}
            onChange={(e) => {
              setCheckBox1(e.target.value);
            }}
            className="ms-3"
            style={{ width: "80%" }}
          />
        </div>
        <div className="d-flex mt-3 options">
          <Checkbox value="" disabled name="radio-buttons" className="radio-options" />
          <TextField
            id="standard-basic"
            label="Option 2"
            variant="standard"
            name="checkBox2"
            multiline
            fullWidth
            value={checkBox2}
            onChange={(e) => {
              setCheckBox2(e.target.value);
            }}
            className="ms-3"
            style={{ width: "80%" }}
          />
        </div>
        <div className="d-flex mt-3 options">
          <Checkbox value="" disabled name="radio-buttons" className="radio-options" />
          <TextField
            id="standard-basic"
            label="Option 3"
            variant="standard"
            name="checkBox3"
            multiline
            fullWidth
            value={checkBox3}
            onChange={(e) => {
              setCheckBox3(e.target.value);
            }}
            className="ms-3"
            style={{ width: "80%" }}
          />
        </div>
        <div className="d-flex mt-3 options">
          <Checkbox value="" disabled name="radio-buttons" className="radio-options" />
          <TextField
            id="standard-basic"
            label="Option 4"
            variant="standard"
            name="checkBox4"
            multiline
            fullWidth
            value={checkBox4}
            onChange={(e) => {
              setCheckBox4(e.target.value);
            }}
            className="ms-3"
            style={{ width: "80%" }}
          />
        </div>
        <div className="mt-3 d-flex justify-content-end">
          <Button
            variant="contained"
            className="Kharpi-save-btn mb-2"
            color="primary"
            type="submit"
            disabled={
              // questionNumber === "" ||
              question === "" ||
              checkBox1 === "" ||
              checkBox2 === "" ||
              // checkBox3 === "" ||
              // checkBox4 === "" ||
              isSubmit
            }
            onClick={handleSubmit}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckBox;
