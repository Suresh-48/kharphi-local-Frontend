import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Form } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";

// Api
import Api from "../../Api";

const FileUpload = (props) => {
  const [courseId] = useState(props?.courseId);
  const [lessonId] = useState(props?.lessonId);
  const [question, setQuestion] = useState("");
  const [type] = useState("fileUpload");
  const [isSubmit, setIsSubmit] = useState(false);

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
    Api.post("api/v1/lessonHomework/add", {
      courseId,
      courseLessonId: lessonId,
      question,
      type,
      userId,
    })
      .then((response) => {
        toast.success("Created Successfully");
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
          <TextField
            fullWidth
            className="mt-4"
            multiline
            id="filled-basic"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            label="Enter Your Question"
            variant="filled"
          />
        </div>
        <Form.Group controlId="formFile" className="mt-4">
          <Form.Control
            disabled
            type="file"
            style={{ backgroundColor: "#F0F0F0" }}
          />
        </Form.Group>
        <div className="mt-3 d-flex justify-content-end">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={question === "" || isSubmit}
            onClick={handleSubmit}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
