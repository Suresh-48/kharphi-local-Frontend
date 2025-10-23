import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { Container, Dropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

// Roles
import { ROLES_PARENT, ROLES_STUDENT } from "../../constants/roles";

// Api
import Api from "../../Api";

// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

// Component
import { tableIcons } from "../core/TableIcons";
import Loader from "../core/Loader";

function CompletedCourseHistory() {
  const role = localStorage.getItem("role");
  const [isLoading, setisLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [studentId, setStudentId] = useState("");
  const userId = localStorage.getItem("userId");
  const history = useHistory();

  const isParent = role === ROLES_PARENT;
  const isStudent = role === ROLES_STUDENT;

  // Style
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

  const parentColumns = [
    {
      title: "S.No",
      width: "5%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Student Name",
      render: (rowData) => `${rowData.studentId.firstName + " " + rowData.studentId.lastName}`,
    },
    {
      title: "Day",
      field: "courseScheduleId.weeklyOn",
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
      title: "Teacher Name",
      render: (rowData) =>
        `${rowData.courseScheduleId.teacherId.firstName + " " + rowData.courseScheduleId.teacherId.lastName}`,
    },
    {
      title: "Purchase Time",
      field: "createdAt",
    },
    {
      title: "Amount",
      field: "payment",
    },
  ];

  const studentColumns = [
    {
      title: "S.No",
      width: "5%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Day",
      field: "courseScheduleId.weeklyOn",
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
      title: "Teacher Name",
      render: (rowData) =>
        `${rowData.courseScheduleId.teacherId.firstName + " " + rowData.courseScheduleId.teacherId.lastName}`,
    },
    {
      title: "Amount",
      field: "payment",
    },
  ];

  // Log out
  const logout = () => {
     setTimeout(() => {
       localStorage.clear(history.push("/kharpi"));
       window.location.reload();
     }, 2000);
  };

  const getCourseHistoryData = () => {
    const parentId = localStorage.getItem("parentId");
    const studentId = localStorage.getItem("studentId");
    setStudentId(studentId);
    Api.get(`api/v1/${isParent ? "parent" : "student"}/courseHistory/${isParent ? parentId : studentId}`, {
      headers: { userId: userId },
    })
      .then((response) => {
        const data = response.data.courseHistory;
        setData(data);
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

  useEffect(() => {
    getCourseHistoryData();
  }, []);

  return (
    <div className="mb-3">
      {isLoading ? (
        <Loader />
      ) : (
        <Container className="mt-0 mb-3">
          <div className="py-3">
            <h4>Course History</h4>
          </div>
          <div className="material-table-responsive">
            <ThemeProvider theme={tableTheme}>
              <MaterialTable
                icons={tableIcons}
                columns={isParent ? parentColumns : studentColumns}
                data={data}
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
                  (rowData) => {
                    return {
                      icon: () => (
                        <Dropdown>
                          <Dropdown.Toggle className="teacher-menu-dropdown" varient="link">
                            <FontAwesomeIcon icon={faEllipsisV} size="sm" color="#397ad4" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu right className="menu-dropdown-status py-0">
                            <Dropdown.Item className="status-list">
                              <Link
                                to={{
                                  pathname: `/upcoming/schedule/list/${rowData.studentId._id}`,
                                  state: {
                                    studentId: rowData.studentId._id,
                                    firstName: rowData?.studentId?.firstName,
                                    lastName: rowData?.studentId?.lastName,
                                  },
                                }}
                                className="collapse-text-style"
                              >
                                View Schedules
                              </Link>
                            </Dropdown.Item>
                            <hr />
                            <Dropdown.Item className="status-list">
                              <Link
                                to={{
                                  pathname: `/teacher/profile/view`,
                                  state: {
                                    teacherId: rowData.courseScheduleId.teacherId._id,
                                  },
                                }}
                                className="collapse-text-style"
                              >
                                View Teacher Details
                              </Link>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      ),
                      onClick: (event, rowData) => {
                        setIsOpen(!isOpen);
                      },
                    };
                  },
                ]}
                localization={{
                  body: {
                    emptyDataSourceMessage: "Courses Yet To Be Enroll",
                  },
                }}
              />
            </ThemeProvider>
          </div>
        </Container>
      )}
    </div>
  );
}

export default CompletedCourseHistory;
