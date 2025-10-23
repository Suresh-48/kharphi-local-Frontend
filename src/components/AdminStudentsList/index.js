import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
// Component
import { tableIcons } from "../core/TableIcons";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { Container, Row, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";

//css
import "../../css/AdminStudentsList.scss";

// Api
import Api from "../../Api";

// Loader
import Loader from "../../components/core/Loader";
import StudentPublicProfile from "../StudentPublicProfile";
import { toast } from "react-toastify";

function AdminStudentsList(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [show, setshow] = useState(false);
  const [studentId, setStudentId] = useState("");
  const history = useHistory();
  const userId = localStorage.getItem("userId");

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

  const columns = [
    {
      title: "S.No",
      render: (rowData) => rowData.tableData.id + 1,
      width: "3%",
    },
    {
      title: "Name",
      cellStyle: { textAlign: "center" },
      headerStyle: { textAlign: "center" },
      render: (rowData) => (
        <div className="linkColor">
          <u>
            <text
              onClick={() => {
                setStudentId(rowData.id);
                setshow(true);
              }}
            >
              {`${rowData.firstName} ${rowData.lastName}`}
            </text>
          </u>
        </div>
      ),
    },
    {
      title: "Email",
      field: "email",
      cellStyle: { textAlign: "center" },
      headerStyle: { textAlign: "center" },
    },
    {
      title: "Course Enrolled",
      field: "totalCourseEnrolled",
      cellStyle: { textAlign: "center" },
      headerStyle: { textAlign: "center" },
    },
  ];

  // Log out
  const logout = () => {
     setTimeout(() => {
       localStorage.clear(history.push("/kharpi"));
       window.location.reload();
     }, 2000);
  };

  const getAdminStudentsList = () => {
    Api.get("api/v1/student", { headers: { userId: userId } })
      .then((response) => {
        const data = response?.data?.data?.data;
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

  const handleModal = () => {
    setshow(false);
  };

  useEffect(() => {
    getAdminStudentsList();
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Row>
            <h3>Students</h3>
          </Row>
          <div className="material-table-responsive">
            <ThemeProvider theme={tableTheme}>
              <MaterialTable
                columns={columns}
                data={data}
                style={{ marginBottom: "10px" }}
                icons={tableIcons}
                options={{
                  showTitle: false,
                  headerStyle: {
                    backgroundColor: "#1d1464",
                    color: "white",
                    zIndex: 0,
                    fontWeight: "bold",
                    minWidth: "150px",
                  },
                  actionsColumnIndex: -1,
                  addRowPosition: "last",
                }}
                localization={{
                  body: {
                    emptyDataSourceMessage: "No Students List",
                  },
                }}
                actions={[
                  {
                    icon: () => (
                      <p
                        className="enroll-style"
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          marginBottom: 0,
                          color: "#375474",
                          textAlign: "left",
                        }}
                      >
                        View Schedule
                      </p>
                      // <FontAwesomeIcon icon={faEye} size="sm" color="#375474" />
                    ),
                    onClick: (event, rowData) => {
                      history.push({
                        pathname: `/upcoming/schedule/list/${rowData.id}`,
                        state: {
                          firstName: rowData.firstName,
                          lastName: rowData.lastName,
                        },
                      });
                    },
                    tooltip: "View Upcoming Course Schedule",
                  },
                ]}
              />
            </ThemeProvider>
          </div>
        </Container>
      )}
      <Modal show={show} onHide={() => handleModal()} dialogClassName="popup-container-Style">
        <Modal.Header closeButton className="popup-header-close-style" />
        <Modal.Body id="contained-modal-title-vcenter " className="popup-body-style">
          <StudentPublicProfile studentId={studentId} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminStudentsList;
