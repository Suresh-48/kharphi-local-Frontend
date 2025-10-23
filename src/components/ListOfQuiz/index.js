import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Row, Col } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import moment from "moment";
import { Tab, Tabs } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import "../../css/TeacherList.scss";

// Api
import Api from "../../Api";

// Component
import { tableIcons } from "../core/TableIcons";
import Loader from "../../components/core/Loader";
import CourseDetail from "../Courses/CourseDetail";
import { toast } from "react-toastify";

function ListOfQuiz() {
  const [value, setValue] = useState(0);
  const [pendingData, setPendingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const history = useHistory();
  const userId = localStorage.getItem("userId");

  const tableTheme = createTheme({
    overrides: {
      MuiTableRow: {
        root: {
          "&:hover": {
            cursor: "pointer",
            backgroundColor: "rgba(224, 224, 224, 1) !important",
          },
        },
      },
    },
  });

  const getPendingData = () => {
    const studentId = localStorage.getItem("studentId");
    Api.get("api/v1/quizSchedule/student/quiz/pending", {
      params: {
        studentId: studentId,
        userId: userId,
      },
    })
      .then((response) => {
        const pendingData = response?.data?.pendingReviewList;
        pendingData?.sort(function compare(a, b) {
          var dateA = new Date(a?.scheduleLesson?.lessonDate);
          var dateB = new Date(b?.scheduleLesson?.lessonDate);
          return dateA - dateB;
        });
        pendingData?.forEach(function (list) {
          const time = moment(list?.scheduleLesson?.lessonDate, "ll").format(
            "L"
          );

          if (list.scheduleLesson != null) {
            list.scheduleLesson["compareDate"] = time;
          }
        });
        setPendingData(pendingData);
        setIsloading(false);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });

    // Log out
    const logout = () => {
      setTimeout(() => {
        localStorage.clear(history.push("/kharpi"));
        window.location.reload();
      }, 2000);
    };
  };

  const getCompletedData = () => {
    const studentId = localStorage.getItem("studentId");
    Api.get("api/v1/quizSchedule/student/quiz/completed", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const completedData = response.data.pendingReviewList;
      completedData.sort(function compare(a, b) {
        var dateA = new Date(a?.scheduleLesson?.lessonDate);
        var dateB = new Date(b?.scheduleLesson?.lessonDate);
        return dateA - dateB;
      });
      setCompletedData(completedData);
      setIsloading(false);
    });
  };

  const getPreviewData = () => {
    const studentId = localStorage.getItem("studentId");
    Api.get("api/v1/quizSchedule/student/quiz/review", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const previewData = response.data.pendingReviewList;
      previewData.sort(function compare(a, b) {
        var dateA = new Date(a?.scheduleLesson?.lessonDate);
        var dateB = new Date(b?.scheduleLesson?.lessonDate);
        return dateA - dateB;
      });
      setPreviewData(previewData);
      setIsloading(false);
    });
  };

  useEffect(() => {
    const currentDate = moment().tz("America/Chicago").format();
    const date = moment(currentDate).tz("America/Chicago").format("L");
    var time = moment(currentDate).tz("America/Chicago").format("HH:mm");
    getPreviewData();
    getCompletedData();
    getPendingData();
    setCurrentDate(date);
    setCurrentTime(time);
  }, []);

  // Column Heading
  const columns = [
    {
      title: "S.No",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Day",
      field: "courseScheduleId.weeklyOn",
    },
    {
      title: "Date",
      field: "scheduleLesson.lessonDate",
    },
    {
      title: "Course Name",
      field: "courseId.name",
      render: (rowData) => (
        <Link
          className="linkColor"
          to={{
            pathname: `/course/detail/${rowData.courseId?.aliasName}`,
            state: { courseId: rowData.id },
          }}
        >
          {rowData.courseId.name}
        </Link>
      ),
    },
    {
      title: "Lesson Name",
      field: "courseLessonId.lessonName",
    },
    {
      title: "Status",
      field: "quizStatus",
    },
  ];

  return (
    <div className="mb-3">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Tabs
            style={{ width: "100%" }}
            value={value}
            indicatorColor="primary"
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab
              style={{ width: "33%", marginTop: "15px" }}
              label={
                <Row>
                  <Col>
                    <p className="tab-title">PENDING</p>
                  </Col>
                  <Col className="tab-count-style">
                    <p className="tab-count">{pendingData?.length}</p>
                  </Col>
                </Row>
              }
              value={0}
            />
            <Tab
              style={{ width: "34%", marginTop: "15px" }}
              label={
                <Row>
                  <Col>
                    <p className="tab-title">COMPLETED</p>
                  </Col>
                  <Col className="tab-count-style">
                    <p className="tab-count">{completedData?.length}</p>
                  </Col>
                </Row>
              }
              value={1}
            />
            <Tab
              style={{ width: "33%", marginTop: "15px" }}
              label={
                <Row>
                  <Col>
                    <p className="tab-title">RESULTS</p>
                  </Col>
                  <Col className="tab-count-style">
                    <p className="tab-count">{previewData?.length}</p>
                  </Col>
                </Row>
              }
            />
            value={2}
          </Tabs>
          <hr />
          {value === 0 ? (
            <div className="mx-3 mb-3">
              <div>
                <h5 className="py-3">Pending Quiz</h5>
              </div>
              <div className="material-table-responsive">
                <ThemeProvider theme={tableTheme}>
                  <MaterialTable
                    icons={tableIcons}
                    data={pendingData}
                    options={{
                      actionsColumnIndex: -1,
                      addRowPosition: "last",
                      headerStyle: {
                        fontWeight: "bold",
                        backgroundColor: "#1d1464",
                        color: "#fff",
                        zIndex: 0,
                      },
                      showTitle: false,
                    }}
                    columns={columns}
                    localization={{
                      body: {
                        emptyDataSourceMessage: "No Quiz to Display",
                      },
                      header: {
                        actions: "Quiz",
                      },
                    }}
                    actions={[
                      (rowData) => ({
                        icon: () => (
                          <p
                            className={`${
                              rowData?.scheduleLesson?.compareDate <
                                currentDate ||
                              (rowData?.scheduleLesson?.compareDate ===
                                currentDate &&
                                rowData?.scheduleLesson?.lessonEndTime <
                                  currentTime)
                                ? "zoom-view-style"
                                : "zoom-view-disable-style"
                            }`}
                          >
                            {rowData?.reviewStatus === "Open"
                              ? "Take Your Test"
                              : null}
                          </p>
                        ),
                        tooltip: "Test",
                        onClick: (event, rowData) => {
                          if (
                            rowData?.scheduleLesson?.compareDate <
                              currentDate ||
                            (rowData?.scheduleLesson?.compareDate ===
                              currentDate &&
                              rowData?.scheduleLesson?.lessonEndTime <
                                currentTime)
                          ) {
                            history.push("/quiz", rowData);
                          }
                        },
                      }),
                    ]}
                  />
                </ThemeProvider>
              </div>
            </div>
          ) : (
            <div>
              {value === 1 ? (
                <div className="mx-3 mb-3">
                  <div>
                    <h5 className=" py-3">Completed Quiz</h5>
                  </div>
                  <div className="material-table-responsive">
                    <ThemeProvider theme={tableTheme}>
                      <MaterialTable
                        icons={tableIcons}
                        data={completedData}
                        options={{
                          actionsColumnIndex: -1,
                          addRowPosition: "last",
                          headerStyle: {
                            fontWeight: "bold",
                            backgroundColor: "#1d1464",
                            color: "#fff",
                            zIndex: 0,
                          },
                          showTitle: false,
                        }}
                        columns={columns}
                        localization={{
                          body: {
                            emptyDataSourceMessage: "No Quiz to Display",
                          },
                          header: {
                            actions: "Quiz",
                          },
                        }}
                        actions={[
                          (rowData) => ({
                            icon: () => (
                              <p className={"zoom-view-style"}>
                                {rowData.reviewStatus === "OnReview"
                                  ? "Preview Your Test"
                                  : null}
                              </p>
                            ),
                            tooltip: "Preview",
                            onClick: (event, rowData) => {
                              history.push("/quiz/preview", rowData);
                            },
                          }),
                        ]}
                      />
                    </ThemeProvider>
                  </div>
                </div>
              ) : (
                <div className="mx-3 mb-3">
                  <div>
                    <h5 className=" py-3">Reviewed Quiz</h5>
                  </div>
                  <div className="material-table-responsive">
                    <ThemeProvider theme={tableTheme}>
                      <MaterialTable
                        icons={tableIcons}
                        data={previewData}
                        options={{
                          actionsColumnIndex: -1,
                          addRowPosition: "last",
                          headerStyle: {
                            fontWeight: "bold",
                            backgroundColor: "#1d1464",
                            color: "#fff",
                            zIndex: 0,
                          },
                          showTitle: false,
                        }}
                        columns={columns}
                        localization={{
                          body: {
                            emptyDataSourceMessage: "No Quiz to Display",
                          },
                          header: {
                            actions: "Quiz",
                          },
                        }}
                        actions={[
                          (rowData) => ({
                            icon: () => (
                              <p className={"zoom-view-style"}>
                                {rowData.reviewStatus === "ReviewCompleted"
                                  ? "View Result"
                                  : null}
                              </p>
                            ),
                            tooltip: "View Result",
                            onClick: (event, rowData) => {
                              history.push("/quiz/preview", rowData);
                            },
                          }),
                        ]}
                      />
                    </ThemeProvider>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ListOfQuiz;
