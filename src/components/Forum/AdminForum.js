import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "@material-ui/core";
import { Container, Row, Col, Dropdown, Form } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import MaterialTable from "material-table";
import { tableIcons } from "../core/TableIcons";
import Api from "../../Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../css/AdminForum.scss";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import Loader from "../core/Loader";
import { toast } from "react-toastify";

function AdminForum() {
  const [value, setValue] = useState(0);
  const [approveForum, setApproveForum] = useState([]);
  const [pendingForum, setPendingForum] = useState([]);
  const [closeForum, setCloseForum] = useState([]);
  const [declineForum, setDeclineForum] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const history = useHistory();

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
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

  const columns = [
    {
      title: "S.No",
      width: "1%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Name",
      render: (rowData) =>
        `${rowData?.userId?.firstName} ${rowData?.userId?.lastName}`,
    },
    {
      title: "Thread",

      render: (rowData) => (
        <div
          className="  forum-paragraph"
          dangerouslySetInnerHTML={convertFromJSONToHTML(`${rowData.question}`)}
        ></div>
      ),
    },
    { title: "Course ", field: "courseId.aliasName" },
    { title: "Status", field: "status" },
  ];

  const approvecolumns = [
    {
      title: "S.No",
      width: "1%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Name",
      render: (rowData) =>
        `${rowData?.userId?.firstName} ${rowData?.userId?.lastName}`,
    },
    {
      title: "Thread",

      render: (rowData) => (
        <div
          className="  forum-paragraph"
          dangerouslySetInnerHTML={convertFromJSONToHTML(
            `${rowData?.question}`
          )}
        ></div>
      ),
    },
    { title: "Course ", field: "courseId.aliasName" },
    { title: "Status", field: "status" },
    {
      title: "Enable",
      render: (rowData) => (
        <Form className="d-flex justify-content-center">
          <Form.Check
            style={{ padding: "0px" }}
            color="red"
            type="switch"
            id="custom-switch"
            checked={rowData.isActive}
            onChange={(e) => {
              activeStatus(!rowData.isActive, rowData.id);
            }}
          />
        </Form>
      ),
    },
  ];

  const convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  const getForum = () => {
    Api.get("api/v1/forum/status/list", { headers: { userId: userId } })
      .then((response) => {
        const approveData = response.data.data.approveData;
        const pendingData = response.data.data.pendingData;
        const closeData = response.data.data.closeData;
        const declineData = response.data.data.declineData;
        setApproveForum(approveData);
        setPendingForum(pendingData);
        setCloseForum(closeData);
        setDeclineForum(declineData);
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
  const activeStatus = (status, qustId) => {
    Api.patch("api/v1/forum/chat/status", {
      questionId: qustId,
      isActive: status,
      userId: userId,
    })
      .then((response) => {
        getForum();
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const ChangeType = (status, qusId) => {
    Api.patch("api/v1/forum/status", {
      questionId: qusId,
      status: status,
      userId: userId,
    })
      .then((response) => {
        getForum();
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
    getForum();
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container className="mb-3">
          <Tabs
            value={value}
            indicatorColor="primary"
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <Tab
              label="Approved"
              className="tab-title"
              value={0}
              style={{ minWidth: "25%" }}
            />
            <Tab
              label="Pending"
              className="tab-title"
              value={1}
              style={{ minWidth: "25%" }}
            />
            <Tab
              label="Closed"
              className="tab-title"
              value={2}
              style={{ minWidth: "25%" }}
            />
            <Tab
              label="Declined"
              className="tab-title"
              value={3}
              style={{ minWidth: "25%" }}
            />
          </Tabs>
          <hr />
          {/* {value === 0 ? ( */}
          <div>
            {value === 0 ? (
              <Row className="pt-3">
                <h5>Approved Forums</h5>
              </Row>
            ) : value === 1 ? (
              <Row className="pt-3">
                <h5>Pending Forums</h5>
              </Row>
            ) : value === 2 ? (
              <Row className="pt-3">
                <h5>Closed Forums</h5>
              </Row>
            ) : value === 3 ? (
              <Row className="pt-3">
                <h5>Declined Forums</h5>
              </Row>
            ) : null}
            <div className="material-table-responsive">
              <ThemeProvider theme={tableTheme}>
                <MaterialTable
                  style={{ overflowY: "unset" }}
                  icons={tableIcons}
                  columns={value === 0 ? approvecolumns : columns}
                  data={
                    value === 0
                      ? approveForum
                      : value === 1
                      ? pendingForum
                      : value === 2
                      ? closeForum
                      : value === 3 && declineForum
                  }
                  options={{
                    actionsColumnIndex: -1,
                    addRowPosition: "last",
                    showTitle: false,
                    headerStyle: {
                      backgroundColor: "#1d1464",
                      color: "white",
                      fontWeight: "bold",
                      zIndex: 0,
                      textAlign: "center",
                    },
                  }}
                  actions={[
                    (rowData) => {
                      return {
                        icon: () => (
                          <Dropdown>
                            <Dropdown.Toggle
                              className="Admin-forum"
                              varient="link"
                            >
                              <FontAwesomeIcon
                                icon={faEllipsisV}
                                size="sm"
                                color="#397ad4"
                              />
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                              right
                              className="admin-forum-color py-0"
                            >
                              {value === 0 ? (
                                " "
                              ) : (
                                <Dropdown.Item className="Admin-forum-list">
                                  <Link
                                    to="#"
                                    className="Admin-forum-text-style admin-dropdown"
                                    onClick={(e) => {
                                      ChangeType("Approved", rowData.id);
                                    }}
                                  >
                                    Approve
                                  </Link>{" "}
                                </Dropdown.Item>
                              )}
                              <hr />
                              {value === 1 ? (
                                " "
                              ) : (
                                <Dropdown.Item className="Admin-forum-list">
                                  <Link
                                    to="#"
                                    className="Admin-forum-text-style admin-dropdown"
                                    onClick={() => {
                                      ChangeType("Pending", rowData.id);
                                    }}
                                  >
                                    Pending
                                  </Link>{" "}
                                </Dropdown.Item>
                              )}
                              <hr />
                              {value === 2 ? (
                                " "
                              ) : (
                                <Dropdown.Item className="Admin-forum-list">
                                  <Link
                                    to="#"
                                    className="Admin-forum-text-style admin-dropdown"
                                    onClick={() => {
                                      ChangeType("Close", rowData.id);
                                    }}
                                  >
                                    Close
                                  </Link>{" "}
                                </Dropdown.Item>
                              )}
                              <hr />
                              {value == 3 ? (
                                " "
                              ) : (
                                <Dropdown.Item className="Admin-forum-list">
                                  <Link
                                    to="#"
                                    className="Admin-forum-text-style admin-dropdown"
                                    onClick={() => {
                                      ChangeType("Declined", rowData.id);
                                    }}
                                  >
                                    Decline
                                  </Link>{" "}
                                </Dropdown.Item>
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        ),
                      };
                    },
                  ]}
                  localization={{
                    body: {
                      emptyDataSourceMessage: "No Threads ",
                    },
                  }}
                />
              </ThemeProvider>
            </div>
          </div>
        </Container>
      )}
    </div>
  );
}
export default AdminForum;
