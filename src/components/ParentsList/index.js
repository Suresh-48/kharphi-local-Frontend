import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { Container, Row, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import ParentPublicProfile from "../ParentPublicProfile";

// Api
import Api from "../../Api";

//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faUserCircle } from "@fortawesome/free-solid-svg-icons";

// Component
import { tableIcons } from "../core/TableIcons";

//Loader
import Loader from "../../components/core/Loader";

//css
import "../../css/ParentList.scss";
import { toast } from "react-toastify";

function ParentsList(props) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const [parentId, setParentId] = useState("");
  const [show, setshow] = useState(false);
  const userId = localStorage.getItem("userId");

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
                setParentId(rowData.id);
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
      title: "No. Of Students Enrolled",
      field: "totalStudentEnroll",
      cellStyle: { textAlign: "center", width: "350px" },
      headerStyle: { textAlign: "center" },
    },
  ];

  // Get Parent List
  const ParentsListData = () => {
    Api.get("api/v1/parent/", { headers: { userId: userId } })
      .then((res) => {
        const data = res.data.data.data;
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
    ParentsListData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Row>
            <h3>Parents</h3>
          </Row>
          <div className="material-table-responsive">
            <ThemeProvider theme={tableTheme}>
              <MaterialTable
                title="Parent Information"
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
                columns={columns}
                data={data}
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
                          textAlign: "center",
                        }}
                      >
                        View Students
                      </p>
                    ),
                    tooltip: "View Student List",
                    onClick: (event, rowData) => {
                      history.push({
                        pathname: `/student/list/${rowData.id}`,
                      });
                    },
                  },
                ]}
                localization={{
                  body: {
                    emptyDataSourceMessage: "No Parents List",
                  },
                }}
              />
            </ThemeProvider>
          </div>
        </Container>
      )}
      <Modal
        show={show}
        onHide={() => handleModal()}
        dialogClassName="popup-container-Style"
      >
        <Modal.Header closeButton className="popup-header-close-style" />
        <Modal.Body
          id="contained-modal-title-vcenter "
          className="popup-body-style"
        >
          <ParentPublicProfile parentId={parentId} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ParentsList;
