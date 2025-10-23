import React, { Component, useEffect, useState } from "react";
import * as SurveyJSCreator from "survey-creator";
import "survey-creator/survey-creator.css";
import Api from "../../Api";
import "../../css/createQuiz.scss";
import { toast } from "react-toastify";

// Component
import Loader from "../core/Loader";

const EditQuiz = (props) => {
  const [courseId, setCourseId] = useState(props?.location?.state?.courseId);
  const [lessonId, setLessonId] = useState(props?.location?.state?.lessonId);
  const [json, setJson] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    createQuestion();
  }, []);

  const createQuestion = (question) => {
    const userId = localStorage.getItem("userId");
    Api.get("/api/v1/quiz/getLesson/", {
      params: {
        courseLessonId: lessonId,
        userId: userId,
      },
    })
      .then((response) => {
        setIsLoading(false);
        const question = response.data.lessonData.questions;
        const creatorOptions = {
          questionTypes: ["text", "checkbox", "radiogroup", "file", "boolean"],
        };
        const surveyCreator = new SurveyJSCreator.SurveyCreator(
          null,
          creatorOptions
        );
        surveyCreator.showState = true;
        surveyCreator.JSON = question;
        surveyCreator.showTestSurveyTab = false;
        surveyCreator.showJSONEditorTab = false;
        surveyCreator.saveSurveyFunc = saveMySurvey;
        if (json !== undefined) {
          surveyCreator.json = json;
        }
        surveyCreator.render("surveyCreatorContainer");
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      props.history.push("/kharpi");
      window.location.reload();
    }, 2000);
  };

  const saveMySurvey = (saveNo, callback) => {
    const userId = localStorage.getItem("userId");
    setIsSubmit(true);
    setJson(surveyCreator.JSON);
    Api.patch("/api/v1/quiz/lesson/update", {
      courseId: courseId,
      courseLessonId: lessonId,
      questions: json,
      userId: userId,
    })
      .then((response) => {
        if (response.status === 201) {
          toast.success("Quiz Updated!.");
          setIsSubmit(false);
          createQuestion();
        } else {
          toast.error(response.data.message);
          setIsSubmit(false);
          createQuestion();
        }
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
        }
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
    callback(saveNo, true);
  };

  return (
    <div className="pt-4">
      {isLoading ? <Loader /> : <div id="surveyCreatorContainer" />}
    </div>
  );
};

export default EditQuiz;
