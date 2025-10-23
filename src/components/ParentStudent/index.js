import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Modal,
  Button,
  Dropdown,
  Spinner,
  Form,
} from "react-bootstrap";
import AddBox from "@material-ui/icons/AddBox";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";

// Styles
import "../../css/ParentStudent.scss";

// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

// Component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";

// Api
import Api from "../../Api";

function ParentStudent(props) {
  const [show, setshow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const parent = localStorage.getItem("parentId");
  const [studentList, setstudentList] = useState([]);
  const [parentId, setparentId] = useState(parent);
  const [studentData, setstudentData] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [colId, setColId] = useState("");
  const [spinner, setspinner] = useState(false);
  const userId = localStorage.getItem("userId");

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  const ToggleButton = () => setIsOpen(!isOpen);

  // Styles
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

  // Get Student Details
  const getStudentDetails = () => {
    Api.get("api/v1/parent/student/list", {
      params: {
        parentId: parentId,
        userId: userId,
      },
    })
      .then((response) => {
        const data = response.data.data.studentList;
        setstudentList(data);
        setIsLoading(false);
        setspinner(false);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  useEffect(() => {
    getStudentDetails();
  }, []);

  const inactiveStatus = (studentId, activeStatus) => {
    Api.post(`api/v1/parent/student/activeStatus`, {
      studentId: studentId,
      activeStatus: activeStatus,
      userId: userId,
    })
      .then((res) => {
        getStudentDetails();
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
        }
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
        toast.error(error.response.data.message);
        setspinner(false);
      });
  };

  // Column Heading
  const columns = [
    {
      title: "S.No",
      width: "5%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "First Name",
      field: "firstName",
    },
    {
      title: "Last Name",
      field: "lastName",
    },
    {
      title: "Age",
      field: "age",
    },
    {
      title: "Email",
      field: "email",
    },
    {
      title: "Course Count",
      field: "totalCourseEnrolled",
    },
    {
      title: "InActive",
      render: (rowData) => (
        <Form>
          <Form.Check
            style={{ padding: "0px" }}
            color="red"
            type="switch"
            id="custom-switch"
            checked={rowData?.activeStatus}
            onChange={(e) => {
              setspinner(true);
              inactiveStatus(rowData.id, rowData.activeStatus);
            }}
          />
        </Form>
      ),
    },
  ];

  const handleModal = () => {
    setshow(false);
  };

  // Delete Student
  const deleteStudent = () => {
    Api.delete(`api/v1/parent/remove/student/${studentData?.id}`, {
      headers: { userId: userId },
    })
      .then((response) => {
        setshow(false);
        getStudentDetails();
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
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <Row>
            <Col className="materialtableps">
              <div className="d-flex justify-content-center align-items-center pb-3">
                <h4>Student List</h4>
              </div>
              <div className="material-table-responsive">
                <ThemeProvider theme={tableTheme}>
                  <MaterialTable
                    style={{ width: "100%", marginBottom: "10px" }}
                    icons={tableIcons}
                    options={{
                      showTitle: false,
                      actionsColumnIndex: -1,
                      addRowPosition: "last",
                      headerStyle: {
                        fontWeight: "bold",
                        backgroundColor: "#1d1464",
                        color: "white",
                        zIndex: 0,
                      },
                    }}
                    actions={[
                      {
                        icon: () => <AddBox style={{ color: "#1d1464" }} />,
                        tooltip: "Add student",
                        isFreeAction: true,
                        onClick: (event, rowData) => {
                          history.push({
                            pathname: "/student/signup",
                          });
                        },
                      },
                      (rowData) => {
                        return rowData?.totalCourseEnrolled === 0
                          ? {
                              icon: () => (
                                <FontAwesomeIcon
                                  icon={faTrashAlt}
                                  className="delect-icon-style"
                                  color={"#ba2727"}
                                />
                              ),
                              disable: true,
                              onClick: (event, rowData) => {
                                setshow(true);
                                setstudentData(rowData);
                              },
                              tooltip: "Delete",
                            }
                          : {
                              icon: () => (
                                <FontAwesomeIcon
                                  icon={faTrashAlt}
                                  className="delect-icon-style"
                                  color={"#868686"}
                                />
                              ),
                              disable: false,
                              onClick: (rowData) => {},
                              tooltip: "Delete",
                            };
                      },
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
                                        pathname: `/edit/student/details/${rowData.id}`,
                                        state: { studentId: rowData.id },
                                      }}
                                      className="collapse-text-style"
                                    >
                                      View & Edit Student Details
                                    </Link>
                                  </Dropdown.Item>
                                  <hr />
                                  <Dropdown.Item className="status-list">
                                    <Link
                                      to={{
                                        pathname: `/upcoming/schedule/list/${rowData.id}`,
                                        state: {
                                          studentId: rowData.id,
                                          firstName: rowData.firstName,
                                          lastName: rowData.lastName,
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
                                        pathname: `/student/transcript/${rowData.id}`,
                                        state: { studentId: rowData.id },
                                      }}
                                      className="collapse-text-style"
                                    >
                                      View Mark Details
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
                    columns={columns}
                    data={studentList}
                    localization={{
                      body: {
                        emptyDataSourceMessage: "No Student Record",
                      },
                    }}
                  />
                </ThemeProvider>
              </div>
              <Modal
                show={show}
                centered
                className="modal-main-content"
                onHide={() => handleModal()}
              >
                <Modal.Body id="contained-modal-title-vcenter">
                  <div className="delete-content my-4">
                    <div className="mb-4">
                      <h6 className="alert-text">
                        {`Are you sure want to delete " ${studentData?.firstName} ${studentData?.lastName} " account `}
                      </h6>
                    </div>
                    <Row>
                      <Col>
                        <Button
                          className="Kharpi-cancel-btn"
                          variant="outline-secondary"
                          onClick={() => handleModal()}
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          className="confirmation-button Kharpi-save-btn"
                          variant="light"
                          onClick={() => deleteStudent()}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Modal.Body>
              </Modal>
            </Col>
          </Row>
        )}
      </Container>
      {spinner && (
        <div className="spanner">
          <Spinner animation="grow" variant="light" />
          <span>
            <h4 style={{ paddingLeft: 20 }}>Loading...</h4>
          </span>
        </div>
      )}
    </div>
  );
}

export default ParentStudent;
