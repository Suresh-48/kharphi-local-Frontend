import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

// Styles
import "../../css/StudentList/_StudentList.scss";

// Api
import Api from "../../Api";

// Component
import { tableIcons } from "../core/TableIcons";
import Loader from "../../components/core/Loader";
import { toast } from "react-toastify";

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

function StudentList(props) {
  const [parentId, setparentId] = useState(props?.match?.params?.id);
  const [details, setdetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const userId = localStorage.getItem("userId");
  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  const getStudentListData = () => {
    Api.get("api/v1/parent/student/list", {
      params: {
        parentId: parentId,
        userId: userId,
      },
    })
      .then((response) => {
        const data = response.data.data.studentList;
        setdetails(data);
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

  useEffect(() => {
    getStudentListData();
  }, []);

  const columns = [
    {
      title: "S.No",
      field: "",
      render: (rowData) => rowData.tableData.id + 1,
      width: "3%",
    },
    { title: "FirstName", field: "firstName" },
    { title: "LastName", field: "lastName" },
    { title: "Email", field: "email" },
    { title: "Course Count", field: "totalCourseEnrolled" },
  ];

  return (
    <div className="student-margin">
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Row className="pt-3">
            <h3 className="student-title">Student List</h3>
          </Row>
          <div className="material-table-responsive">
            <ThemeProvider theme={tableTheme}>
              <MaterialTable
                icons={tableIcons}
                data={details}
                columns={columns}
                options={{
                  showTitle: false,
                  headerStyle: {
                    minWidth: "150px",
                    fontWeight: "bold",
                    backgroundColor: "#1d1464",
                    color: "white",
                    zIndex: 0,
                  },
                  actionsColumnIndex: -1,
                  addRowPosition: "last",
                }}
                localization={{
                  body: {
                    emptyDataSourceMessage: "No Student List",
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
                        }}
                      >
                        View Schedule
                      </p>
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
    </div>
  );
}

export default StudentList;
