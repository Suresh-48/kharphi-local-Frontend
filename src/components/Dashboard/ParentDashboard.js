import React, { useState, useEffect } from "react";
import { Container, Row, Table, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

// Styles
import DashboardTiles from "../../components/core/DashboardTiles";

// Styles
import "../../css/ParentDashboard.scss";

// Api
import Api from "../../Api";

import Loader from "../core/Loader";
import { toast } from "react-toastify";

function ParentDashboard() {
  const parent = localStorage.getItem("parentId");
  const [parentId, setparentId] = useState(parent);
  const [upcomingData, setUpcomingData] = useState([]);
  const [completeData, setCompeleteData] = useState([]);
  const [studentList, setstudentList] = useState([]);
  const [count, setCount] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  const history = useHistory();

  useEffect(() => {
    getStudentDetails();
    getDashboardDetails();
    getStudentUpcomingSchedule();
    getStudentCompletedSchedule();

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

  //get student upcoming schedule

  const getStudentUpcomingSchedule = () => {
    Api.get("api/v1/upcomingcourse/parent/list", {
      params: {
        parentId: parentId,
      },
    }).then((response) => {
      const dataValues = response?.data?.upcomingList;
      dataValues.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setUpcomingData(dataValues);
      setisLoading(false);
    });
  };

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  const getStudentCompletedSchedule = () => {
    const parentId = localStorage.getItem("parentId");
    Api.get("api/v1/upcomingcourse/parent/complete/list", {
      params: {
        parentId: parentId,
      },
    }).then((response) => {
      const completeData = 0;
      setCompeleteData(completeData);
    });
  };

  // get Student Details
  const getStudentDetails = () => {
    setparentId(parentId);
    Api.get("api/v1/parent/student/list", {
      params: {
        parentId: parentId,
        userId: userId,
      },
    })
      .then((res) => {
        const data = res?.data?.data?.studentList;
        setstudentList(data);
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

  // Get Details
  const getDashboardDetails = () => {
    Api.get("api/v1/dashboard/parent/", {
      params: {
        parentId: parentId,
        userId: userId,
      },
    })
      .then((res) => {
        const data = res?.data?.data;
        setCount(data);
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
        <Container className="mt-0">
          <Row className=" pt-0">
            <DashboardTiles label="Student" count={count?.totalStudent} url="/parent/student" />

            <DashboardTiles
              className="parent-dashbord-classname"
              label="Active Enrolled Courses"
              count={count.activeCourse}
              url="/active/enroll/course/list"
            />

            <DashboardTiles label="Completed Courses" count={count.completeCourse} url="/completed/course/list" />
          </Row>

          <Row className="mt-5" style={{ minHeight: "227px" }}>
            <div className="d-flex justify-content-between">
              <div>
                <h5>Upcoming Schedule </h5>
              </div>

              <div>
                <Button
                  variant="primary Kharpi-save-btn"
                  className="w-100 px-5"
                  onClick={() => history.push("/course/search")}
                >
                  Enroll
                </Button>
              </div>
            </div>
            <Table striped bordered hover className="student-table" responsive>
              <thead>
                <tr className="viewRow">
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Course Name</th>
                  <th>Lesson Name</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {upcomingData?.length > 0 ? (
                  upcomingData.slice(0, 5).map((list, i) => (
                    <tr className="viewRow">
                      <td>{i + 1}</td>
                      <td>{list?.studentId?.firstName + " " + list?.studentId?.lastName}</td>
                      <td>{list?.lessonDate}</td>
                      <td>{list?.courseScheduleId?.startTime}</td>
                      <td>{list?.courseScheduleId?.endTime}</td>
                      <td className="linkColor">{list?.courseId?.name}</td>
                      <td>{list?.courseLessonId?.lessonName}</td>
                      <td>{list?.courseId?.duration + " hour"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="colspan-data-alignment">
                      <h6 className="d-flex justify-content-center">No Records to Display</h6>
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
        </Container>
      )}
    </div>
  );
}

export default ParentDashboard;
