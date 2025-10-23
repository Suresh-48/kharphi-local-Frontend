import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@mui/material/Radio';
import { toast } from 'react-toastify';

// Api
import Api from '../../Api';

const RadioButton = (props) => {
  const [courseId] = useState(props?.courseId);
  const [lessonId] = useState(props?.lessonId);
  const [type] = useState('radio');
  const [isSubmit, setIsSubmit] = useState(false);
  const [questionNumber, setQuestionNumber] = useState('');
  const [question, setQuestion] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');

  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      props.history.push('/kharpi');
      window.location.reload();
    }, 2000);
  };

  const handleSubmit = () => {
    const userId = localStorage.getItem('userId');
    setIsSubmit(true);
    Api.post('api/v1/lessonHomework/add', {
      courseId: courseId,
      courseLessonId: lessonId,
      question: question,
      questionNumber: questionNumber,
      option1: option1,
      option2: option2,
      option3: option3,
      option4: option4,
      type: type,
      userId: userId,
    })
      .then((response) => {
        toast.success('Created Successfully');
        setQuestionNumber('');
        setQuestion('');
        setOption1('');
        setOption2('');
        setOption3('');
        setOption4('');
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
          toast.error('Session Timeout');
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
              value={this.state.questionNumber}
              onChange={(e) => {
                this.setState({ questionNumber: e.target.value });
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
          <Radio value="" name="radio-buttons" disabled className="radio-options" />
          <TextField
            id="standard-basic"
            label="Option 1"
            variant="standard"
            name="option1"
            multiline
            fullWidth
            value={option1}
            onChange={(e) => {
              setOption1(e.target.value);
            }}
            className="ms-3"
            style={{ width: '80%' }}
          />
        </div>
        <div className="d-flex mt-3 options">
          <Radio value="" name="radio-buttons" disabled className="radio-options" />
          <TextField
            id="standard-basic"
            label="Option 2"
            variant="standard"
            name="option1"
            multiline
            fullWidth
            value={option2}
            onChange={(e) => {
              setOption2(e.target.value);
            }}
            className="ms-3"
            style={{ width: '80%' }}
          />
        </div>
        <div className="d-flex mt-3 options">
          <Radio value="" name="radio-buttons" disabled className="radio-options" />
          <TextField
            id="standard-basic"
            label="Option 3"
            variant="standard"
            name="option1"
            multiline
            fullWidth
            value={option3}
            onChange={(e) => {
              setOption3(e.target.value);
            }}
            className="ms-3"
            style={{ width: '80%' }}
          />
        </div>
        <div className="d-flex mt-3 options">
          <Radio value="" name="radio-buttons" disabled className="radio-options" />
          <TextField
            id="standard-basic"
            label="Option 4"
            variant="standard"
            name="option1"
            multiline
            fullWidth
            value={option4}
            onChange={(e) => {
              setOption4(e.target.value);
            }}
            className="ms-3"
            style={{ width: '80%' }}
          />
        </div>
        <div className="mt-3 d-flex justify-content-end">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={
              // this.state.questionNumber === "" ||
              question === '' ||
              option1 === '' ||
              option2 === '' ||
              option3 === '' ||
              option4 === '' ||
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

export default RadioButton;
