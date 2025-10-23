import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Dropdown,
  Col,
  Form,
  Modal,
  Button,
} from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { Tab, Tabs } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Switch from "@mui/material/Switch";
import * as Yup from "yup";
import { Formik, ErrorMessage } from "formik";

// Component
import { toast } from "react-toastify";

// Api
import Api from "../../Api";

// Loader
import Loader from "../../components/core/Loader";
import { tableIcons } from "../core/TableIcons";

// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarWeek, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

//css
import "../../css/TeacherList.scss";
import LabelComponent from "../core/Label";
import { TokenRounded } from "@mui/icons-material";

function TeacherList(props) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [colId, setColId] = useState("");
  const [approvedData, setApprovedData] = useState([]);
  const [value, setValue] = useState(props?.location?.state?.indexCount);
  const [show, setShow] = useState(false);
  const [payment, setPayment] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const userId = localStorage.getItem("userId");

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  const history = useHistory();

  const TeacherPublicActive = (status, teacherId) => {
    Api.patch("api/v1/teacher/update/public", {
      teacherId: teacherId,
      isPublic: status,
      userId: userId,
    })
      .then((res) => {
        getTeacherApprovedListData();
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const handleClose = () => setShow(false);

  const teacherPayment = (values) => {
    setShow(true);
    setTeacherId(values);
  };

  const TeacherSessionAmount = () => {
    Api.patch("api/v1/teacher/teacher/session/amount", {
      teacherId: teacherId,
      teacherSessionAmount: payment,
      userId: userId,
    })
      .then((res) => {
        setShow(false);
        getTeacherApprovedListData();
        toast.success("Session Amount Updated");
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const tableTheme = createTheme({
    overrides: {
      MuiTableRow: {
        root: {
          overflowY: "unset",
          "&:hover": {
            cursor: "pointer",
            backgroundColor: "rgba(224, 224, 224, 1) !important",
          },
        },
      },
    },
  });

  const convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  // Column Heading
  const columns = [
    {
      title: "S.No",
      width: "1%",
      render: (rowData) => `${rowData.tableData.id + 1}`,
    },
    {
      title: "Name",
      render: (rowData) => (
        <Link
          className="linkColor"
          to={{
            pathname: "/teacher/profile/view",
            state: {
              teacherId: rowData.id,
            },
          }}
        >
          {rowData.firstName + " " + rowData.lastName}
        </Link>
      ),
    },
    {
      title: "Email",
      field: "email",
    },
    {
      title: "Speciality",
      field: "speciality",
    },
    {
      title: "Status",
      field: "status",
    },
    {
      title: "Details",
      cellStyle: { color: "#375474" },
      render: (rowData) => (
        <Link
          className="linkColor"
          to={{
            pathname: "/teacher/application",
            state: {
              teacherId: rowData.id,
            },
          }}
        >
          View
        </Link>
      ),
    },
  ];
  const approvedDatacolumn = [
    {
      title: "S.No",
      width: "1%",
      render: (rowData) => `${rowData.tableData.id + 1}`,
    },
    {
      title: "Name",
      render: (rowData) => (
        <Link
          className="linkColor"
          to={{
            pathname: "/teacher/profile/view",
            state: {
              teacherId: rowData.id,
            },
          }}
        >
          {rowData.firstName + " " + rowData.lastName}
        </Link>
      ),
    },
    {
      title: "Email",
      field: "email",
    },
    {
      title: "Speciality",
      field: "speciality",
    },
    {
      title: "Status",
      field: "status",
    },
    {
      title: "Details",
      render: (rowData) => (
        <Link
          className="linkColor"
          to={{
            pathname: "/teacher/application",
            state: {
              teacherId: rowData.id,
            },
          }}
        >
          View
        </Link>
      ),
    },
    {
      title: "Show in Landing Page",
      render: (rowData) => (
        <div>
          <Switch
            aria-label="Switch"
            checked={rowData?.isPublic}
            onChange={(e) => {
              TeacherPublicActive(!rowData.isPublic, rowData.id);
            }}
          />
        </div>
      ),
    },
  ];

  const getTeacherListData = () => {
    Api.get("api/v1/teacher", { headers: { userId: userId } })
      .then((response) => {
        const data = response.data.data.data;
        setData(data);
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

  //get approved teacher list
  const getTeacherApprovedListData = () => {
    Api.get("api/v1/teacher/list").then((response) => {
      const approvedData = response?.data?.teacherList;
      setPayment(approvedData[0]?.teacherSessionAmount);
      setApprovedData(approvedData);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getTeacherListData();
    getTeacherApprovedListData();
  }, []);

  //change publish and draft course type
  const changeTeacherType = (status) => {
    Api.post("api/v1/teacher/status/", {
      teacherId: colId,
      status: status,
      userId: userId,
    })
      .then((response) => {
        if (response.status === 201) {
          getTeacherListData();
          getTeacherApprovedListData();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });

    if (status === "Pending") {
      const status = "Review";
      Api.patch(`api/v1/teacherApplication/status/${colId}`, {
        status: status,
        userId: userId,
      })
        .then((response) => {})
        .catch((error) => {
          const errorStatus = error?.response?.status;
          if (errorStatus === 401) {
            logout();
            toast.error("Session Timeout");
          }
        });
    } else {
      Api.patch(`api/v1/teacherApplication/status/${colId}`, {
        status: status,
        userId: userId,
      })
        .then((response) => {})
        .catch((error) => {
          const errorStatus = error?.response?.status;
          if (errorStatus === 401) {
            logout();
            toast.error("Session Timeout");
          }
        });
    }
  };
  const signin = Yup.object().shape({
    pay: Yup.string().required("Payment Is Required"),
  });

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
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
                    <p className="tab-title">Approved Teachers </p>
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
                    <p className="tab-title">All Teachers </p>
                  </Col>
                </Row>
              }
              style={{ minWidth: "50%" }}
              value={1}
            />
          </Tabs>
          <hr />
          {value === 0 ? (
            <div className="mb-3 mt-5">
              <Row className="pt-3">
                <h5>Approved Teachers </h5>
              </Row>
              <div className="material-table-responsive">
                <ThemeProvider theme={tableTheme}>
                  <MaterialTable
                    style={{ overflowY: "unset" }}
                    icons={tableIcons}
                    columns={approvedDatacolumn}
                    data={approvedData}
                    options={{
                      actionsColumnIndex: -1,
                      addRowPosition: "last",
                      showTitle: false,
                      headerStyle: {
                        backgroundColor: "#1d1464",
                        color: "white",
                        fontWeight: "bold",
                        zIndex: 0,
                      },
                    }}
                    actions={[
                      {
                        icon: () => (
                          <FontAwesomeIcon
                            icon={faCalendarWeek}
                            size="xs"
                            color="#375474"
                          />
                        ),
                        tooltip: "View Teacher Available Time",
                        onClick: (event, rowData) => {
                          history.push({
                            pathname: "/teacher/not-available",
                            state: {
                              rowData: rowData,
                            },
                          });
                        },
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
                                        pathname: "/teacher/profile/view",
                                        state: {
                                          teacherId: colId,
                                        },
                                      }}
                                      className="collapse-text-style "
                                    >
                                      View As Public Page
                                    </Link>
                                  </Dropdown.Item>
                                  <hr />
                                  <Dropdown.Item className="status-list">
                                    <Link
                                      to={{
                                        pathname: `/teacher/edit/${colId}`,
                                      }}
                                      className="collapse-text-style"
                                    >
                                      Edit Teacher Details
                                    </Link>
                                  </Dropdown.Item>
                                  <hr />
                                  <Dropdown.Item className="status-list">
                                    <Link
                                      to={{
                                        pathname: `/teacher/schedule/${colId}`,
                                        state: {
                                          rowData,
                                        },
                                      }}
                                      className="collapse-text-style"
                                    >
                                      View course List
                                    </Link>
                                  </Dropdown.Item>
                                  <hr />
                                  <Dropdown.Item className="status-list">
                                    <Link
                                      to={"#"}
                                      onClick={() => teacherPayment(rowData.id)}
                                      className="collapse-text-style"
                                    >
                                      Session Amount
                                    </Link>
                                  </Dropdown.Item>{" "}
                                  <hr />
                                  <Dropdown.Item className="status-list">
                                    <Link
                                      to={{
                                        pathname: "/teacher/payments",
                                        state: rowData.id,
                                      }}
                                      onClick={() => teacherPayment(rowData.id)}
                                      className="collapse-text-style"
                                    >
                                      Teacher Payment
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
                        emptyDataSourceMessage: "No Approved Teachers ",
                      },
                    }}
                  />
                </ThemeProvider>
              </div>
            </div>
          ) : (
            <div className="mb-3 mt-5">
              <Row className="pt-3">
                <h5>All Teachers </h5>
              </Row>
              <div className="material-table-responsive">
                <ThemeProvider theme={tableTheme}>
                  <MaterialTable
                    style={{ overflowY: "unset" }}
                    icons={tableIcons}
                    columns={columns}
                    data={data}
                    options={{
                      actionsColumnIndex: -1,
                      addRowPosition: "last",
                      showTitle: false,
                      headerStyle: {
                        backgroundColor: "#1d1464",
                        color: "white",
                        fontWeight: "bold",
                        zIndex: 0,
                      },
                    }}
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
                              {colId === rowData.id && isOpen ? (
                                <Dropdown.Menu
                                  right
                                  className="menu-dropdown-status py-0"
                                >
                                  <Dropdown.Item className="status-list">
                                    <Link
                                      to="#"
                                      className="collapse-text-style teacher-dropdown"
                                      onClick={() =>
                                        changeTeacherType("Approved")
                                      }
                                    >
                                      Approve
                                    </Link>
                                  </Dropdown.Item>
                                  <hr />
                                  <Dropdown.Item className="status-list">
                                    <Link
                                      to="#"
                                      className="collapse-text-style teacher-dropdown"
                                      onClick={() =>
                                        changeTeacherType("Pending")
                                      }
                                    >
                                      Pending
                                    </Link>
                                  </Dropdown.Item>
                                  <hr />
                                  <Dropdown.Item className="status-list">
                                    <Link
                                      to="#"
                                      className="collapse-text-style teacher-dropdown"
                                      onClick={() =>
                                        changeTeacherType("Rejected")
                                      }
                                    >
                                      Reject
                                    </Link>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              ) : null}
                            </Dropdown>
                          ),
                          onClick: (event, rowData) => {
                            setColId(rowData.id);
                            setIsOpen(true);
                            setOpen(false);
                          },
                        };
                      },
                    ]}
                    localization={{
                      body: {
                        emptyDataSourceMessage: "No Approved Teachers",
                      },
                    }}
                  />
                </ThemeProvider>
              </div>
            </div>
          )}
          <Modal
            show={show}
            centered
            onHide={handleClose}
            backdrop="static"
            className="p-4"
          >
            <Modal.Header closeButton>
              <Modal.Title>Teacher Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formik
                enableReinitialize={true}
                initialValues={{ pay: payment }}
                validationSchema={signin}
                onSubmit={(values) => TeacherSessionAmount()}
              >
                {(formik) => {
                  const { handleSubmit, handleBlur, handleChange } = formik;
                  return (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <LabelComponent notify={true}>
                          Enter Payment Amount
                        </LabelComponent>

                        <Form.Control
                          name="pay"
                          id="pay"
                          type="number"
                          placeholder="payment Amount"
                          value={payment}
                          onChange={(e) => {
                            setPayment(e.target.value);
                          }}
                          onBlur={handleBlur}
                          className="mt-1"
                        />
                        <ErrorMessage
                          name="pay"
                          component="span"
                          className="error text-danger"
                        />
                      </Form.Group>

                      <Row>
                        <Col className="d-flex justify-content-end">
                          <Button
                            variant="outline-secondary"
                            className="px-4 me-2"
                            onClick={handleClose}
                          >
                            Close
                          </Button>

                          <Button
                            className="px-3 Kharpi-save-btn"
                            variant="primary"
                            type="submit"
                          >
                            Pay Amount ${payment}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  );
                }}
              </Formik>
            </Modal.Body>
          </Modal>
        </Container>
      )}
    </div>
  );
}

export default TeacherList;
