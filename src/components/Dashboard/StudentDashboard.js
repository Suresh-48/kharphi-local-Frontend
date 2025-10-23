import React, { useState, useEffect } from "react";
import { Container, Row, Table, Button, Modal, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";

// Component
import Loader from "../core/Loader";
import DashboardTiles from "../../components/core/DashboardTiles";

// Api
import Api from "../../Api";

// Styles
import "../../css/StudentDashboard.scss";

function StudentDashboard() {
  const [data, setData] = useState([]);
  const [upcomingData, setUpcomingData] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const history = useHistory();
  const [isLoading, setisLoading] = useState(true);
  const [CurrentDate, setCurrentDate] = useState("");
  const [lessTime, setLessTime] = useState("");
  const [DateAndTime, setDateAndTime] = useState("");
  const [ZoomLink, setZoomLink] = useState("");
  const [show, setshow] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [studentCourseScheduleId, setStudentCourseScheduleId] = useState("");
  const [sessionEndModal, setSessionEndModal] = useState(false);
  const [zoomStartTimeGet, setZoomStartTimeGet] = useState("");
  const studentId = localStorage.getItem("studentId");

  function closeShow() {
    setshowAlert(false);
  }

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Get Student Data
  const getStudentDashboardData = () => {
    Api.get(`api/v1/dashboard/student/`, {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const data = response?.data?.data;
      setData(data);
      setisLoading(false);
    });
  };

  const getStudentUpcomingSchedule = () => {
    Api.get("api/v1/upcomingcourse/student/list", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const dataValues = response?.data?.upcomingList;
      dataValues.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setUpcomingData(dataValues);
      const orginalTime = response.data.upcomingList;
      orginalTime.forEach(function(list) {
        const time = moment(list.courseScheduleId.startTime, "LT")
          .subtract(15, "minutes")
          .format("HH:mm");
        list.courseScheduleId["zoomTime"] = time;
      });
      setisLoading(false);
    });
  };

  const getStudentCompletedSchedule = () => {
    Api.get("api/v1/upcomingcourse/student/complete/list", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const dataValues = response?.data?.upcomingList;
      setCompletedList(dataValues);
    });
  };

  useEffect(() => {
    getStudentDashboardData();
    getStudentUpcomingSchedule();
    getStudentCompletedSchedule();
    const currentDate = moment()
      .tz("America/Chicago")
      .format();
    const date = moment(currentDate)
      .tz("America/Chicago")
      .format("ll");
    var lessTime = moment(currentDate)
      .tz("America/Chicago")
      .format("HH:mm");
    setCurrentDate(date);
    setLessTime(lessTime);

    window.onpopstate = async (event) => {
      const r = await window.confirm("Are you sure! Do you want logout?");
      if (r === true) {
        // Call Back button programmatically as per user confirmation.
        await history.go(1);
        await localStorage.clear(history.push("/kharpi"));
        window.location.reload();
        return;
        // Uncomment below line to redirect to the previous page instead.
        // window.location = document.referrer // Note: IE11 is not supporting this.
      } else {
        // Stay on the current page.
        history.go(1);
        return;
      }
    };
  }, [studentId]);

  const handleModal = () => {
    setshow(false);
  };

  const zoomTiming = (e) => {
    const studentId = localStorage.getItem("studentId");
    let current_time = moment().format("HH:mm a");
    var travelTime = moment()
      .add(1, "hours")
      .format("HH:mm a");
    // const newDate = new Date();
    // const sessionTiming = newDate.toLocaleTimeString();
    // const sessionTimingEnd = parseInt(sessionTiming) + 1;

    Api.patch("/api/v1/upcomingcourse/student/zoom/timing", {
      studentCourseScheduleId: studentCourseScheduleId,
      zoomStartTime: e === "open" ? current_time : zoomStartTimeGet,
      zoomEndTime: current_time ? travelTime : "",
      // zoomEndTime: e === "close" ? sessionTiming : "",
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
    }, 1000);
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Row className="main-card pb-3">
            <DashboardTiles
              label="Active Enrolled Courses"
              count={data.activeCourse}
              url="/active/enroll/course/list"
            />

            <DashboardTiles label="Completed Courses" count={data.completeCourse} url="/completed/course/list" />
          </Row>

          <div className="mt-3">
            <div className="d-flex justify-content-between">
              <div className="ms-1 mt-2">
                <h4>Upcoming Schedule</h4>
              </div>
              <div>
                <Button
                  variant="primary"
                  className="Kharpi-save-btn me-2 px-3"
                  onClick={() => history.push("/course/search")}
                >
                  Enroll
                </Button>
              </div>
            </div>
            <Row className="mt-0" style={{ minHeight: "227px" }}>
              <Table striped bordered hover className="student-table" responsive>
                <thead>
                  <tr className="viewRow">
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Course Name</th>
                    <th>Lesson Name</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingData?.length > 0 ? (
                    upcomingData.slice(0, 5).map((list, i) => (
                      <tr className="viewRow">
                        <td>{i + 1}</td>
                        <td>{list?.lessonDate}</td>
                        <td>{list?.courseScheduleId?.startTime}</td>
                        <td>{list?.courseScheduleId?.endTime}</td>
                        <td className="linkColor">{list?.courseId?.name}</td>
                        <td>{list?.courseLessonId?.lessonName}</td>
                        <td>{list?.courseId?.duration + " hour"}</td>
                        <td>
                          <p
                            className={`${
                              list?.lessonDate === CurrentDate && list.courseScheduleId.zoomTime <= lessTime
                                ? "zoom-view-style"
                                : "zoom-view-disable-style"
                            }`}
                            onClick={() => {
                              setStudentCourseScheduleId(list.id);
                              if (list?.lessonDate === CurrentDate && list.courseScheduleId.zoomTime <= lessTime) {
                              setshow(true);
                              setIsStudent(true);
                              setZoomLink(list?.courseLessonId);
                              } else {
                                setshowAlert(true);
                                setDateAndTime(list);
                              }
                            }}
                          >
                            Join
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="colspan-data-alignment">
                        <h6 className="d-flex justify-content-center">No Records To Display</h6>
                      </td>
                    </tr>
                  )}
                  {upcomingData?.length > 5 ? (
                    <tr>
                      <td colSpan="8">
                        <Link
                          to={{
                            pathname: `/upcoming/schedule`,
                          }}
                          className="viewAll-link"
                        >
                          View All
                        </Link>{" "}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </Table>
            </Row>
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
                        variant="outline-secondary"
                        className="px-4 mx-2 Kharpi-cancel-btn"
                        onClick={() => handleModal()}
                      >
                        NO
                      </Button>
                      <Button
                        variant="info"
                        className="zoom-start-btn mx-2 px-4 "
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
                      className="create-active mt-3 px-4"
                      onClick={() => {
                        // zoomTiming("close");
                        setSessionEndModal(false);
                      }}
                    >
                      OK
                    </Button>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          ) : null}
          <Modal show={showAlert} centered className="modal-main-content" onHide={() => closeShow()}>
            <Modal.Body id="contained-modal-title-vcenter">
              <div className="delete-content my-4">
                <div className="mb-2">
                  <h5 className="d-flex justify-content-center align-items-center">Notification</h5>
                  <p className="d-flex justify-content-center">
                    {`${"Zoom Link Activate Before 15 Minutes (" + DateAndTime.lessonDate + ")"}`}
                  </p>
                </div>
                <Row>
                  <Col>
                    <Button className="delete-cancel Kharpi-save-btn" variant="light" onClick={() => closeShow()}>
                      OK
                    </Button>
                  </Col>
                </Row>
              </div>
            </Modal.Body>
          </Modal>
          {/* <Modal show={sessionOpen} className="p-4" centered backdrop="static">
            <Modal.Header className="border-bottom-0 pb-0" />
            <h4 className="text-center">Are you sure to start the session...!</h4>
            <Row>
              <Col className=" mt-4 justify-content-center">
                <Button variant="outline-secondary px-4 me-2" onClick={() => handleModal()}>
                  NO
                </Button>
                <Button
                  variant="info"
                  className="px-4"
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
              </Col>
            </Row>
          </Modal> */}
        </Container>
      )}
    </div>
  );
}

export default StudentDashboard;
