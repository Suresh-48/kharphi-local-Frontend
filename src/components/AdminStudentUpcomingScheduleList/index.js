import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Container, Row, Col } from "react-bootstrap";
import { Tab, Tabs } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

// Component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";

// Api
import Api from "../../Api";

//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";

function AdminStudentUpcomingScheduleList(props) {
  const [isLoading, setisLoading] = useState(true);
  const [studentUpcomingData, setStudentUpcomingData] = useState([]);
  const [studentCompleteData, setStudentCompleteData] = useState([]);
  const [value, setValue] = useState(0);
  const [studentId, setstudentId] = useState(props?.match?.params?.id);
  const [firstName, setfirstName] = useState(props?.location?.state?.firstName);
  const [lastName, setlastName] = useState(props?.location?.state?.lastName);
  const history = useHistory();

  const studentColumns = [
    {
      title: "S.No",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Date",
      field: "lessonDate",
    },
    {
      title: "Start Time",
      // field: "courseScheduleId.startTime",
      render: (rowData) => (rowData.zoomStartTime ? rowData.zoomStartTime : rowData.courseScheduleId.startTime),
    },
    {
      title: "End Time",
      render: (rowData) => (rowData.zoomEndTime ? rowData.zoomEndTime : rowData.courseScheduleId.endTime),
      // field: "courseScheduleId.endTime",
    },
    {
      title: "Course Name",
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
      title: "Duration",
      render: (rowData) => `${rowData?.courseId.duration + " hour"}`,
    },
  ];

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

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Get Student Upcoming Schedule
  const StudentUpcomingScheduleData = () => {
    Api.get("api/v1/upcomingcourse/student/list", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const studentUpcomingData = response.data.upcomingList;
      studentUpcomingData.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setStudentUpcomingData(studentUpcomingData);
      setisLoading(false);
    });
  };

  //Get student complete schedule
  const StudentCompleteScheduleData = () => {
    Api.get("api/v1/upcomingcourse/student/complete/list", {
      params: {
        studentId: studentId,
             },
    })
      .then((response) => {
        const studentCompleteData = response.data.upcomingList;
        studentCompleteData.sort(function compare(a, b) {
          var dateA = new Date(a.lessonDate);
          var dateB = new Date(b.lessonDate);
          return dateA - dateB;
        });
        setStudentCompleteData(studentCompleteData);
        setisLoading(false);
      })
        };

  useEffect(() => {
    StudentCompleteScheduleData();
    StudentUpcomingScheduleData();
  }, []);

  return (
    <div>
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            {/* <div>
              <h4 className="text-center">Student Upcoming Schedule</h4>
            </div> */}
            <div className="d-flex justify-content-end">
              <FontAwesomeIcon
                icon={faCalendarDay}
                color="#375474"
                style={{ cursor: "pointer", fontSize: 30 }}
                onClick={() => {
                  history.push({
                    pathname: "/calendar/view/upcoming/schedule",
                    state: {
                      studentId: studentId,
                      firstName: firstName,
                      lastName: lastName,
                    },
                  });
                }}
              />
            </div>
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
                      <p className="tab-titles">Completed Schedule</p>
                    </Col>
                  </Row>
                }
                style={{ minWidth: "50%" }}
                value={1}
              />
            </Tabs>
            <hr />
            {value === 0 ? (
              <div>
                <h5 className="  py-3">{`${firstName + " " + lastName + " Upcoming Schedule "}`}</h5>
                <div className="material-table-responsive">
                  <ThemeProvider theme={tableTheme}>
                    <MaterialTable
                      icons={tableIcons}
                      data={studentUpcomingData}
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
                      columns={studentColumns}
                      localization={{
                        body: {
                          emptyDataSourceMessage: "No Upcoming Schedule ",
                        },
                      }}
                    />
                  </ThemeProvider>
                </div>
              </div>
            ) : (
              <div>
                <h5 className=" py-3">{`${firstName + " " + lastName + " Completed Schedule  "}`}</h5>
                <div className="material-table-responsive">
                  <ThemeProvider theme={tableTheme}>
                    <MaterialTable
                      icons={tableIcons}
                      data={studentCompleteData}
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
                      columns={studentColumns}
                      localization={{
                        body: {
                          emptyDataSourceMessage: "No Completed Schedule ",
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

export default AdminStudentUpcomingScheduleList;
