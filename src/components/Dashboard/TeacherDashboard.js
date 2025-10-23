import React, { useState, useEffect } from "react";
import { Container, Row, Table, Button, Modal, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";

// Styles
import DashboardTiles from "../../components/core/DashboardTiles";
import Api from "../../Api";
import Loader from "../../components/core/Loader";

// Styles
import "../../css/TeacherDashboard.scss";

//icon

import DisplayTeacherApplication from "../TeacherApplication/displayTeacherApplication";

function TeacherDashboard() {
  const [data, setData] = useState([]);
  const [upComingData, setUpcomingData] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const [CurrentDate, setCurrentDate] = useState("");
  const [lessTime, setLessTime] = useState("");
  const [DateAndTime, setDateAndTime] = useState("");
  const [ZoomLink, setZoomLink] = useState("");
  const [showAlert, setshowAlert] = useState(false);
  const [show, setshow] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [status, setStatus] = useState("");
  const [courseScheduleId, setCourseScheduleId] = useState("");
  const [zoomStartTimeGet, setZoomStartTimeGet] = useState("");
  const [sessionEndModal, setSessionEndModal] = useState(false);
  const history = useHistory();

  function closeShow() {
    setshowAlert(false);
  }

  useEffect(() => {
    const teacherId = localStorage.getItem("teacherId");
    Api.get(`api/v1/teacher/${teacherId}`).then((response) => {
      const teacherStatus = response?.data?.data?.getOne?.status;
      setStatus(teacherStatus);
      setisLoading(false);
    }, []);

    TeacherUpcomingScheduleData(teacherId);
    getTeacherCourseCount(teacherId);
    const currentDate = moment().tz("America/Chicago").format();
    const date = moment(currentDate).tz("America/Chicago").format("ll");
    var lessTime = moment(currentDate).tz("America/Chicago").format("HH:mm");
    setCurrentDate(date);
    setLessTime(lessTime);
    setTeacherId(teacherId);

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
  }, []);

  // GetTeacher Upcoming Schedule
  const TeacherUpcomingScheduleData = () => {
    const teacherId = localStorage.getItem("teacherId");
    setTeacherId(teacherId);
    Api.get("/api/v1/teacherUpcomingSchedule/upcoming", {
      params: {
        teacherId: teacherId,
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
      orginalTime.forEach(function (list) {
        const time = moment(list.courseScheduleId.startTime, "LT").subtract(15, "minutes").format("HH:mm");
        list.courseScheduleId["zoomTime"] = time;
      });
      setisLoading(false);
    });
  };

  const getTeacherCourseCount = (teacherId) => {
    Api.get("/api/v1/dashboard/teacher", {
      params: {
        teacherId: teacherId,
      },
    }).then((response) => {
      const teacherCourseData = response?.data?.data;
      setData(teacherCourseData);
      setisLoading(false);
    });
  };
  const handleModal = () => {
    setshow(false);
  };
  const newDate = new Date();

  const zoomTiming = (e) => {
    const teacherId = localStorage.getItem("teacherId");
    const newDate = new Date();
    const sessionTiming = newDate.toLocaleTimeString();
    // const date = newDate.toLocaleDateString();
    const date = newDate.getDate() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getFullYear();

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = weekday[newDate.getDay()];
    Api.patch("/api/v1/teacherUpcomingSchedule/zoom/timing", {
      teacherUpcomingScheduleId: courseScheduleId.id,
      courseName: courseScheduleId.courseId.aliasName,
      lessonName: courseScheduleId.courseLessonId.lessonName,
      teacherPayableAmount: courseScheduleId.teacherId.teacherSessionAmount,
      zoomStartTime: e === "open" ? sessionTiming : zoomStartTimeGet,
      zoomEndTime: e === "close" ? sessionTiming : "",
      date: date,
      teacherId: teacherId,
    }).then((res) => {
      const ZoomstartTime = res.data.zoomDetails.zoomStartTime;
      setZoomStartTimeGet(ZoomstartTime);
    });
  };

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 600000);
  };

  const showModal = () => {
    setSessionEndModal(false);
    setTimeout(() => {
      setSessionEndModal(true);
    }, 300000);
  };
  // const showModal = () => {
  //   setSessionEndModal(false);
  //   setTimeout(() => {
  //     setSessionEndModal(true);
  //   }, 1000);   600000
  // };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : status === "Pending" ? (
        <DisplayTeacherApplication />
      ) : (
        <Container>
          <Row>
            <DashboardTiles label="Courses" count={data?.totalCourse} url={`/teacher/schedule/${teacherId}`} />
            <DashboardTiles label="Pending Payment" count={0} url="#" />
            <DashboardTiles label="Received Payment" count={0} url="#" />
          </Row>
          <Row className="mt-5 " style={{ minHeight: "227px" }}>
            <div>
              <h4>Upcoming Schedule </h4>
            </div>
            <Table striped bordered hover responsive>
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
                {upComingData?.length > 0 ? (
                  upComingData.slice(0, 5).map((list, i) => (
                    <tr className="viewRow">
                      <td>{i + 1}</td>
                      <td>{list?.lessonDate}</td>
                      <td>{list?.courseScheduleId?.startTime}</td>
                      <td>{list?.courseScheduleId?.endTime}</td>
                      <td className="linkColor">{list?.courseId?.name}</td>
                      <td>{list?.courseLessonId?.lessonName}</td>
                      <td>{list?.courseId?.duration + "hour"}</td>
                      <td>
                        <p
                          className={`${
                            list.lessonDate === CurrentDate && list.courseScheduleId.zoomTime <= lessTime
                              ? "zoom-view-style"
                              : "zoom-view-disable-style"
                          }`}
                          onClick={() => {
                            setCourseScheduleId(list);
                            if (list.lessonDate === CurrentDate && list.courseScheduleId.zoomTime <= lessTime) {
                              setshow(true);
                              setIsTeacher(true);
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
                      <h6 className="d-flex justify-content-center">No Records to Display</h6>
                    </td>
                  </tr>
                )}
                {upComingData?.length > 5 ? (
                  <tr>
                    <td colSpan="8">
                      <Link
                        to={{
                          pathname: `/upcoming/teacher/schedule/list`,
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

          {isTeacher ? (
            <div>
              <Modal show={show} centered backdrop="static">
                <Modal.Header className="border-bottom-0 pb-0" />
                <Modal.Body id="contained-modal-title-vcenter" className="zoom-modal-popup pt-0">
                  <div className="align-items-center zoom-content">
                    <h4 className="mt-2">Are you sure to start the session...!</h4>
                    <Col className=" mt-4 ">
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
                  </div>
                </Modal.Body>
              </Modal>
              <Modal show={sessionEndModal} centered backdrop="static" className="p-3">
                <Modal.Header className="border-bottom-0 pb-0" />

                <Modal.Body>
                  <h4 className="mt-2 text-center">Session has ended...!</h4>

                  <Col className="d-flex justify-content-center mt-4 mb-2">
                    <Button
                      variant="outline-secondary"
                      className=" me-2"
                      rel="noopener noreferrer"
                      target="_blank"
                      onClick={() => {
                        zoomTiming("open");
                        setshow(false);
                        showModal();
                        window.open(`${ZoomLink?.zoomId}+${ZoomLink?.zoomPassword}`, "_blank");
                      }}
                    >
                      ReStart Session
                    </Button>
                    <Button
                      variant="contained"
                      className="create-active"
                      onClick={() => {
                        zoomTiming("close");
                        setSessionEndModal(false);
                      }}
                    >
                      End Session
                    </Button>
                  </Col>
                </Modal.Body>
              </Modal>
              {/* <Modal show={sessionEndModal} centered backdrop="static">
                <Modal.Header className="border-bottom-0 pb-0" />
                <Modal.Body id="contained-modal-title-vcenter" className="zoom-modal-popup pt-0">
                  <div className="align-items-center zoom-content">
                    <h4 className="mt-2">Session has ended...!</h4>
                    <Col className="d-flex justify-content-flex-end">
                      <Button className="create-active me-2"> ReStart Session</Button>
                      <Button
                        variant="contained"
                        className="create-active  "
                        onClick={() => {
                          zoomTiming("close");
                          setSessionEndModal(false);
                        }}
                      >
                        End Session
                      </Button>
                    </Col>
                  </div>
                </Modal.Body>
              </Modal> */}
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
        </Container>
      )}
    </div>
  );
}

export default TeacherDashboard;
