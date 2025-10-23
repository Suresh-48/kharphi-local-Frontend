import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { Tab, Tabs } from "@material-ui/core";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// Component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";

// Api
import Api from "../../Api";

// style
import "../../css/UpcomingSchedule.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";

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

function TeacherQuizReview(props) {
  const [teacherId, setTeacherId] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [completeData, setcompeleteData] = useState();
  const userId = localStorage.getItem("userId");

  const history = useHistory();

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Column Heading
  const columns = [
    {
      title: "S.No",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Date",
      field: "scheduleLesson.lessonDate",
    },
    {
      title: "Student Name",
      render: (rowData) =>
        `${rowData.studentId.firstName} ${rowData.studentId.lastName}`,
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
      title: "Start Time",
      field: "courseScheduleId.startTime",
    },
    {
      title: "End Time",
      field: "courseScheduleId.endTime",
    },
  ];

  useEffect(() => {
    const teacherId = localStorage.getItem("teacherId");
    setTeacherId(teacherId);
    getPendingReviewList(teacherId);
    getCompletedReviewList(teacherId);
  }, []);

  // Get pending Review list
  const getPendingReviewList = (teacher) => {
    Api.get("api/v1/quizSchedule/review/pending", {
      params: {
        teacherId: teacher,
        userId: userId,
      },
    })
      .then((response) => {
        const dataValues = response.data.pendingReviewList;
        dataValues.sort(function compare(a, b) {
          var dateA = new Date(a.lessonDate);
          var dateB = new Date(b.lessonDate);
          return dateA - dateB;
        });
        setData(dataValues);
        setisLoading(false);
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
  };

  // Get completed Review list
  const getCompletedReviewList = (teacher) => {
    Api.get("api/v1/quizSchedule/review/completed", {
      params: {
        teacherId: teacher,
        userId: userId,
      },
    })
      .then((response) => {
        const dataValues = response.data.completedReviewList;
        dataValues.sort(function compare(a, b) {
          var dateA = new Date(a.lessonDate);
          var dateB = new Date(b.lessonDate);
          return dateA - dateB;
        });
        setcompeleteData(dataValues);
        setisLoading(false);
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
  };
  return (
    <div>
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <Tabs
              value={value}
              indicatorColor="primary"
              variant="fullWidth"
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            >
              <Tab
                label={
                  <Row>
                    <Col>
                      <p className="tab-titles">Pending Review </p>
                    </Col>
                  </Row>
                }
                style={{ minWidth: "50%" }}
                value={0}
              />
              <Tab
                label={
                  <Row>
                    <Col>
                      <p className="tab-titles">Completed Review</p>
                    </Col>
                  </Row>
                }
                style={{ minWidth: "50%" }}
                value={1}
              />
            </Tabs>
            <hr />
            {value === 0 ? (
              <div className="mb-3">
                <h5 className="py-3">Quiz Pending List</h5>
                <div className="material-table-responsive">
                  <ThemeProvider theme={tableTheme}>
                    <MaterialTable
                      icons={tableIcons}
                      data={data}
                      actions={[
                        {
                          icon: () => (
                            <FontAwesomeIcon
                              icon={faClipboardList}
                              size="sm"
                              color="#375474"
                            />
                          ),
                          tooltip: "Review Quiz",
                          onClick: (event, rowData) => {
                            history.push("/quiz/review", rowData);
                          },
                        },
                      ]}
                      options={{
                        actionsColumnIndex: -1,
                        addRowPosition: "last",
                        headerStyle: {
                          fontWeight: "bold",
                          backgroundColor: "#1d1464",
                          color: "white",
                          zIndex: 0,
                        },
                        showTitle: false,
                      }}
                      columns={columns}
                      localization={{
                        body: {
                          emptyDataSourceMessage:
                            "No Pending Reviews are Available",
                        },
                      }}
                    />
                  </ThemeProvider>
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <h5 className="py-3"> Reviewed Quiz List</h5>
                <div className="material-table-responsive">
                  <ThemeProvider theme={tableTheme}>
                    <MaterialTable
                      icons={tableIcons}
                      data={completeData}
                      actions={[
                        {
                          icon: () => (
                            <FontAwesomeIcon
                              icon={faClipboardList}
                              size="sm"
                              color="#375474"
                            />
                          ),
                          tooltip: "Edit Reviewed Quiz",
                          onClick: (event, rowData) => {
                            history.push("/quiz/reviewed/edit", rowData);
                          },
                        },
                      ]}
                      options={{
                        actionsColumnIndex: -1,
                        addRowPosition: "last",
                        headerStyle: {
                          fontWeight: "bold",
                          backgroundColor: "#1d1464",
                          color: "white",
                          zIndex: 0,
                        },
                        showTitle: false,
                      }}
                      columns={columns}
                      localization={{
                        body: {
                          emptyDataSourceMessage: "No Completed Review",
                        },
                      }}
                    />
                  </ThemeProvider>
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

export default TeacherQuizReview;
