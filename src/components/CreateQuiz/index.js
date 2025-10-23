import React, { useState, useEffect } from "react";
import * as SurveyJSCreator from "survey-creator";
import "survey-creator/survey-creator.css";
import CourseSideMenu from "../CourseSideMenu";
import { toast } from "react-toastify";
import { Button } from "@material-ui/core";

// Api
import Api from "../../Api";

// Styles
import "../../css/createQuiz.scss";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const CreateQuiz = (props) => {
  const [courseId, setCourseId] = useState(props?.location?.state?.courseId);
  const [lessonId, setLessonId] = useState(props?.location?.state?.lessonId);
  const [json, setJson] = useState(undefined);
  const [isSubmit, setIsSubmit] = useState(false);
  const [quizDetail, setQuizDetail] = useState(0);
  const [surveyCreator,setSurveyCreator] = useState([]);

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      props.history.push("/kharpi");
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    lessonQuizDetail();
    const creatorOptions = {
      questionTypes: ["text", "checkbox", "radiogroup", "file", "boolean"],
    };
    const surveyCreators = new SurveyJSCreator.SurveyCreator(
      null,
      creatorOptions
    );
    setSurveyCreator(surveyCreators);
    surveyCreator.showState = true;
    surveyCreator.showTestSurveyTab = false;
    surveyCreator.showJSONEditorTab = false;
    surveyCreator.saveSurveyFunc = saveMySurvey;
    if (json !== undefined) {
      surveyCreator.json = json;
    }
    surveyCreator.render("surveyCreatorContainer");
  }, []);

  const lessonQuizDetail = () => {
    const token = localStorage.getItem("sessionId");
    Api.get("api/v1/quiz/lesson/detail", {
      params: {
        courseLessonId: lessonId,
        token: token,
      },
    })
      .then((response) => {
        const data = response.data.lessonData;
        setQuizDetail(data.length);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  useEffect(() => {
    lessonQuizDetail();
    const creatorOptions = {
      questionTypes: ["text", "checkbox", "radiogroup", "file", "boolean"],
    };
    const surveyCreator = new SurveyJSCreator.SurveyCreator(null, creatorOptions);
    surveyCreator.showState = true;
    surveyCreator.showTestSurveyTab = false;
    surveyCreator.showJSONEditorTab = false;
    surveyCreator.saveSurveyFunc = saveMySurvey;
    if (json !== undefined) {
      surveyCreator.json = json;
    }
    surveyCreator.render("surveyCreatorContainer");
  }, [lessonId, json]);

  const saveMySurvey = (saveNo, callback) => {
    const token = localStorage.getItem("sessionId");
    setIsSubmit(true);
    if (SurveyJSCreator.JSON?.pages[0]?.elements) {
      setJson(SurveyJSCreator.JSON);
      const jsonData = SurveyJSCreator.JSON;
      Api.post("api/v1/quiz/add", {
        courseId: courseId,
        courseLessonId: lessonId,
        questions: jsonData,
        token: token,
      })
        .then((response) => {
          if (response.status === 201) {
            toast.success("Questions Created Successfully!.");
            setIsSubmit(false);
            lessonQuizDetail();
          } else {
            toast.error(response.data.message);
            setIsSubmit(false);
            lessonQuizDetail();
          }
        })
        .catch((error) => {
          const errorStatus = error?.response?.status;
          if (errorStatus === 401) {
            logout();
            toast.error("Session Timeout");
          }
        });
    } else {
      toast.error("Please Create Questions Before Clicking on Save Survey");
    }
    callback(saveNo, true);
  };

  return (
    <div>
      <CourseSideMenu lessonId={lessonId} courseId={courseId} />
      <div>
        <div className="pt-1">
          <h5 className="title">Create Quiz Questions</h5>
        </div>
        {quizDetail !== 0 && (
          <div className="d-flex justify-content-end my-3">
            <Button
              className="create-button-style py-1"
              variant="contained"
              color="primary"
              onClick={() =>
                props.history.push({
                  pathname: "/quiz/edit",
                  state: {
                    lessonId: lessonId,
                    courseId: courseId,
                  },
                })
              }
            >
              Edit Quiz <FontAwesomeIcon icon={faPen} size="lg" className="ms-3" />
            </Button>
          </div>
        )}
        <div id="surveyCreatorContainer" />
      </div>
    </div>
  );
};

export default CreateQuiz;
