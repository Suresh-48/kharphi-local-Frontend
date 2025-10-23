import { Container, Form, Col, Row, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Label from "../../components/core/Label";
import Select from "react-select";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

import Api from "../../Api";
import { Typography } from "@material-ui/core";
import "../../css/Forum.scss";
import Loader from "../core/Loader";
import { toast } from "react-toastify";

const ForumSelect = ({ history }) => {
  const [category, setCategory] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [latestData, setLatestData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 2000);
  };

  const getLatestConversation = () => {
    const userId = localStorage.getItem("userId");
    Api.get("api/v1/forum/latest", { headers: { userId: userId } })
      .then((response) => {
        const data = response?.data?.forumList;
        setLatestData(data);
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

  const getCategory = () => {
    const userId = localStorage.getItem("userId");
    const studentId = localStorage.getItem("studentId");
    Api.get("/api/v1/category/", { headers: { userId: userId } })
      .then((res) => {
        const data = res.data.data.data;
        setCategory(data);
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

  const courseFilter = (categoryId) => {
    const userId = localStorage.getItem("userId");
    Api.get("/api/v1/forum/filter", {
      params: {
        categoryId: categoryId,
        userId: userId,
      },
    })
      .then((response) => {
        const data = response?.data?.getCourse;
        setCourseData(data);
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

  const convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  useEffect(() => {
    getCategory();
    getLatestConversation();
    getAllCources();
  }, []);

  const getAllCources = () => {
    const userId = localStorage.getItem("userId");
    Api.get("/api/v1/course/publish", { headers: { userId: userId } })
      .then((res) => {
        const data = res?.data?.data?.data;
        setCourseData(data);
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
        <Container className="mb-3 mt-3">
          <Row className="d-flex justify-content-center">
            <Col xs={8} sm={8} md={7} lg={6}>
              <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                <Label className="mb-1">Category :</Label>
                <Select
                  placeholder="Select Category"
                  name="category"
                  value={categoryName}
                  options={[
                    {
                      options: category?.map((list) => ({
                        value: list?.id,
                        label: list?.name,
                      })),
                    },
                  ]}
                  onChange={(e) => {
                    setCategoryName(e);
                    courseFilter(e.value);
                  }}
                  style={{ backgroundColor: "white" }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="my-3">
            <Col md={4}>
              <div className="forum-page-scrolldown mt-5">
                {courseData &&
                  courseData?.map((course, index) => (
                    <Row className="mt-3 mb-3">
                      <div
                        className="d-flex flex-direction-row "
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          history.push({
                            pathname: `/forum`,
                            state: {
                              course: course,
                            },
                          })
                        }
                      >
                        <Col xs={3} sm={3} lg={3} md={3}>
                          <img
                            className="forum-image w-100"
                            src={course?.imageUrl}
                            alt={`${course?.category?.name}`}
                          />
                        </Col>
                        <Col xs={9} sm={9} lg={9} md={9}>
                          <div className="mx-2">
                            <b>{course?.name}</b>
                            <Typography
                              dangerouslySetInnerHTML={convertFromJSONToHTML(
                                course?.description
                              )}
                              className="forum-text"
                            ></Typography>
                          </div>
                        </Col>
                      </div>
                    </Row>
                  ))}
              </div>
            </Col>
            <Col md={8}>
              <h4 className="text-center mt-1">Recent Conversation</h4>
              <Card>
                <div className="forum-scrolldown-bottom">
                  <div className="forum-page-content mb-2">
                    <h5 className="forum-new-message">What's New !</h5>
                  </div>
                  {latestData &&
                    latestData?.map((list, index) => (
                      <div
                        onClick={() => {
                          history.push({
                            pathname: "/forum/conversation",
                            state: { commentsData: list },
                          });
                        }}
                        className="recent-conver-cursor mx-2 my-2 pt-3 "
                      >
                        <div className="forum-column mx-3">
                          <b>{list?.courseId?.aliasName}</b>
                          <samp style={{ color: "#9e9e9e" }}>
                            {list?.createdAt}
                          </samp>
                        </div>
                        <Typography
                          dangerouslySetInnerHTML={convertFromJSONToHTML(
                            list.question
                          )}
                          className="forum-page-text  mt-1 "
                        ></Typography>
                      </div>
                    ))}
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default ForumSelect;
