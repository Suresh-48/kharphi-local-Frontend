import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Form, Modal } from "react-bootstrap";
import Avatar from "react-avatar";
import Stack from "@mui/material/Stack";
import Api from "../../Api";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";
import moment from "moment-timezone";
import "../../css/Forum.scss";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import Loader from "../core/Loader";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import MessageIcon from "@mui/icons-material/Message";
import Button from "@mui/material/Button";

// Helpers
import { getColorCode } from "../../utils/helper";

const forumSchema = Yup.object().shape({
  descriptionValue: Yup.string().required("Description Is Required"),
});

const Forum = (props) => {
  const [aliasName, setAliasName] = useState(
    props?.location?.state?.course?.aliasName
  );
  const [courseId, setCourseId] = useState(props?.location?.state?.course?.id);
  const [userId, setUserId] = useState("");
  const [specialityDescription, setSpecialityDescription] = useState(
    EditorState.createEmpty()
  );
  const [forumData, setForumData] = useState([]);
  const [show, setShow] = useState(false);
  const [editText, setEditText] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [value, setValue] = useState("");
  const [colorList, setColorList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(props.history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  const handleModal = () => {
    setShow(!show);
  };

  useEffect(() => {
    getForum();
  }, []);

  const getForum = () => {
    const userId = localStorage.getItem("userId");

    setUserId(userId);
    Api.get("api/v1/forum/list", {
      params: {
        courseId: courseId,
        userId: userId,
      },
    })
      .then((response) => {
        setForumData(response?.data?.forumList);
        const forumCount = forumData?.length;
        const colorData = getForumColor(forumCount);
        setColorList(colorData);
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
    const userData = forumData;

    userData?.forEach((list) => {
      const userId = list?.userId?._id;
      if (userIds.indexOf(userId) < 0) {
        userIds?.push(userId);
      }
    });

    let forumUserColors = [];
    userIds?.forEach((userId) => {
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
      if (userColor?.userId === userId) {
        color = userColor.color;
      }
    });

    return color;
  };

  const deleteMessage = (value) => {
    const questionId = value;
    const userId = localStorage.getItem("userId");
    Api.delete("api/v1/forum/delete", {
      params: {
        id: questionId,
        userId: userId,
      },
    })
      .then((response) => {
        toast.success("Questions Deleted Successfully");
        getForum();
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

  const onChangeDescription = ({ setFieldValue }, e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    setFieldValue("descriptionValue", editedText.blocks[0].text);
  };

  const updateQuestion = (values) => {
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

    Api.patch("/api/v1/forum/edit", {
      user: userId,
      questionId: questionId,
      question: convertedData,
      createdAt: newdate,
      userId: userId,
    })
      .then((response) => {
        getForum();
        toast.success("Questions Updated Successfully");
        window.location.reload();
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  //Submit Form
  const submitForm = (values) => {
    const userId = localStorage.getItem("userId");
    const convertedData = JSON.stringify(
      convertToRaw(specialityDescription.getCurrentContent())
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

    Api.post("/api/v1/forum", {
      user: userId,
      courseId: courseId,
      question: convertedData,
      createdAt: newdate,
      userId: userId,
    })
      .then((response) => {
        const status = response.status;
        if (status === 201) {
          setSpecialityDescription("");
          toast.success(
            "Forum Created Successfully Wait Untill Amdin Approve Your Questions"
          );
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

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <div className="d-flex justify-content-center ">
            <h4 style={{ marginTop: "15px" }}>{aliasName} </h4>
          </div>
          <Row>
            <Col className="my-3  ">
              {forumData?.length > 0 ? (
                forumData?.map((list, i) => (
                  <Stack direction="row" key={i}>
                    {list?.userId?.role === "student" ? (
                      list?.userId?.studentId?.imageUrl ? (
                        <div>
                          <Avatar
                            src={list?.userId?.studentId?.imageUrl}
                            size="45"
                            style={{ minWidth: "fit-content" }}
                            round={true}
                          />
                        </div>
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
                    ) : list?.userId?.role === "parent" ? (
                      list?.userId?.parentId?.imageUrl ? (
                        <div>
                          <Avatar
                            src={list?.userId?.parentId?.imageUrl}
                            size="45"
                            style={{ minWidth: "fit-content" }}
                            round={true}
                          />
                        </div>
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
                      <div>
                        <Avatar
                          src={list?.userId?.teacherId?.imageUrl}
                          size="45"
                          style={{ minWidth: "fit-content" }}
                          round={true}
                        />
                      </div>
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
                    <div
                      style={{ width: "100%", marginTop: "5px" }}
                      className="ms-2"
                    >
                      <div className="forum-forum-forum ">
                        <strong>
                          {list?.userId?.firstName} {list?.userId?.lastName}
                        </strong>
                        {list?.replyCount > 0 ? null : (
                          <Typography className="forum-container mx-5">
                            {list?.userId?._id === userId ? (
                              <div>
                                <Tooltip title="Edit">
                                  <IconButton>
                                    <ModeEditOutlineIcon
                                      onClick={() => {
                                        const contentState = convertFromRaw(
                                          JSON.parse(list.question)
                                        );
                                        const editorState =
                                          EditorState.createWithContent(
                                            contentState
                                          );
                                        setShow(true);
                                        setEditText(editorState);
                                        setQuestionId(list?.id);
                                        setValue(list);
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
                                      onClick={(e) => {
                                        deleteMessage(list.id);
                                      }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            ) : null}
                          </Typography>
                        )}
                      </div>
                      {list?.isActive === true ? (
                        <text
                          className="forum-color-color"
                          onClick={() =>
                            props.history.push({
                              pathname: "/forum/conversation",
                              state: { commentsData: list },
                            })
                          }
                          dangerouslySetInnerHTML={convertFromJSONToHTML(
                            `${list.question}`
                          )}
                        ></text>
                      ) : (
                        <text
                          className="forum-color-text"
                          dangerouslySetInnerHTML={convertFromJSONToHTML(
                            `${list.question}`
                          )}
                        ></text>
                      )}

                      <div className=" forum-conversation-alignment mt-3 mb-3">
                        {list?.isActive === true ? (
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              className="material-table-bt-color"
                              onClick={() => {
                                props.history.push({
                                  pathname: "/forum/conversation",
                                  state: { commentsData: list },
                                });
                              }}
                              endIcon={<MessageIcon />}
                            >
                              Add Comments
                            </Button>
                          </Stack>
                        ) : null}

                        <Typography
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          <b
                            style={{ color: "blue" }}
                            className="forum-page-font me-1"
                          >
                            {list?.replyCount ? list.replyCount : 0}
                          </b>{" "}
                          <div className="forum-page-font">replies</div>
                        </Typography>

                        <div>
                          <Typography>
                            <div className="forum-page-feature">
                              {" "}
                              {list?.createdAt}
                            </div>
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </Stack>
                ))
              ) : (
                <div>
                  <p className="mt-3 mb-2">
                    Forum Conversation Yet to be Created...!
                  </p>
                </div>
              )}

              <Formik
                initialValues={{ descriptionValue: "", description: "" }}
                validationSchema={forumSchema}
                onSubmit={(values) => submitForm(values)}
              >
                {(formik) => {
                  const { handleSubmit, setFieldValue, values } = formik;
                  return (
                    <Form onSubmit={handleSubmit} className="mt-3">
                      <Form.Label>Message :</Form.Label>
                      <div className="teacher-description ">
                        <Editor
                          spellCheck
                          name="descriptionValue"
                          editorState={specialityDescription}
                          onEditorStateChange={(e) => {
                            setSpecialityDescription(e);
                            onChangeDescription({ setFieldValue }, e);
                          }}
                          toolbar={{
                            options: ["inline", "list", "textAlign"],
                          }}
                        />
                        <ErrorMessage
                          name="descriptionValue"
                          component="span"
                          className="error text-danger"
                        />
                      </div>
                      <div className="d-flex justify-content-end ">
                        <Button
                          type="submit"
                          className="mt-3 px-5 mb-4 MuiButton-containedPrimary"
                        >
                          Post
                        </Button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
              <Modal centered show={show} size="lg" onHide={handleModal}>
                <div className="forum-modal">
                  <Modal.Header closeButton>
                    <div>
                      <h5> Edit Forum</h5>
                      {value?.userId?.studentId ? (
                        <div className="d-flex flex-direction-row">
                          {value?.userId?.studentId?.imageUrl ? (
                            <Avatar
                              src={value?.userId?.studentId?.imageUrl}
                              size="45"
                              style={{ minWidth: "fit-content" }}
                              round={true}
                              color="#1c1364"
                            />
                          ) : (
                            <Avatar
                              name={`${value?.userId?.firstName} ${value?.userId?.lastName}`}
                              size="45"
                              round={true}
                              color="#1c1364"
                            />
                          )}{" "}
                          <div className="d-flex align-items-center mx-2">
                            <strong>
                              {value?.userId?.firstName}{" "}
                              {value?.userId?.lastName}
                            </strong>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {value?.userId?.parentId ? (
                            <div className="d-flex flex-direction-row">
                              {" "}
                              {value?.userId?.parentId?.imageUrl ? (
                                <div>
                                  <Avatar
                                    src={value?.userId?.parentId?.imageUrl}
                                    size="45"
                                    style={{ minWidth: "fit-content" }}
                                    round={true}
                                    color="#1c1364"
                                  />
                                </div>
                              ) : (
                                <Avatar
                                  name={`${value?.userId?.firstName} ${value?.userId?.lastName}`}
                                  size="45"
                                  round={true}
                                  color="#1c1364"
                                />
                              )}
                              <div className="d-flex align-items-center mx-2">
                                <strong>
                                  {value?.userId?.firstName}{" "}
                                  {value?.userId?.lastName}
                                </strong>
                              </div>
                            </div>
                          ) : (
                            <div className="d-flex flex-direction-row">
                              {value?.userId?.teacherId ? (
                                <div>
                                  {value?.userId?.teacherId?.imageUrl ? (
                                    <Avatar
                                      src={value?.userId?.teacherId?.imageUrl}
                                      size="45"
                                      style={{ minWidth: "fit-content" }}
                                      round={true}
                                      color="#1c1364"
                                    />
                                  ) : (
                                    <Avatar
                                      name={`${value?.userId?.firstName} ${value?.userId?.lastName}`}
                                      size="45"
                                      round={true}
                                      color="#1c1364"
                                    />
                                  )}
                                  <div className="d-flex align-items-center mx-2">
                                    <strong>
                                      {value?.userId?.firstName}{" "}
                                      {value?.userId?.lastName}
                                    </strong>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Modal.Header>
                  <div className="teacher-description px-3 ">
                    <Editor
                      spellCheck
                      name="text"
                      editorState={editText}
                      onEditorStateChange={(e) => {
                        setEditText(e);
                      }}
                      toolbar={{
                        options: ["inline", "list", "textAlign"],
                      }}
                    />
                  </div>
                  <div className=" d-flex justify-content-end mt-2 mb-4">
                    <Button
                      name="button"
                      type="button"
                      onClick={() => updateQuestion()}
                      className="MuiButton-containedPrimary px-3"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Modal>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default Forum;
