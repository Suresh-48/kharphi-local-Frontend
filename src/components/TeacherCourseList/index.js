import React, { useState, useEffect } from "react";
import { tableIcons } from "../core/TableIcons";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/styles";
import { Link, useHistory } from "react-router-dom";
import { Container, Dropdown } from "react-bootstrap";
import { createTheme } from "@material-ui/core/styles";

// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

// Api
import Api from "../../Api";
import Loader from "../core/Loader";
import { ROLES_ADMIN } from "../../constants/roles";
import { toast } from "react-toastify";

const columns = [
  { title: "S.No", render: (rowdata) => `${rowdata.tableData.id + 1}` },
  {
    title: "Category",
    field: "courseId.category.name",
  },
  {
    title: "CourseName",
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
    title: "StartDate",
    field: "startDate",
  },
  {
    title: "Weekly On",
    field: "weeklyOn",
  },
  {
    title: "Start Time",
    field: "startTime",
  },
  {
    title: "End Time",
    field: "endTime",
  },
];

function TeacherCourseList(props) {
  const [teacherId, setTeacherId] = useState(props?.match?.params?.id);
  const [firstName, setfirstName] = useState(
    props?.location?.state?.rowData?.firstName
  );
  const [lastName, setlastName] = useState(
    props?.location?.state?.rowData?.lastName
  );
  const [data, setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("");
  const [colId, setColId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const userId = localStorage.getItem("userId");
  const history = useHistory();

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  const ToggleButton = () => setIsOpen(!isOpen);

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

  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role);
    getTeacherScheduleList();
  }, []);

  const isAdmin = role === ROLES_ADMIN;

  const getTeacherScheduleList = () => {
    Api.get(`api/v1/teacher/course/list`, {
      params: {
        teacherId: teacherId,
        userId: userId,
      },
    })
      .then((response) => {
        const data = response.data.teacherCourses;
        setdata(data);
        setIsLoading(false);
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
      <Container className="mb-3">
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            {isAdmin ? (
              <div className="d-flex justify-content-center align-items-center py-3">
                <h5>{`${firstName + " " + lastName}`} Schedule List</h5>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center py-3">
                <h5> Schedule List</h5>
              </div>
            )}
            <div className="material-table-responsive">
              <ThemeProvider theme={tableTheme}>
                <MaterialTable
                  icons={tableIcons}
                  columns={columns}
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
                  data={data}
                  actions={[
                    (rowData) => {
                      return {
                        icon: () => (
                          <Dropdown>
                            <Dropdown.Toggle
                              className="teacher-menu-dropdown"
                              varient="link"
                            >
                              <FontAwesomeIcon
                                icon={faEllipsisV}
                                size="sm"
                                color="#397ad4"
                              />
                            </Dropdown.Toggle>
                            {colId === rowData.id ? (
                              <Dropdown.Menu
                                right
                                className="menu-dropdown-status py-0"
                              >
                                <Dropdown.Item className="status-list">
                                  <Link
                                    to={{
                                      pathname: `/upcoming/schedule/${colId}`,
                                      state: {
                                        rowData,
                                      },
                                    }}
                                    className="collapse-text-style"
                                  >
                                    Upcoming Schedule
                                  </Link>
                                </Dropdown.Item>
                                <hr />
                                <Dropdown.Item className="status-list">
                                  <Link
                                    to={{
                                      pathname: `/class/student/list/${rowData.id}`,
                                      state: {
                                        rowData,
                                      },
                                    }}
                                    className="collapse-text-style"
                                  >
                                    Students List
                                  </Link>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            ) : null}
                          </Dropdown>
                        ),
                        onClick: (event, rowData) => {
                          setColId(rowData.id);
                          setIsOpen(!isOpen);
                        },
                      };
                    },
                  ]}
                  localization={{
                    body: {
                      emptyDataSourceMessage:
                        "Teacher Course List Yet to be Schedule",
                    },
                  }}
                />
              </ThemeProvider>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default TeacherCourseList;
