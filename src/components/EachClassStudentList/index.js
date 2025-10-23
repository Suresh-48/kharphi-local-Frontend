import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { Container,  Modal } from "react-bootstrap";

// Api
import Api from "../../Api";

// Component
import { tableIcons } from "../core/TableIcons";
import Loader from "../../components/core/Loader";
import StudentPublicProfile from "../StudentPublicProfile";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

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

// Column Heading
const columns = [
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
    title: "Email",
    field: "studentId.email",
  },
];

function EachClassStudentList(props) {
  const [scheduleId, setscheduleId] = useState(props?.match?.params?.id);
  const [data, setdata] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [studentId, setStudentId] = useState("");
  const [show, setshow] = useState(false);
  const userId = localStorage.getItem("userId");
  const history = useHistory();

  //logout
  const logout = () => {
     setTimeout(() => {
       localStorage.clear(history.push("/kharpi"));
       window.location.reload();
     }, 2000);
  };

  const getStudentListForClass = () => {
    Api.get(`api/v1/teacher/schedule/student/list`, {
      params: {
        scheduleId: scheduleId,
        userId: userId,
      },
    })
      .then((response) => {
        const studentList = response.data.studentList;
        setdata(studentList);
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

  const handleModal = () => {
    setshow(false);
  };

  useEffect(() => {
    getStudentListForClass();
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <div className="d-flex justify-content-center pt-3">
            <h5>Student List For Class</h5>
          </div>
          <div className="material-table-responsive">
            <ThemeProvider theme={tableTheme}>
              <MaterialTable
                icons={tableIcons}
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
                columns={columns}
                localization={{
                  body: {
                    emptyDataSourceMessage: "No Student List To Display",
                  },
                }}
                actions={[
                  (rowData) => ({
                    icon: () => <p className={"zoom-view-style"}>View Student Details</p>,
                    tooltip: "Student Details",
                    onClick: (event, rowData) => {
                      setStudentId(rowData.studentId._id);
                      setshow(true);
                    },
                  }),
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
export default EachClassStudentList;
