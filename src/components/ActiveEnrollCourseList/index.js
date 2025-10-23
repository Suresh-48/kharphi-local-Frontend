import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";

import { ROLES_PARENT, ROLES_STUDENT, ROLES_TEACHER } from "../../constants/roles";

// Component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";
import Api from "../../Api";
import { toast } from "react-toastify";

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

export default function ActiveEnrollCourseList() {
  const [isLoading, setisLoading] = useState(true);
  const [activeCourse, setactiveCourse] = useState([]);
  const [role, setrole] = useState("");
  const userId = localStorage.getItem("userId");
  const history = useHistory();

  const isStudent = role === ROLES_STUDENT;
  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Student Column Heading
  const columns = [
    {
      title: "S.No",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Category",
      field: "courseId.category.name",
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
      title: "Start Date",
      field: "courseScheduleId.startDate",
    },
    {
      title: "Weekly On",
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
  ];

  // Parent Column List
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
      title: "Category",
      field: "courseId.category.name",
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
      title: "Start Date",
      field: "courseScheduleId.startDate",
    },
    {
      title: "Weekly On",
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
  ];

  useEffect(() => {
    const role = localStorage.getItem("role");
    setrole(role);
    const studentId = localStorage.getItem("studentId");
    const parentId = localStorage.getItem("parentId");
    const query =
      role === ROLES_STUDENT ? { studentId: studentId, userId: userId } : { parentId: parentId, userId: userId };
    Api.get(`api/v1/student/activeCourse/list`, {
      params: query,
    })
      .then((response) => {
        const data = response.data.listData;
        setactiveCourse(data);
        setisLoading(false);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container className="my-3">
          <div className="py-3">
            <h5>Active Enroll Course List</h5>
          </div>
          <ThemeProvider theme={tableTheme}>
            <div className="material-table-responsive">
              <MaterialTable
                icons={tableIcons}
                data={activeCourse}
                columns={isStudent ? columns : parentColumns}
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
                    emptyDataSourceMessage: "No Active Courses",
                  },
                }}
              />
            </div>
          </ThemeProvider>
        </Container>
      )}
    </div>
  );
}
