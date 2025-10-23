import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Modal, Row, Col } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import moment from "moment";
import { Tab, Tabs } from "@material-ui/core";
import Button from "@restart/ui/esm/Button";
import { useHistory } from "react-router-dom";

// Component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";
import { ROLES_PARENT, ROLES_STUDENT } from "../../constants/roles";

// Api
import Api from "../../Api";

//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCalendarDay } from "@fortawesome/free-solid-svg-icons";

// style
import "../../css/UpcomingSchedule.scss";

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

function UpcomingSchedule(props) {
  const [show, setshow] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [role, setrole] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [ZoomLink, setZoomLink] = useState("");
  const [CurrentDate, setCurrentDate] = useState("");
  const [lessTime, setLessTime] = useState("");
  const [DateAndTime, setDateAndTime] = useState("");
  const [value, setValue] = useState(0);
  const [completeData, setcompeleteData] = useState([]);
  const history = useHistory();
  const [studentId, setstudentId] = useState("");
  const [parentId, setparentId] = useState("");
  const [studentCourseScheduleId, setStudentCourseScheduleId] = useState("");
  const [sessionEndModal, setSessionEndModal] = useState(false);
  const [zoomStartTimeGet, setZoomStartTimeGet] = useState("");


  // Column Heading
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
      title: "Schedule Time",
      render: (rowData) => (
        <div className="d-flex">
          <p>{rowData.courseScheduleId.startTime}</p>-<p>{rowData.courseScheduleId.endTime}</p>
        </div>
      ),
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
      title: (
        <div>
          <p className="mb-0">Durations</p>
          <p className="mb-0">(in Hours)</p>
        </div>
      ),
      render: (rowData) => `${rowData?.courseId.duration}`,
    },
  ];

  const parentColumns = [
    {
      title: "S.No",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "First Name",
      field: "studentId.firstName",
    },
    {
      title: "Last Name",
      field: "studentId.lastName",
    },
    {
      title: "Age",
      field: "studentId.age",
    },
    {
      title: "Date",
      field: "lessonDate",
    },
    {
      title: "Schedule Time",
      render: (rowData) => (
        <div>
          <p>{rowData.courseScheduleId.startTime}</p>
          <p>{rowData.courseScheduleId.endTime}</p>
        </div>
      ),
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
      title: (
        <div>
          <p className="mb-0">Durations</p>
          <p className="mb-0">(in Hours)</p>
        </div>
      ),
      render: (rowData) => `${rowData?.courseId.duration}`,
    },
  ];

  const completeParentColumns = [
    {
      title: "S.No",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "First Name",
      field: "studentId.firstName",
    },
    {
      title: "Last Name",
      field: "studentId.lastName",
    },
    {
      title: "Age",
      field: "studentId.age",
    },
    {
      title: "Date",
      field: "lessonDate",
    },
    {
      title: "Schedule Time",
      render: (rowData) => (
        <div>
          <p>{rowData.courseScheduleId.startTime}</p>
          <p>{rowData.courseScheduleId.endTime}</p>
        </div>
      ),
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
      title: (
        <div>
          <p className="mb-0">Durations</p>
          <p className="mb-0">(in Hours)</p>
        </div>
      ),
      render: (rowData) => `${rowData?.courseId.duration}`,
    },
  ];

  const completeStudentColumns = [
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
      title: "Schedule Time",
      render: (rowData) => (
        <div>
          <p>{rowData?.courseScheduleId?.startTime}</p>
          <p>{rowData?.courseScheduleId?.endTime}</p>
        </div>
      ),
    },
    {
      title: "Course Name",
      render: (rowData) => (
        <Link
          className="linkColor"
          to={{
            pathname: `/course/detail/${rowData?.courseId?.aliasName}`,
            state: { courseId: rowData?.id },
          }}
        >
          {rowData?.courseId?.name}
        </Link>
      ),
    },
    {
      title: "Lesson Name",
      field: "courseLessonId.lessonName",
    },
    {
      title: (
        <div>
          <p className="mb-0">Durations</p>
          <p className="mb-0">(in Hours)</p>
        </div>
      ),
      render: (rowData) => `${rowData?.courseId?.duration}`,
    },
  ];

  const handleModal = () => {
    setshow(false);
  };

  function closeShow() {
    setshowAlert(false);
  }

  const isParent = role === ROLES_PARENT;
  const isStudent = role === ROLES_STUDENT;

  useEffect(() => {
    const role = localStorage.getItem("role");
    const isParent = role === ROLES_PARENT;
    setrole(role);
    isParent ? ParentUpcomingScheduleData() : StudentUpcomingScheduleData();
    isParent ? ParentCompletelist() : StudentCompletelist();
    const currentDate = moment().tz("America/Chicago").format();
    const date = moment(currentDate).tz("America/Chicago").format("ll");
    //var lessTime = moment(currentDate).tz("America/Chicago").format("HH:mm");
    const lessTime = moment(currentDate).tz("Asia/Kolkata").format("HH:mm");
    setCurrentDate(date);
    setLessTime(lessTime);
  }, []);

  // Get Parent Upcoming Schedule
  const ParentUpcomingScheduleData = () => {
    const parentId = localStorage.getItem("parentId");
    Api.get("api/v1/upcomingcourse/parent/list", {
      params: {
        parentId: parentId,
      },
    }).then((response) => {
      const dataValues = response.data.upcomingList;
      dataValues.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setData(dataValues);
      setparentId(parentId);
      setisLoading(false);
    });
  };

  // Get Student Upcoming Schedule
  const StudentUpcomingScheduleData = () => {
    const studentId = localStorage.getItem("studentId");
    Api.get("api/v1/upcomingcourse/student/list", {
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
      const orginalTime = response.data.upcomingList;
      orginalTime.forEach(function (list) {
        const time = moment(list.courseScheduleId.startTime, "LT").subtract(15, "minutes").format("HH:mm");
        list.courseScheduleId["zoomTime"] = time;
      });
      setstudentId(studentId);
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
    }); //logout
    // const logout = () => {
    //   localStorage.clear(history.push("/kharpi"));
    //   window.location.reload();
    // };
  };

  //get parent complete list
  const ParentCompletelist = () => {
    const parentId = localStorage.getItem("parentId");
    Api.get("api/v1/upcomingcourse/parent/complete/list", {
      params: {
        parentId: parentId,
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

  // Log out
  const logout = () => {
    localStorage.clear(history.push("/kharpi"));
    window.location.reload();
  };

  const zoomTiming = (e) => {
    const studentId = localStorage.getItem("studentId");
    const newDate = new Date();
    const sessionTiming = newDate.toLocaleTimeString();
    Api.patch("/api/v1/upcomingcourse/student/zoom/timing", {
      studentCourseScheduleId: studentCourseScheduleId,
      zoomStartTime: e === "open" ? sessionTiming : zoomStartTimeGet,
      zoomEndTime: e === "close" ? sessionTiming : "",
      studentId: studentId,
    }).then((res) => {
      const ZoomstartTime = res.data.zoomDetails.zoomStartTime;
      setZoomStartTimeGet(ZoomstartTime);
    });
  };

  const showModal = () => {
    setSessionEndModal(false);
    setTimeout(() => {
      setSessionEndModal(true);
    }, 2000);
  };

  return (
    <div>
      <Container className="mb-3">
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <div className="d-flex justify-content-end mt-3">
              <FontAwesomeIcon
                icon={faCalendarDay}
                color="#397ad4"
                style={{ cursor: "pointer", fontSize: 30, color: "#375474" }}
                onClick={() => {
                  history.push({
                    pathname: "/calendar/view/upcoming/schedule",
                    state: {
                      studentId: studentId,
                      parentId: parentId,
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
            >
              <Tab
                label={
                  <Row>
                    <Col>
                      <p className="tab-titles">Upcoming Schedule</p>
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

            <hr />
            {value === 0 ? (
              <div>
                <h5 className=" py-3">Upcoming Schedule</h5>
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
                          backgroundColor: "#1d1464",
                          color: "white",
                          zIndex: 0,
                          hover: {
                            "&:hover": {
                              backgroundColor: "green !important",
                            },
                          },
                        },
                        showTitle: false,
                      }}
                      columns={isParent ? parentColumns : studentColumns}
                      actions={
                        isStudent
                          ? [
                              (rowData) => ({
                                icon: () => (
                                  <p
                                    className={`${
                                      rowData.lessonDate === CurrentDate &&
                                      rowData.courseScheduleId.zoomTime <= lessTime
                                        ? "zoom-view-style"
                                        : "zoom-view-disable-style"
                                    }`}
                                  >
                                    Join
                                  </p>
                                ),
                                tooltip: "Zoom Link",
                                onClick: (event, rowData) => {
                                  setStudentCourseScheduleId(rowData.id);
                                  if (
                                    rowData.lessonDate === CurrentDate &&
                                    rowData.courseScheduleId.zoomTime <= lessTime
                                  ) {
                                    setshow(true);
                                    setZoomLink(rowData.courseLessonId);
                                  } else {
                                    setshowAlert(true);
                                    setDateAndTime(rowData);
                                  }
                                },
                              }),
                            ]
                          : null
                      }
                      localization={{
                        body: {
                          emptyDataSourceMessage: "No Upcoming Schedule",
                        },
                      }}
                    />
                  </ThemeProvider>
                </div>
                {isStudent ? (
                  <div>
                    <Modal show={show} centered backdrop="static">
                      <Modal.Header className="border-bottom-0 pb-0" />
                      <Modal.Body id="contained-modal-title-vcenter" className="zoom-modal-popup pt-0">
                        <div className="align-items-center zoom-content">
                          <h4 className="mt-2">Are you sure to start the Zoom class...!</h4>
                          <div className="d-flex mt-4 ">
                            <Button
                              variant="contained"
                              className="zoom-start-btn mx-2 Kharpi-save-btn"
                              rel="noopener noreferrer"
                              target="_blank"
                              onClick={() => {
                                zoomTiming("open");
                                setshow(false);
                                showModal();
                                window.open(`${ZoomLink?.zoomId}+${ZoomLink?.zoomPassword}`, "_blank");
                              }}
                            >
                              YES
                            </Button>
                            <Button className="zoom-cancel-btn mx-2 Kharpi-cancel-btn" onClick={() => handleModal()}>
                              NO
                            </Button>
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>
                    <Modal show={sessionEndModal} centered backdrop="static">
                      <Modal.Header className="border-bottom-0 pb-0" />
                      <Modal.Body id="contained-modal-title-vcenter" className="zoom-modal-popup pt-0">
                        <div className="align-items-center zoom-content">
                          <h4 className="mt-2">Session has ended...!</h4>
                          <Button
                            variant="contained"
                            className="zoom-start-btn mx-2 mt-4 "
                            onClick={() => {
                              zoomTiming("close");
                              setSessionEndModal(false);
                            }}
                          >
                            OK
                          </Button>
                        </div>
                      </Modal.Body>
                    </Modal>
                    <Modal show={showAlert} centered className="modal-main-content" onHide={() => closeShow()}>
                      <Modal.Body id="contained-modal-title-vcenter">
                        <div className="delete-content my-4">
                          <div className="mb-2">
                            <h5 className="d-flex justify-content-center align-items-center">Notification</h5>
                            <p className="d-flex justify-content-center">
                              {`${
                                "Zoom Link Activate Before 15 Minutes" +
                                " " +
                                "(" +
                                " " +
                                DateAndTime.lessonDate +
                                " " +
                                ")"
                              }`}
                            </p>
                          </div>
                          <Row>
                            <Col>
                              <Button className="delete-cancel Kharpi-save-btn" onClick={() => closeShow()}>
                                OK
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>
                ) : null}
              </div>
            ) : (
              <div>
                <h5 className="py-3">Completed Schedule</h5>
                <div className="material-table-responsive">
                  <ThemeProvider theme={tableTheme}>
                    <MaterialTable
                      icons={tableIcons}
                      data={completeData}
                      columns={isParent ? completeParentColumns : completeStudentColumns}
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

export default UpcomingSchedule;
