import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Stack from "@mui/material/Stack";
import "../../css/Forum.scss";
import Avatar from "react-avatar";
import { stateToHTML } from "draft-js-export-html";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment-timezone";
import { Editor } from "react-draft-wysiwyg";
import { toast } from "react-toastify";
import Api from "../../Api";
import { getColorCode } from "../../utils/helper";
import Loader from "../core/Loader";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

function ForumComments(commentsData) {
  const [data, setData] = useState(commentsData.location.state.commentsData);
  const [questionData, setQuestionData] = useState([]);
  const [show, setShow] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [answerId, setAnswerId] = useState("");
  const [answer, setAnswer] = useState("");
  const [editText, setEditText] = useState("");
  const [user, setUser] = useState("");
  const [replyId, setReplyId] = useState("");
  const [colorList, setColorList] = useState([]);
  const questionCount = questionData?.length;
  const [isLoading, setIsLoading] = useState(true);

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    getComments();
  }, []);

  const getComments = () => {
    const userId = localStorage.getItem("userId");
    setUserId(userId);
    Api.get("/api/v1/forum/conversation", {
      params: {
        questionId: data.id,
        userId: userId,
      },
    })
      .then((response) => {
        const questionData = response?.data?.conversationList;
        setQuestionData(questionData);
        const colorLists = getForumColor(questionCount);
        setColorList(colorLists);
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
  const getRecentComments = () => {
    const userId = localStorage.getItem("userId");
    setUserId(userId);
    Api.get("/api/v1/forum/conversation", {
      params: {
        questionId: data.id,
        userId: userId,
      },
    })
      .then((response) => {
        const questionData = response?.data?.conversationList;
        setQuestionData(questionData);
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
  const getForumColor = () => {
    let userIds = [];
    const userData = questionData;

    userData?.forEach((list) => {
      const userId = list?.userId._id;
      if (userIds.indexOf(userId) < 0) {
        userIds.push(userId);
      }
    });

    let forumUserColors = [];
    userIds.forEach((userId) => {
      forumUserColors.push({
        userId: userId,
        color: getColorCode(),
      });
    });

    return forumUserColors;
  };

  const getUserColorCode = (colors, userId) => {
    let color = "";

    colors.forEach((userColor) => {
      if (userColor.userId === userId) {
        color = userColor.color;
      }
    });

    return color;
  };

  const deleteMessage = (values) => {
    const replyId = values;
    Api.delete("/api/v1/forum/conversation/delete/comment", {
      params: { id: replyId, userId: userId },
    })
      .then((response) => {
        toast.success("Comments Deleted Successfully");
        getComments();
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const onChangeDescription = ({ setFieldValue }, e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    setFieldValue("answerValue", editedText.blocks[0].text);
  };

  const updateData = () => {
    const userId = localStorage.getItem("userId");
    const convertedData = JSON.stringify(
      convertToRaw(editText.getCurrentContent())
    );

    let tempDate = new Date();
    let date =
      tempDate.getFullYear() +
      "-" +
      (tempDate.getMonth() + 1) +
      "-" +
      tempDate.getDate() +
      " " +
      tempDate.getHours() +
      ":" +
      tempDate.getMinutes() +
      ":" +
      tempDate.getSeconds();

    const newdate = moment(date).format("MMMM Do YYYY, h:mm:ss a");

    Api.patch("/api/v1/forum/conversation/edit", {
      question: data.id,
      answer: convertedData,
      createdAt: newdate,
      user: userId,
      answerId: answerId,
      userId: userId,
    })
      .then((response) => {
        toast.success("Comments Updated Successfully");
        setShow(false);
        getComments();
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const submitForm = (values) => {
    const userId = localStorage.getItem("userId");
    const convertedData = JSON.stringify(
      convertToRaw(answer.getCurrentContent())
    );
    let tempDate = new Date();
    let date =
      tempDate.getFullYear() +
      "-" +
      (tempDate.getMonth() + 1) +
      "-" +
      tempDate.getDate() +
      " " +
      tempDate.getHours() +
      ":" +
      tempDate.getMinutes() +
      ":" +
      tempDate.getSeconds();

    const newdate = moment(date).format("MMMM Do YYYY, h:mm:ss a");

    Api.post("/api/v1/forum/conversation", {
      question: data.id,
      user: userId,
      answer: convertedData,
      createdAt: newdate,
      course: data.course,
      userId: userId,
    })
      .then((response) => {
        const status = response.status;
        if (status === 201) {
          setAnswer("");
          getRecentComments();
        }
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };
  let history = useHistory();

  //validation
  const postSchema = Yup.object().shape({
    answerValue: Yup.string().required("Comments Is Required"),
  });

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Row>
            <Col>
              <Stack direction="row" spacing={2} className="mt-2">
                {data?.userId?.studentId ? (
                  <div>
                    {data?.userId?.studentId?.imageUrl ? (
                      <Avatar
                        src={data?.userId?.studentId?.imageUrl}
                        round={true}
                        size="55"
                        color="#1c1364"
                        style={{ minWidth: "fit-content" }}
                      />
                    ) : (
                      <Avatar
                        name={`${data?.userId?.firstName} ${data?.userId?.lastName}`}
                        size="45"
                        round={true}
                        color="#1c1364"
                      />
                    )}{" "}
                  </div>
                ) : (
                  <div>
                    {data?.userId?.parentId ? (
                      <div>
                        {data?.userId?.parentId?.imageUrl ? (
                          <div>
                            {" "}
                            <Avatar
                              src={data?.userId?.parentId?.imageUrl}
                              round={true}
                              size="55"
                              color="#1c1364"
                              style={{ minWidth: "fit-content" }}
                            />
                          </div>
                        ) : (
                          <Avatar
                            name={`${data?.userId?.firstName} ${data?.userId?.lastName}`}
                            size="45"
                            round={true}
                            color="#1c1364"
                          />
                        )}
                      </div>
                    ) : (
                      <div>
                        {data?.userId?.teacherId?.imageUrl ? (
                          <Avatar
                            src={data?.userId?.teacherId?.imageUrl}
                            round={true}
                            size="55"
                            color="#1c1364"
                            style={{ minWidth: "fit-content" }}
                          />
                        ) : (
                          <Avatar
                            name={`${data?.userId?.firstName} ${data?.userId?.lastName}`}
                            size="45"
                            round={true}
                            color="#1c1364"
                          />
                        )}
                      </div>
                    )}{" "}
                  </div>
                )}
                <div className="content-width mb-2">
                  <b>
                    {data?.userId?.firstName} {data?.userId?.lastName}{" "}
                  </b>
                  <data
                    dangerouslySetInnerHTML={convertFromJSONToHTML(
                      `${data.question}`
                    )}
                  ></data>
                  <data className="forum-created-at">{data.createdAt}</data>
                </div>
              </Stack>
              <hr className="forum-padding" />
              {questionData?.length > 0 ? (
                questionData?.map((list, i) => (
                  <Stack
                    direction="row"
                    spacing={2}
                    className="forum-text-comments"
                  >
                    {list?.userId?.role === "student" ? (
                      list?.userId?.studentId?.imageUrl ? (
                        <Avatar
                          src={list?.userId?.studentId?.imageUrl}
                          size="45"
                          style={{ minWidth: "fit-content" }}
                          round={true}
                        />
                      ) : (
                        <Avatar
                          name={`${list?.userId?.firstName} ${list?.userId?.lastName}`}
                          size="45"
                          round={true}
                          color={`${getUserColorCode(
                            colorList,
                            list.userId._id
                          )}`}
                        />
                      )
                    ) : list?.userId?.role === "parent" ? (
                      list?.userId?.parentId?.imageUrl ? (
                        <Avatar
                          src={list?.userId?.parentId?.imageUrl}
                          size="45"
                          round={true}
                          style={{ minWidth: "fit-content" }}
                        />
                      ) : (
                        <Avatar
                          name={`${list?.userId?.firstName} ${list?.userId?.lastName}`}
                          size="45"
                          round={true}
                          color={`${getUserColorCode(
                            colorList,
                            list?.userId?._id
                          )}`}
                        />
                      )
                    ) : list?.userId?.teacherId?.imageUrl ? (
                      <Avatar
                        src={list?.userId?.teacherId?.imageUrl}
                        size="45"
                        round={true}
                        style={{ minWidth: "fit-content" }}
                      />
                    ) : (
                      <Avatar
                        name={`${list?.userId?.firstName} ${list?.userId?.lastName}`}
                        size="45"
                        round={true}
                        color={`${getUserColorCode(
                          colorList,
                          list?.userId?._id
                        )}`}
                      />
                    )}
                    <div style={{ width: "100%" }}>
                      <div className="d-flex align-items-center">
                        <b>
                          {list?.userId?.firstName} {list?.userId?.lastName}
                        </b>
                        {list?.userId?._id === userId ? (
                          <div className="d-flex justify-content-center mx-5">
                            <Tooltip title="Edit">
                              <IconButton>
                                <ModeEditOutlineIcon
                                  onClick={() => {
                                    const contentState = convertFromRaw(
                                      JSON.parse(list.answer)
                                    );
                                    const editorState =
                                      EditorState.createWithContent(
                                        contentState
                                      );
                                    setShow(true);
                                    setEditText(editorState);
                                    setUser(list);
                                    setAnswerId(list.id);
                                  }}
                                  color="success"
                                  style={{ fontSize: "20px" }}
                                />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton>
                                <DeleteIcon
                                  color="error"
                                  style={{ fontSize: "20px" }}
                                  onClick={() => deleteMessage(list.id)}
                                />
                              </IconButton>
                            </Tooltip>
                          </div>
                        ) : null}
                      </div>

                      <p
                        dangerouslySetInnerHTML={convertFromJSONToHTML(
                          `${list.answer}`
                        )}
                      ></p>
                      <text className="forum-page">
                        <text
                          style={{ fontSize: "small", display: "contents" }}
                        >
                          {" "}
                          {list.createdAt}
                        </text>{" "}
                      </text>
                    </div>
                  </Stack>
                ))
              ) : (
                <div className="d-flex justify-content-center">
                  <p className="mt-5 mb-3">No Comments ... !</p>
                </div>
              )}
              <Formik
                initialValues={{
                  answer: "",
                  answerValue: "",
                }}
                validationSchema={postSchema}
                onSubmit={(values) => submitForm(values)}
              >
                {(formik) => {
                  const { values, setFieldValue, handleSubmit, isValid } =
                    formik;

                  return (
                    <div>
                      <Form onSubmit={handleSubmit} className="mx-4 mt-5 ">
                        <Form.Group className="mr-2">
                          <Form.Label>
                            Comments <b className="text-danger">*</b>{" "}
                          </Form.Label>
                          <div className="teacher-description px-3 ">
                            <Editor
                              spellCheck
                              name="answerValue"
                              editorState={answer}
                              onEditorStateChange={(e) => {
                                setAnswer(e);
                                onChangeDescription({ setFieldValue }, e);
                              }}
                              toolbar={{
                                options: ["inline", "list", "textAlign"],
                              }}
                            />
                          </div>
                          <ErrorMessage
                            name="answerValue"
                            component="span"
                            className="error text-danger"
                          />
                        </Form.Group>
                        <Row className="my-4">
                          <div className="d-flex justify-content-end ">
                            <Button
                              className="me-3 px-3"
                              type="button"
                              variant="outline-secondary"
                              onClick={() => history.goBack()}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="px-4 Kharpi-save-btn"
                            >
                              Post
                            </Button>
                          </div>
                        </Row>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </Col>
            <Modal show={show} size="lg" centered onHide={() => setShow(false)}>
              <Modal.Header closeButton>
                {user?.userId?.studentId ? (
                  <div>
                    {user?.userId?.studentId?.imageUrl ? (
                      <Avatar
                        src={user?.userId?.studentId?.imageUrl}
                        round={true}
                        size="40"
                        style={{ minWidth: "fit-content" }}
                        color="#1c1364"
                      />
                    ) : (
                      <Avatar
                        name={`${user?.userId?.firstName} ${user?.userId?.lastName}`}
                        round={true}
                        size="40"
                        color="#1c1364"
                        className="mx-2"
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    {user?.userId?.parentId ? (
                      <div>
                        {user?.userId?.parentId?.imageUrl ? (
                          <Avatar
                            src={user?.userId?.parentId?.imageUrl}
                            round={true}
                            size="40"
                            style={{ minWidth: "fit-content" }}
                            color="#1c1364"
                          />
                        ) : (
                          <Avatar
                            name={`${user?.userId?.firstName} ${user?.userId?.lastName}`}
                            round={true}
                            size="40"
                            color="#1c1364"
                            className="mx-2"
                          />
                        )}
                      </div>
                    ) : (
                      <div>
                        {user?.userId?.teacherId?.imageUrl ? (
                          <Avatar
                            src={user?.userId?.teacherId?.imageUrl}
                            round={true}
                            size="40"
                            style={{ minWidth: "fit-content" }}
                            color="#1c1364"
                          />
                        ) : (
                          <Avatar
                            name={`${user?.userId?.firstName} ${user?.userId?.lastName}`}
                            round={true}
                            size="40"
                            color="#1c1364"
                            className="mx-2"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
                <strong className="mx-1 mt-1 ">
                  {" "}
                  {user?.userId?.firstName} {user?.userId?.lastName}{" "}
                </strong>
              </Modal.Header>
              <Modal.Body>
                <div className="teacher-description px-3 ">
                  <Editor
                    spellCheck
                    name="text"
                    editorState={editText}
                    onEditorStateChange={(e) => {
                      setEditText(e);
                    }}
                    toolbar={{ options: ["inline", "list", "textAlign"] }}
                  />
                </div>
              </Modal.Body>

              <div className="d-flex justify-content-end  mb-3">
                <Button
                  className="MuiButton-containedPrimary px-4 me-3"
                  type="button"
                  name="button"
                  onClick={() => updateData()}
                >
                  Save Changes
                </Button>
              </div>
            </Modal>
          </Row>
        </Container>
      )}
    </div>
  );
}
export default ForumComments;
