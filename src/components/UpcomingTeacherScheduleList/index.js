import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Modal, Row, Col, Form } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import moment from "moment";
import Select from "react-select";
import Avatar from "@material-ui/core/Avatar";
import Button from "@restart/ui/esm/Button";
import { Tab, Tabs } from "@material-ui/core";
import { useHistory } from "react-router-dom";

// Component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";
import { ROLES_TEACHER } from "../../constants/roles";

// Api
import Api from "../../Api";

//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCalendarDay } from "@fortawesome/free-solid-svg-icons";

// style
import "../../css/UpcomingSchedule.scss";
import { setDay } from "date-fns";
import { customStyles } from "../core/Selector";

function UpcomingTeacherScheduleList(props) {
  const [show, setshow] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [role, setrole] = useState("");
  const [data, setData] = useState([]);
  const [teacherUpcomingData, setTeacherUpcomingData] = useState([]);
  const [teacherCompletedData, setTeacherCompletedData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [ZoomLink, setZoomLink] = useState("");
  const [CurrentDate, setCurrentDate] = useState("");
  const [lessTime, setLessTime] = useState("");
  const [DateAndTime, setDateAndTime] = useState("");
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [teacherName, setTeacherName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [modelValue, setModelValue] = useState("");
  const [value, setValue] = useState(0);
  const [isSubmit, setisSubmit] = useState(false);

  const history = useHistory();
  const [teacherScheduleCalendar, setTeacherScheduleCalendar] = useState([]);
  const [teacherScheduleCalendarData, setTeacherScheduleCalendarData] = useState([]);
  const [teacherCourseScheduleId, setTeacherCourseScheduleId] = useState("");
  const [zoomStartTimeGet, setZoomStartTimeGet] = useState("");
  const [sessionEndModal, setSessionEndModal] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [courseScheduleId, setCourseScheduleId] = useState("");
  const [courseLessonId, setCourseLessonId] = useState("");


  // Column Heading
  const teacherColumns = [
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
      field: "courseScheduleId.startTime",
    },
    {
      title: "End Time",
      field: "courseScheduleId.endTime",
    },
    {
      title: "Course Name",
      render: (rowData) => (
        <Link
          to={{
            pathname: `/course/detail/${rowData?.courseId?.aliasName}`,
            state: { courseId: rowData?.id },
          }}
          className="linkColor"
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
      title: "Duration",
      render: (rowData) => `${rowData?.courseId?.duration + " hour"}`,
    },
  ];
  const adminColumns = [
    {
      title: "S.No",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Name",
      render: (rowData) =>
        rowData?.teacherId?.firstName === undefined
          ? "No Teacher"
          : `${rowData?.teacherId?.firstName + " " + rowData?.teacherId?.lastName}`,
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
      title: "Duration",
      render: (rowData) => `${rowData?.courseId?.duration + "hour"}`,
    },
  ];

  const handleModal = () => {
    setshow(false);
  };

  const isTeacher = role === ROLES_TEACHER;

  function closeShow() {
    setshowAlert(false);
  }

  useEffect(() => {
    const role = localStorage.getItem("role");
    setrole(role);
    TeacherUpcomingScheduleData();
    TeacherCompletedScheduleData();
    AdminTeacherUpcomingScheduleData();
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
    getApprovedTeacher();
  }, []);

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Get Teacher Upcoming Schedule
  const TeacherUpcomingScheduleData = () => {
    const teacherId = localStorage.getItem("teacherId");
    setTeacherId(teacherId);
    Api.get("/api/v1/teacherUpcomingSchedule/upcoming", {
      params: {
        teacherId: teacherId,
      },
    }).then((response) => {
      const teacherUpcomingData = response?.data?.upcomingList;
      setTeacherScheduleCalendarData(response?.data?.upcomingCalendarList);

      teacherUpcomingData?.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setTeacherUpcomingData(teacherUpcomingData);
      const orginalTime = response?.data?.upcomingList;
      orginalTime.forEach(function(list) {
        const time = moment(list?.courseScheduleId?.startTime, "LT")
          .subtract(15, "minutes")
          .format("HH:mm");
        list.courseScheduleId["zoomTime"] = time;
      });
      setisLoading(false);
    });
  };

  // Get Completed Upcoming Schedule
  const TeacherCompletedScheduleData = () => {
    const teacherId = localStorage.getItem("teacherId");
    Api.get("/api/v1/teacherUpcomingSchedule/completed", {
      params: {
        teacherId: teacherId,
      },
    }).then((response) => {
      const teacherCompletedData = response?.data?.completedList;
      teacherCompletedData.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setTeacherCompletedData(teacherCompletedData);
      const orginalTime = response?.data?.completedList;
      orginalTime.forEach(function(list) {
        const time = moment(list?.courseScheduleId?.startTime, "LT")
          .subtract(15, "minutes")
          .format("HH:mm");
        list.courseScheduleId["zoomTime"] = time;
      });
      setisLoading(false);
    });
  };

  // Change Teacher
  const submitForm = () => {
    setisSubmit(false);
    Api.post("api/v1/teacherUpcomingSchedule/update/teacher", {
      teacherId: teacherId,
      teacherScheduleId: modelValue.id,
    })
      .then((res) => {
        setTeacherName("");
        setshow(false);
        AdminTeacherUpcomingScheduleData();
        toast.success("Updated");
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
      });
  };

  // Get Teacher Upcoming Schedule for Admin
  const AdminTeacherUpcomingScheduleData = () => {
    Api.get("/api/v1/teacherUpcomingSchedule").then((response) => {
      const dataValues = response.data.upcomingList;
      setTeacherScheduleCalendar(response.data.upcomingCalendarList);
      dataValues.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setData(dataValues);
      setisLoading(false);
    });
  };

  const getApprovedTeacher = () => {
    Api.get(`api/v1/teacher/list`).then((res) => {
      const data = res.data.teacherList;
      setApprovedTeachers(data);
    });
  };

  const zoomTiming = (e) => {
    const teacherId = localStorage.getItem("teacherId");
    const newDate = new Date();
    const sessionTiming = newDate.toLocaleTimeString();
    const date = newDate.toLocaleDateString();

    Api.patch("/api/v1/teacherUpcomingSchedule/zoom/timing", {
      teacherUpcomingScheduleId: teacherCourseScheduleId,
      zoomStartTime: e === "open" ? sessionTiming : zoomStartTimeGet,
      zoomEndTime: e === "close" ? sessionTiming : "",
      teacherId: teacherId,
      date: date,
      courseName: courseScheduleId.courseId.aliasName,
      lessonName: courseScheduleId.courseLessonId.lessonName,
      teacherPayableAmount: courseScheduleId.teacherId.teacherSessionAmount,
    }).then((res) => {
      const ZoomstartTime = res.data.zoomDetails.zoomStartTime;
      setZoomStartTimeGet(ZoomstartTime);
    });
  };

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

  const showModal = () => {
    setSessionEndModal(false);
    setTimeout(() => {
      setSessionEndModal(true);
    }, 2000);
  };

  return (
    <div>
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            {/* <div className="d-flex justify-content-end">
              <FontAwesomeIcon
                icon={faCalendarDay}
                color="#397ad4"
                style={{ cursor: "pointer", fontSize: 30 }}
                onClick={() => {
                  history.push({
                    pathname: "/calendar/view/upcoming/schedule",
                    state: {
                      teacherId: teacherId,
                      teacherSchedule: teacherScheduleCalendarData,
                    },
                  });
                }}
              />
            </div> */}
            {isTeacher ? (
              <div>
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
                <hr />
                {value === 0 ? (
                  <div className="mb-3">
                    <div className="py-3">
                      <h5>Upcoming Schedule</h5>
                    </div>
                    <div className="material-table-responsive">
                      <ThemeProvider theme={tableTheme}>
                        <MaterialTable
                          style={{ marginBottom: "10px" }}
                          icons={tableIcons}
                          columns={teacherColumns}
                          data={teacherUpcomingData}
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
                          actions={[
                            (rowData) => ({
                              icon: () => (
                                <p
                                  className={`${
                                    rowData?.lessonDate === CurrentDate && rowData?.courseScheduleId?.zoomTime <= lessTime
                                      ? "zoom-view-style"
                                      : "zoom-view-disable-style"
                                  }`}
                                >
                                  Join
                                </p>
                              ),
                              tooltip: "Zoom Link",
                              onClick: (event, rowData) => {
                                setTeacherCourseScheduleId(rowData.id);
                                setCourseScheduleId(rowData);
                                if (
                                  rowData?.lessonDate === CurrentDate &&
                                  rowData?.courseScheduleId?.zoomTime <= lessTime
                                ) {
                                  setshow(true);
                                  setZoomLink(rowData?.courseLessonId);
                                } else {
                                  setshowAlert(true);
                                  setDateAndTime(rowData);
                                }
                              },
                            }),
                          ]}
                          localization={{
                            body: {
                              emptyDataSourceMessage: "No Upcoming Schedule",
                            },
                          }}
                        />
                      </ThemeProvider>
                    </div>
                    <div>
                      <Modal show={show} centered backdrop="static">
                        <Modal.Header className="border-bottom-0 pb-0" />
                        <Modal.Body id="contained-modal-title-vcenter" className="zoom-modal-popup pt-0">
                          <div className="align-items-center zoom-content">
                            <h4 className="mt-2">Are you sure to start the session...!</h4>
                            <div className="d-flex mt-4 ">
                              <Button
                                variant="contained"
                                className="zoom-start-btn mx-2 filter-btn"
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
                              className="zoom-start-btn mx-2 mt-4 Kharpi-save-btn"
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
                                {`${"Zoom Link Activate Before 15 Minutes" +
                                  " " +
                                  "(" +
                                  " " +
                                  DateAndTime.lessonDate +
                                  " " +
                                  ")"}`}
                              </p>
                            </div>
                            <Row>
                              <Col>
                                <Button className="delete-cancel" onClick={() => closeShow()}>
                                  OK
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        </Modal.Body>
                      </Modal>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <div className="py-3">
                      <h5>Completed Schedule List</h5>
                    </div>
                    <div className="material-table-responsive">
                      <ThemeProvider theme={tableTheme}>
                        <MaterialTable
                          icons={tableIcons}
                          columns={teacherColumns}
                          data={teacherCompletedData}
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
            ) : (
              <div>
                <div className="py-3">
                  <h5>Teachers Upcoming Lessons</h5>
                </div>
                <div className="material-table-responsive">
                  <ThemeProvider theme={tableTheme}>
                    <MaterialTable
                      icons={tableIcons}
                      columns={adminColumns}
                      data={data}
                      style={{ marginBottom: "10px" }}
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
                      actions={[
                        (rowData) => ({
                          icon: () => <p className={"zoom-view-style"}>Change Teacher</p>,
                          tooltip: "Click",
                          onClick: (event, rowData) => {
                            setModelValue(rowData);
                            setshow(true);
                            setisSubmit(true);
                          },
                        }),
                      ]}
                      localization={{
                        body: {
                          emptyDataSourceMessage: "No Teacher Upcoming Lesson List",
                        },
                      }}
                    />
                  </ThemeProvider>
                </div>
                <Modal show={show} centered onHide={() => handleModal()}>
                  <Modal.Body id="contained-modal-title-vcenter">
                    <div className="container py-3">
                      <div className="row flex-direction-row">
                        <h3 className=" d-flex justify-content-center align-self-center ">Teachers List</h3>
                      </div>
                      <div className="mt-3">
                        <Row>
                          <Form className="category-form-style" onSubmit={() => submitForm()}>
                            <Form.Group className="form-row mb-3" style={{ width: "100%" }}>
                              <Form.Label notify={true} className="label-top">
                                Teachers
                              </Form.Label>
                              <Select
                                value={teacherName}
                                styles={customStyles}
                                placeholder="Assign Teachers..."
                                onChange={(e) => {
                                  setTeacherName(e);
                                  setTeacherId(e.value);
                                }}
                                options={[
                                  {
                                    options: approvedTeachers.map((list) => ({
                                      value: list.id,
                                      label: (
                                        <div>
                                          {list.imageUrl ? (
                                            <div className="d-flex justify-content-start align-items-center">
                                              <Avatar src={list.imageUrl} alr="" round={true} />
                                              <div className="dropdown-names">
                                                {`${list.firstName +
                                                  " " +
                                                  list.middleName +
                                                  " " +
                                                  list.lastName +
                                                  " "}`}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="d-flex justify-content-start align-items-center">
                                              <Avatar round size="38" className="d-flex justify-content-center">
                                                <p className="dropdown-option mb-0">
                                                  {list?.firstName.substring(0, 1)}
                                                  {list.middleName
                                                    ? list?.middleName.substring(0, 1)
                                                    : list?.lastName.substring(0, 1)}
                                                </p>
                                              </Avatar>
                                              <div className="dropdown-names">
                                                {`${list.firstName +
                                                  " " +
                                                  list.middleName +
                                                  " " +
                                                  list.lastName +
                                                  " "}`}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ),
                                      name: ` ${list.firstName} ${list.middleName} ${list.lastName}`,
                                    })),
                                  },
                                ]}
                              />
                            </Form.Group>
                          </Form>
                        </Row>
                        <div className="button-div">
                          <Button
                            className={`${teacherName !== "" && isSubmit ? "submit-button" : "disable-submit-button"}`}
                            variant="contained"
                            disabled={teacherName === ""}
                            onClick={() => submitForm()}
                          >
                            SAVE CHANGES
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
export default UpcomingTeacherScheduleList;
