import React, { useState } from "react";
import "survey-react/survey.css";
import * as Survey from "survey-react";

const AdminQuiz = (props) => {
  const [answer, setAnswer] = useState({
    "10+10": "20",
    "5-2": "item1",
    question1: ["item1"],
    question2: "left",
  });

  const json = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "text",
            name: "10+10",
          },
          {
            type: "radiogroup",
            name: "5-2",
            choices: [
              {
                value: "item1",
                text: "3",
              },
              {
                value: "item2",
                text: "2",
              },
              {
                value: "item3",
                text: "4",
              },
            ],
          },
          {
            type: "checkbox",
            name: "question1",
            title: "How many days do we have in a week?",
            choices: [
              {
                value: "item1",
                text: "Seven",
              },
              {
                value: "item2",
                text: "Five",
              },
              {
                value: "item3",
                text: "Six",
              },
            ],
          },
          {
            type: "text",
            name: "question2",
            title: "Which way is anti-clockwise, left or right",
          },
        ],
      },
    ],
  };

  const onCompleteComponent = (data) => {
    // const dataValue = JSON.stringify(data.data);
  };

  // question
  const survey = new Survey.Model(json);
  // answer display
  survey.data = answer;
  // display mode
  survey.mode = "display";

  return (
    <div>
      <div>
        <Survey.Survey model={survey} onComplete={(data) => onCompleteComponent(data)} />
      </div>
    </div>
  );
};

export default AdminQuiz;
