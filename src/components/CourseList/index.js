import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Collapse,
  Button,
  Modal,
} from "react-bootstrap";
import { Tab, Tabs } from "@material-ui/core";
import ReactPaginate from "react-paginate";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { toast } from "react-toastify";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import Loader from "../core/Loader";
import Api from "../../Api";
import "../../css/CourseList.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      light: "#717174",
      main: "#717174",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

const CourseList = (props) => {
  const [publish, setPublish] = useState([]);
  const [draft, setDraft] = useState([]);
  const [archive, setArchive] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [cardId, setCardId] = useState("");
  const [publishCurrentPage, setPublishCurrentPage] = useState(1);
  const [draftCurrentPage, setDraftCurrentPage] = useState(1);
  const [archiveCurrentPage, setArchiveCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [lessonShow, setLessonShow] = useState(false);
  const [lessonLength, setLessonLength] = useState("");
  const [lessonQuizLength, setLessonQuizLength] = useState("");
  const [lessonHomeworkLength, setLessonHomeworkLength] = useState("");
  const [courseScheduleLength, setCourseScheduleLength] = useState("");
  const [schedule, setSchedule] = useState(false);
  const history = useHistory();

  const handlePublishPageClick = (data) => {
    let selected = data.selected + 1;
    setPublishCurrentPage(selected);
  };

  const handleDraftPageClick = (data) => {
    let selected = data.selected + 1;
    setDraftCurrentPage(selected);
  };

  const convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  const getPublishCourse = () => {
    const userId = localStorage.getItem("userId");
    Api.get("api/v1/course/publish", { headers: { userId: userId } })
      .then((res) => {
        const data = res?.data?.data?.data;
        setPublish(data);
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

  const logout = () => {
    setTimeout(() => {
      localStorage.clear(props.history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    getPublishCourse();
    getDraftCourse();
    getArchiveCourse();
  }, []);

  const getCourseQuizHomework = (id) => {
    const userId = localStorage.getItem("userId");
    Api.get("/api/v1/courseLesson/check/list", {
      params: {
        courseId: id,
        userId: userId,
      },
    })
      .then((res) => {
        const data = res?.data?.data;
        setLessonLength(data?.lessonLength);
        setLessonHomeworkLength(data?.lessonHomeWorkLength);
        setLessonQuizLength(data?.lessonQuizLength);
        setCourseScheduleLength(data?.courseScheduleLength);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const changeCourseType = (type) => {
    const userId = localStorage.getItem("userId");
    if (type === "Publish") {
      if (lessonLength > 0) {
        if (lessonLength === lessonHomeworkLength && lessonQuizLength) {
          if (courseScheduleLength > 0) {
            Api.patch("api/v1/course/type", {
              courseId: cardId,
              type: type,
              userId: userId,
            })
              .then((response) => {
                getPublishCourse();
                getDraftCourse();
                getArchiveCourse();
                setOpen(false);
              })
              .catch((error) => {
                if (error.response && error.response.status >= 400) {
                  let errorMessage;
                  const errorRequest = error.response.request;
                  if (errorRequest && errorRequest.response) {
                    errorMessage = JSON.parse(errorRequest.response).message;
                  }
                  setOpen(false);
                  toast.error(error.response.data.message);
                }
                const errorStatus = error?.response?.status;
                if (errorStatus === 401) {
                  logout();
                  toast.error("Session Timeout");
                }
              });
          } else {
            setLessonShow(true);
            setSchedule(true);
          }
        } else {
          setLessonShow(true);
          setShow(true);
        }
      } else {
        setLessonShow(true);
      }
    } else {
      Api.patch("api/v1/course/type", {
        courseId: cardId,
        type: type,
        userId: userId,
      })
        .then((response) => {
          getPublishCourse();
          getDraftCourse();
          getArchiveCourse();
          setOpen(false);
        })
        .catch((error) => {
          if (error.response && error.response.status >= 400) {
            let errorMessage;
            const errorRequest = error.response.request;
            if (errorRequest && errorRequest.response) {
              errorMessage = JSON.parse(errorRequest.response).message;
            }
            setOpen(false);
            toast.error(error.response.data.message);
          }
          const errorStatus = error?.response?.status;
          if (errorStatus === 401) {
            logout();
            toast.error("Session Timeout");
          }
        });
    }
  };

  const getDraftCourse = () => {
    const userId = localStorage.getItem("userId");
    Api.get("api/v1/course/Draft", { headers: { userId: userId } })
      .then((res) => {
        const data = res.data.data.data;
        setDraft(data);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const getArchiveCourse = () => {
    const userId = localStorage.getItem("userId");
    Api.get("api/v1/course/archive", { headers: { userId: userId } })
      .then((res) => {
        const data = res.data.data.data;
        setArchive(data);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  // Get publish current posts
  const publishLastpage = publishCurrentPage * postsPerPage;
  const publishFirstPage = publishLastpage - postsPerPage;
  const publishCourses = publish.slice(publishFirstPage, publishLastpage);
  const publishPageNumbers = [];

  for (let i = 1; i <= Math.ceil(publish.length / postsPerPage); i++) {
    publishPageNumbers.push(i);
  }

  // Get publish current posts
  const draftLastpage = draftCurrentPage * postsPerPage;
  const draftFirstPage = draftLastpage - postsPerPage;
  const draftCourses = draft.slice(draftFirstPage, draftLastpage);
  const draftPageNumbers = [];
  for (let i = 1; i <= Math.ceil(draft.length / postsPerPage); i++) {
    draftPageNumbers.push(i);
  }

  // Get archive current posts
  const archiveLastPage = archiveCurrentPage * postsPerPage;
  const archiveFirstPage = archiveLastPage - postsPerPage;
  const archiveCourses = archive.slice(archiveFirstPage, archiveLastPage);
  const archivePageNumbers = [];
  for (let i = 1; i <= Math.ceil(archive.length / postsPerPage); i++) {
    archivePageNumbers.push(i);
  }

  return (
    <ThemeProvider theme={theme}>
      <Container className="pt-3 mb-3">
        {isLoading === true ? (
          <Loader />
        ) : (
          <div>
            <div className="create-course-button">
              <h3 className="course-title">Courses</h3>
              <div className="mt-2">
                <Button
                  className="create-button-style py-1 Kharpi-save-btn"
                  variant="primary"
                  onClick={() => history.push("/course/add")}
                >
                  <FontAwesomeIcon icon={faPlus} size="lg" className="mx-1" />{" "}
                  Create Course
                </Button>
              </div>
            </div>

            <div>
              <Tabs
                value={value}
                indicatorColor="primary"
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab
                  label={
                    <Row>
                      <Col>
                        <p className="tab-title">Published </p>
                      </Col>
                      <Col className="tab-count-style">
                        <p className="tab-count">{publish?.length}</p>
                      </Col>
                    </Row>
                  }
                  style={{ width: "33.3%" }}
                  value={0}
                />

                <Tab
                  label={
                    <Row>
                      <Col>
                        <p className="tab-title">Drafted </p>
                      </Col>
                      <Col className="tab-count-style">
                        <p className="tab-count">{draft?.length}</p>
                      </Col>
                    </Row>
                  }
                  style={{ width: "33.3%" }}
                  value={1}
                />
                <Tab
                  label={
                    <Row>
                      <Col>
                        <p className="tab-title">Archive</p>
                      </Col>
                      <Col className="tab-count-style">
                        <p className="tab-count">{archive?.length}</p>
                      </Col>
                    </Row>
                  }
                  style={{ width: "33.3%" }}
                  value={2}
                />
              </Tabs>
              <hr />
              {value === 0 ? (
                <div>
                  {publish?.length !== 0 ? (
                    <Row className="mt-3">
                      {publishCourses.map((course, key) => (
                        <Col
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          style={{ marginTop: 10 }}
                        >
                          <Card className="card-height-style">
                            <div className="image-content">
                              {course?.imageUrl === undefined ||
                              course?.imageUrl === null ? (
                                <img
                                  className="image-heigh"
                                  src="https://static.wikia.nocookie.net/just-because/images/0/0c/NoImage_Available.png/revision/latest?cb=20170601005615"
                                  alt="Snow"
                                  width={"100%"}
                                  height={"100%"}
                                />
                              ) : (
                                <img
                                  className="image-heigh"
                                  src={course?.imageUrl}
                                  alt="Snow"
                                  width={"100%"}
                                  height={"100%"}
                                />
                              )}
                              <div className="top-right">
                                <FontAwesomeIcon
                                  icon={faEllipsisV}
                                  size="lg"
                                  color={"white"}
                                  onClick={() => {
                                    setOpen(!open);
                                    setCardId(course.id);
                                  }}
                                  className="font-awesome-point"
                                />
                                {cardId === course.id ? (
                                  <Collapse
                                    in={open}
                                    className="collapse-show-text-width"
                                  >
                                    <div className="collapse-style">
                                      <Link
                                        to={{
                                          pathname: `/course/detail/${course?.aliasName}`,
                                          state: { courseId: course?.id },
                                        }}
                                        className="navigate-edit-text-link"
                                      >
                                        View
                                      </Link>
                                      <hr />
                                      <Link
                                        to={{
                                          pathname: `/course/edit/${course?.id}`,
                                          state: {
                                            courseId: course?.id,
                                            aliasName: course?.aliasName,
                                          },
                                        }}
                                        className="navigate-edit-text-link"
                                      >
                                        Edit
                                      </Link>
                                      <hr />
                                      <Link
                                        to="#"
                                        className="navigate-edit-text-link"
                                        onClick={() =>
                                          changeCourseType("Archive")
                                        }
                                      >
                                        Archive
                                      </Link>
                                      <hr />
                                      <Link
                                        to="#"
                                        className="navigate-edit-text-link"
                                        onClick={() =>
                                          changeCourseType("Draft")
                                        }
                                      >
                                        Draft
                                      </Link>
                                    </div>
                                  </Collapse>
                                ) : null}
                              </div>
                            </div>
                            <Card.Body className="card-body-alignments">
                              <Card.Title className="truncate-text">
                                {course?.name}
                              </Card.Title>
                              <Card.Text>
                                <p
                                  className="ellipsis-text"
                                  dangerouslySetInnerHTML={convertFromJSONToHTML(
                                    course?.description
                                  )}
                                ></p>
                              </Card.Text>
                            </Card.Body>
                            {course?.discountAmount ? (
                              <Card.Footer>
                                <div className="row card-footer-header">
                                  <Col xs={12} sm={12} md={5}>
                                    <div className="footer-price-style ">
                                      <p className="discount-amount-text ">
                                        ${course?.discountAmount}
                                      </p>
                                      <p className="actual-amount-text mt-3 ">
                                        ${course?.actualAmount}
                                      </p>
                                    </div>
                                  </Col>
                                </div>
                              </Card.Footer>
                            ) : (
                              <Card.Footer>
                                <div className="row card-footer-header">
                                  <Col xs={12} sm={12} md={5}>
                                    <div className="footer-price-style ">
                                      <p className="discount-amount-text ">
                                        $ 0
                                      </p>
                                      <p className="actual-amount-text mt-3 ">
                                        $ 0
                                      </p>
                                    </div>
                                  </Col>
                                </div>
                              </Card.Footer>
                            )}
                          </Card>
                        </Col>
                      ))}
                      {publish?.length > 0 ? (
                        <div className="pagination-width">
                          <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={publishPageNumbers?.length}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePublishPageClick}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                          />
                        </div>
                      ) : null}
                    </Row>
                  ) : (
                    <div>
                      <p className="no-record-position-style">
                        No Record Found
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {value === 1 ? (
                    <div>
                      {draft?.length !== 0 ? (
                        <Row className="card-row mt-3">
                          {draftCourses.map((course, key) => (
                            <Col
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              style={{ marginTop: 10 }}
                            >
                              <Card className="card-height-style">
                                <div className="image-content">
                                  {course?.imageUrl === undefined ||
                                  course?.imageUrl === null ? (
                                    <img
                                      className="image-heigh"
                                      src="https://static.wikia.nocookie.net/just-because/images/0/0c/NoImage_Available.png/revision/latest?cb=20170601005615"
                                      alt="Snow"
                                      width={"100%"}
                                      height={"100%"}
                                    />
                                  ) : (
                                    <img
                                      className="image-heigh"
                                      src={course?.imageUrl}
                                      alt="Snow"
                                      width={"100%"}
                                      height={"100%"}
                                    />
                                  )}
                                  <div className="top-right">
                                    <FontAwesomeIcon
                                      icon={faEllipsisV}
                                      size="lg"
                                      color={"white"}
                                      onClick={() => {
                                        setOpen(!open);
                                        setCardId(course.id);
                                        getCourseQuizHomework(course?.id);
                                      }}
                                      className="font-awesome-point"
                                    />
                                    {cardId === course.id ? (
                                      <Collapse
                                        in={open}
                                        className="collapse-show-text-width"
                                      >
                                        <div className="collapse-style">
                                          <Link
                                            to={{
                                              pathname: `/course/detail/${course?.aliasName}`,
                                              state: { courseId: course?.id },
                                            }}
                                            className="navigate-edit-text-link"
                                            onClick={() =>
                                              localStorage.setItem(
                                                "checkoutCourseId",
                                                course?.id
                                              )
                                            }
                                          >
                                            View
                                          </Link>
                                          <hr />
                                          <Link
                                            className="navigate-edit-text-link"
                                            to={{
                                              pathname: `/course/edit/${course?.id}`,
                                              state: {
                                                courseId: course?.id,
                                                aliasName: course?.aliasName,
                                              },
                                            }}
                                          >
                                            Edit
                                          </Link>
                                          <hr />
                                          <Link
                                            to="#"
                                            className="navigate-edit-text-link"
                                            onClick={() =>
                                              changeCourseType("Archive")
                                            }
                                          >
                                            Archive
                                          </Link>
                                          <hr />
                                          <Link
                                            to="#"
                                            className="navigate-edit-text-link"
                                            onClick={() =>
                                              changeCourseType("Publish")
                                            }
                                          >
                                            Publish
                                          </Link>
                                        </div>
                                      </Collapse>
                                    ) : null}
                                  </div>
                                </div>
                                <Card.Body>
                                  <Card.Title className="course-name">
                                    {course?.name}
                                  </Card.Title>
                                  <Card.Text>
                                    <p
                                      className="ellipsis-text"
                                      dangerouslySetInnerHTML={convertFromJSONToHTML(
                                        course?.description
                                      )}
                                    ></p>
                                  </Card.Text>
                                </Card.Body>
                                {course?.discountAmount ? (
                                  <Card.Footer>
                                    <Row className="card-footer-header">
                                      <Col
                                        className="d-flex justify-content-center"
                                        xs={12}
                                        md={12}
                                        lg={6}
                                        sm={12}
                                      >
                                        <div className="footer-price-style ">
                                          <p className="discount-amount-text ">
                                            ${course?.discountAmount}
                                          </p>
                                          <p className="actual-amount-text mt-2">
                                            ${course?.actualAmount}
                                          </p>
                                        </div>
                                      </Col>
                                    </Row>
                                  </Card.Footer>
                                ) : (
                                  <Card.Footer>
                                    <Row className="card-footer-header">
                                      <Col
                                        className="d-flex justify-content-center"
                                        xs={12}
                                        md={12}
                                        lg={6}
                                        sm={12}
                                      >
                                        <div className="footer-price-style ">
                                          <p className="discount-amount-text ">
                                            $ 0
                                          </p>
                                          <p className="actual-amount-text mt-2">
                                            $ 0
                                          </p>
                                        </div>
                                      </Col>
                                    </Row>
                                  </Card.Footer>
                                )}
                              </Card>
                            </Col>
                          ))}
                          {draft?.length > 0 ? (
                            <div className="pagination-width">
                              <ReactPaginate
                                previousLabel={"previous"}
                                nextLabel={"next"}
                                breakLabel={"..."}
                                breakClassName={"break-me"}
                                pageCount={draftPageNumbers?.length}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                onPageChange={handleDraftPageClick}
                                containerClassName={"pagination"}
                                activeClassName={"active"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                              />
                            </div>
                          ) : null}
                        </Row>
                      ) : (
                        <div>
                          <p className="no-record-position-style">
                            No Record Found
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {archive?.length !== 0 ? (
                        <Row className="card-row mt-3">
                          {archiveCourses.map((course, key) => (
                            <Col
                              xs={12}
                              sm={6}
                              md={6}
                              lg={4}
                              style={{ marginTop: 10 }}
                            >
                              <Card className="card-height-style">
                                <div className="image-content">
                                  {course?.imageUrl === undefined ||
                                  course?.imageUrl === null ? (
                                    <img
                                      className="image-heigh"
                                      src="https://static.wikia.nocookie.net/just-because/images/0/0c/NoImage_Available.png/revision/latest?cb=20170601005615"
                                      alt="Snow"
                                      width={"100%"}
                                      height={"100%"}
                                    />
                                  ) : (
                                    <img
                                      className="image-heigh"
                                      src={course?.imageUrl}
                                      alt="Snow"
                                      width={"100%"}
                                      height={"100%"}
                                    />
                                  )}
                                  <div className="top-right">
                                    <FontAwesomeIcon
                                      icon={faEllipsisV}
                                      size="lg"
                                      color={"white"}
                                      onClick={() => {
                                        setOpen(!open);
                                        setCardId(course?.id);
                                        getCourseQuizHomework(course?.id);
                                      }}
                                      className="font-awesome-point"
                                    />
                                    {cardId === course?.id ? (
                                      <Collapse
                                        in={open}
                                        className="collapse-show-text-width"
                                      >
                                        <div className="collapse-style">
                                          <Link
                                            to={{
                                              pathname: `/course/detail/${course?.aliasName}`,
                                              state: { courseId: course?.id },
                                            }}
                                            className="navigate-edit-text-link"
                                            onClick={() =>
                                              localStorage.setItem(
                                                "checkoutCourseId",
                                                course?.id
                                              )
                                            }
                                          >
                                            View
                                          </Link>
                                          <hr />
                                          <Link
                                            to={{
                                              pathname: `/course/edit/${course?.id}`,
                                              state: {
                                                courseId: course?.id,
                                                aliasName: course?.aliasName,
                                              },
                                            }}
                                            className="navigate-edit-text-link"
                                          >
                                            Edit
                                          </Link>
                                          <hr />
                                          <Link
                                            to="#"
                                            className="navigate-edit-text-link"
                                            onClick={() =>
                                              changeCourseType("Publish")
                                            }
                                          >
                                            Publish
                                          </Link>
                                          <hr />
                                          <Link
                                            to="#"
                                            className="navigate-edit-text-link"
                                            onClick={() =>
                                              changeCourseType("Draft")
                                            }
                                          >
                                            Draft
                                          </Link>
                                        </div>
                                      </Collapse>
                                    ) : null}
                                  </div>
                                </div>
                                <Card.Body>
                                  <Card.Title className="course-name">
                                    {course?.name}
                                  </Card.Title>
                                  <Card.Text>
                                    <p
                                      className="ellipsis-text"
                                      dangerouslySetInnerHTML={convertFromJSONToHTML(
                                        course?.description
                                      )}
                                    ></p>
                                  </Card.Text>
                                </Card.Body>
                                {course?.discountAmount ? (
                                  <Card.Footer>
                                    <Row className="card-footer-header">
                                      <Col
                                        className="d-flex justify-content-center"
                                        xs={12}
                                        md={12}
                                        lg={6}
                                        sm={12}
                                      >
                                        <div className="footer-price-style ">
                                          <p className="discount-amount-text ">
                                            ${course?.discountAmount}
                                          </p>
                                          <p className="actual-amount-text mt-2">
                                            ${course?.actualAmount}
                                          </p>
                                        </div>
                                      </Col>
                                    </Row>
                                  </Card.Footer>
                                ) : (
                                  <Card.Footer>
                                    <Row className="card-footer-header">
                                      <Col
                                        className="d-flex justify-content-center"
                                        xs={12}
                                        md={12}
                                        lg={6}
                                        sm={12}
                                      >
                                        <div className="footer-price-style ">
                                          <p className="discount-amount-text ">
                                            $ 0
                                          </p>
                                          <p className="actual-amount-text mt-2">
                                            $ 0
                                          </p>
                                        </div>
                                      </Col>
                                    </Row>
                                  </Card.Footer>
                                )}
                              </Card>
                            </Col>
                          ))}
                          {archive?.length > 0 ? (
                            <div className="pagination-width">
                              <ReactPaginate
                                previousLabel={"previous"}
                                nextLabel={"next"}
                                breakLabel={"..."}
                                breakClassName={"break-me"}
                                pageCount={archivePageNumbers?.length}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                // onPageChange={handlearchivePageClick}
                                containerClassName={"pagination"}
                                activeClassName={"active"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                              />
                            </div>
                          ) : null}
                        </Row>
                      ) : (
                        <div>
                          <p className="no-record-position-style">
                            No Record Found
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Container>

      <Modal show={lessonShow} centered style={{ left: "2px" }}>
        <Row className="border-bottom-color m-0 py-3">
          <h5 className="filter-head-cls">Unable to Publish !</h5>
        </Row>
        {show === true ? (
          <p className="px-5 pt-5 pb-4">
            Quiz and Homework are missing in some lesson. Please create quiz and
            homework in the lesson, Before publishing the course.
          </p>
        ) : schedule === true ? (
          <p className="px-5 pt-5 pb-4">
            Please create schedule list before publishing the course.
          </p>
        ) : (
          <p className="px-5 pt-5 pb-4">
            Unable to find any lessons for this course. Please add a lesson to
            publish this Course.
          </p>
        )}

        <div className="d-flex justify-content-center">
          <Modal.Footer>
            <Button
              className="px-4 mb-4 Kharpi-save-btn"
              onClick={() => setLessonShow(false)}
            >
              OK
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </ThemeProvider>
  );
};
export default CourseList;
