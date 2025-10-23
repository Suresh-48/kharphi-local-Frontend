import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";

// Style
import "../../css/QuizIntegration.scss";

// Component
import TextBox from "./TextBox";
import RadioButton from "./RadioButton";
import FileUpload from "./FileUpload";
import CheckBox from "./CheckBox";
import QuestionsList from "./QuestionsList";
import QuizImage from "./quizImage.png";
import CourseSideMenu from "../CourseSideMenu";
import Loader from "../core/Loader";

// Api
import Api from "../../Api";
import { toast } from "react-toastify";

const QuizIntegration = (props) => {
  const [courseId, setCourseId] = useState(props?.location?.state?.courseId);
  const [lessonId, setLessonId] = useState(props?.location?.state?.lessonId);
  const [textBox, setTextBox] = useState(false);
  const [radioButton, setRadioButton] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [fileUpload, setFileUpload] = useState(false);
  const [questionList, setQuestionList] = useState(false);
  const [questionListLength, setQuestionListLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonData, setLessonData] = useState([]);

  useEffect(() => {
    questionLists();
    lessonDetails();
  }, []);

  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      props.history.push("/kharpi");
      window.location.reload();
    }, 2000);
  };

  const questionLists = () => {
    const userId = localStorage.getItem("userId");
    Api.get("api/v1/lessonQuiz/list", {
      params: {
        courseLessonId: lessonId,
        userId: userId,
      },
    })
      .then((res) => {
        const data = res.data.quizData;
        const questionListLength = data.length;
        setQuestionListLength(questionListLength);
        setIsLoading(false);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const lessonDetails = () => {
    const userId = localStorage.getItem("userId");
    Api.get(`api/v1/courseLesson/get/one/${lessonId}`, { headers: { userId: userId } })
      .then((res) => {
        const lessonData = res.data.lessonList;
        setLessonData(lessonData);
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
    <div className="mx-3 mt-1">
      <CourseSideMenu lessonId={lessonId} courseId={courseId} />
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="main">
            <Row className="mx-3 mt-3 d-flex justify-content-start align-items-center">
              <Col xs={12} sm={12} md={12} lg={6} className="mt-1">
                <div className="d-flex lesson-name">
                  <p className="mb-0 pl-3 fw-bold">
                    {lessonData?.courseId?.category?.name} - {lessonData?.courseId?.name} -{lessonData.lessonName}
                  </p>
                </div>
              </Col>
            </Row>
            <Row className="pb-2 d-flex justify-content-center align-items-center">
              <Col xs={12} sm={12} md={12} lg={6} className="mt-1">
                <img src={QuizImage} alt="Snow" width={"18%"} height={80} />
                <h6 style={{ color: "#1c1364" }}>Create Questions For Quiz</h6>
              </Col>
              <Col xs={12} sm={12} md={12} lg={6}></Col>
            </Row>
            <Row className="mt-2">
              <Col xs={12} sm={12} md={2} className="question-type">
                <p
                  className="px-4 textbox-style text-center"
                  onClick={() => {
                    setTextBox(true);
                    setCheckBox(false);
                    setRadioButton(false);
                    setFileUpload(false);
                    setQuestionList(false);
                  }}
                >
                  Text Input
                </p>
              </Col>
              <Col xs={12} sm={12} md={2} className="question-type">
                <p
                  className="px-4 textbox-style"
                  onClick={() => {
                    setCheckBox(false);
                    setTextBox(false);
                    setFileUpload(false);
                    setQuestionList(false);
                    setRadioButton(true);
                  }}
                >
                  Options
                </p>
              </Col>
              <Col xs={12} sm={12} md={2} className="question-type">
                <p
                  className="px-4 textbox-style"
                  onClick={() => {
                    setRadioButton(false);
                    setTextBox(false);
                    setFileUpload(false);
                    setQuestionList(false);
                    setCheckBox(true);
                  }}
                >
                  Multiple Choice
                </p>
              </Col>
              <Col xs={12} sm={12} md={2} className="question-type">
                <p
                  className="px-4 textbox-style"
                  onClick={() => {
                    setCheckBox(false);
                    setTextBox(false);
                    setRadioButton(false);
                    setQuestionList(false);
                    setFileUpload(true);
                  }}
                >
                  File Upload
                </p>
              </Col>
              <Col xs={12} sm={12} md={4} className="question-list">
                <p
                  className="px-4 textbox-style"
                  onClick={() => {
                    setCheckBox(false);
                    setTextBox(false);
                    setRadioButton(false);
                    setFileUpload(false);
                    setQuestionList(true);
                  }}
                >
                  Created Questions
                </p>
              </Col>
            </Row>
            <hr className="end-line" />
            {questionListLength > 0 ? (
              <div>
                {textBox ? (
                  <TextBox courseId={courseId} lessonId={lessonId} />
                ) : radioButton ? (
                  <RadioButton courseId={courseId} lessonId={lessonId} />
                ) : checkBox ? (
                  <CheckBox courseId={courseId} lessonId={lessonId} />
                ) : fileUpload ? (
                  <FileUpload courseId={courseId} lessonId={lessonId} />
                ) : questionList ? (
                  <div className="justify-content-center mt-1">
                    <QuestionsList courseId={courseId} lessonId={lessonId} />
                  </div>
                ) : (
                  <div className="justify-content-center mt-1">
                    <QuestionsList courseId={courseId} lessonId={lessonId} />
                  </div>
                )}
              </div>
            ) : (
              <div>
                {textBox ? (
                  <TextBox courseId={courseId} lessonId={lessonId} />
                ) : radioButton ? (
                  <RadioButton courseId={courseId} lessonId={lessonId} />
                ) : checkBox ? (
                  <CheckBox courseId={courseId} lessonId={lessonId} />
                ) : fileUpload ? (
                  <FileUpload courseId={courseId} lessonId={lessonId} />
                ) : questionList ? (
                  <div className="justify-content-center mt-1">
                    <QuestionsList courseId={courseId} lessonId={lessonId} />
                  </div>
                ) : (
                  <div className="d-flex justify-content-center mt-5">
                    <h6>Please Select Question Type For Creating Questions !!!...</h6>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizIntegration;
