import React, { Component } from "react";
import "survey-react/survey.css";
import * as Survey from "survey-react";

export default class AdminHomework extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lessonId: this.props?.location?.state?.lessonId,
      //   Answer
      answer: {
        "10+10": "20",
        "5-2": "item1",
        question1: ["item1"],
        question2: "left",
      },

      //   Question
      json: {
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
      },
    };
    // this line of code only using complete survey
    this.onCompleteComponent = this.onCompleteComponent.bind(this);
  }

  onCompleteComponent = (data) => {
    // const dataValue = JSON.stringify(data.data);
  };

  render() {
    // question
    const survey = new Survey.Model(this.state.json);
    // answer display
    survey.data = this.state.answer;
    // display mode
    survey.mode = "display";

    return (
      <div>
        <div >
          <Survey.Survey model={survey} onComplete={(data) => this.onCompleteComponent(data)} />
        </div>
      </div>
    );
  }
}
