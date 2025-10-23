import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Container, Row, Col } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { Tab, Tabs } from "@material-ui/core";

import Avatar from "react-avatar";

// Component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";
import DashboardTiles from "../../components/core/DashboardTiles";

// Api
import Api from "../../Api";

// style
import "../../css/StudentDetails.scss";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

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

function StudentDetail(props) {
  const [userDetail, setUserDetail] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [completeData, setcompeleteData] = useState([]);
  const history = useHistory();

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  const columns = [
    {
      title: "S.no",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Date",
      field: "lessonDate",
    },
    {
      title: "Start Time",
      field: "courseScheduleId.startTime",
    },
    {
      title: "End Time",
      field: "courseScheduleId.endTime",
    },
    {
      title: "Course Name",
      field: "courseId.name",
    },
    {
      title: "Lesson Name",
      field: "courseLessonId.lessonName",
    },
    {
      title: "Duration",
      render: (rowData) => `${rowData?.courseId.duration + "hour"}`,
    },
  ];

  useEffect(() => {
    userDetails();
    StudentUpcomingScheduleData();
    StudentCompletelist();
  }, []);

  const userDetails = () => {
    Api.get(`api/v1/student/61a856686ca31d3960764eb4`)
      .then((response) => {
        const data = response.data.data.getOne;
        setUserDetail(data);
        setisLoading(false);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };
  // Get Student Upcoming Schedule
  const StudentUpcomingScheduleData = () => {
    const studentId = localStorage.getItem("studentId");
    Api.get("/api/v1/upcomingcourse/student/list", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const dataValues = response.data.upcomingList;
      dataValues.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setData(dataValues);
      setisLoading(false);
    });
  };

  //get student complete list
  const StudentCompletelist = () => {
    const studentId = localStorage.getItem("studentId");
    Api.get("api/v1/upcomingcourse/student/complete/list", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const completeData = response.data.upcomingList;
      completeData.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setcompeleteData(completeData);
      setisLoading(false);
    });
  };

  return (
    <div>
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <Row className="student-details">
              <div xs={6} md={3} className="user-avatar-style">
                {userDetail.image === undefined ||
                userDetail.image === "null" ? (
                  <Avatar
                    name={`${userDetail?.firstName} ${userDetail?.lastName}`}
                    size="170"
                    round={true}
                    color="silver"
                  />
                ) : (
                  <Avatar
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIQBSM5MesDUBQ7bCk4J7m0joEEy_Mfvk4Og&usqp=CAU"
                    size="170"
                    round={true}
                    color="silver"
                  />
                )}
              </div>
              <div>
                <p className="student-detail">
                  {userDetail?.firstName} {userDetail?.lastName}
                </p>
                <p className="student-detail">{userDetail?.email}</p>
              </div>
              <Row className="course-card-style">
                <DashboardTiles
                  label="Active Enrolled Courses"
                  count={userDetail?.totalCourseEnrolled}
                />
                <DashboardTiles label="Completed Courses" count="0" />
              </Row>
            </Row>
            <div className="mt-4">
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
                        <p className="tab-titles">Upcoming Schedule </p>
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
                        <p className="tab-titles">Completed Schedule </p>
                      </Col>
                    </Row>
                  }
                  style={{ minWidth: "50%" }}
                  value={1}
                />
              </Tabs>
            </div>
            <hr />
            {value === 0 ? (
              <div>
                <h5 className="d-flex justify-content-center py-3">
                  Upcoming Schedule
                </h5>
                <div className="material-table-responsive">
                  <ThemeProvider theme={tableTheme}>
                    <MaterialTable
                      icons={tableIcons}
                      data={data}
                      options={{
                        actionsColumnIndex: -1,
                        addRowPosition: "last",
                        headerStyle: {
                          fontWeight: "bold",
                          backgroundColor: "#CCE6FF",
                          zIndex: 0,
                        },
                        showTitle: false,
                      }}
                      columns={columns}
                      localization={{
                        body: {
                          emptyDataSourceMessage: "No Upcoming Schedule",
                        },
                      }}
                    />
                  </ThemeProvider>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="d-flex justify-content-center align-items-center py-3">
                  Completed Schedule{" "}
                </h4>
                <div className="material-table-responsive">
                  <ThemeProvider theme={tableTheme}>
                    <MaterialTable
                      icons={tableIcons}
                      data={completeData}
                      columns={columns}
                      options={{
                        actionsColumnIndex: -1,
                        headerStyle: {
                          fontWeight: "bold",
                          backgroundColor: "#CCE6FF",
                          zIndex: 0,
                        },
                        showTitle: false,
                      }}
                      localization={{
                        body: {
                          emptyDataSourceMessage: "No Completed Course",
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

export default StudentDetail;
