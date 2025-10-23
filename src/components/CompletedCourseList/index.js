import MaterialTable from "material-table";
import React, { useState } from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { Container } from "react-bootstrap";

// Component
import { tableIcons } from "../core/TableIcons";
import Loader from "../core/Loader";
import { useHistory } from "react-router-dom";

function CompletedCourseList() {
  const [isLoading, setisLoading] = useState(false);
  const token = localStorage.getItem("token");
  const history = useHistory();

  // Log out
  const logout = () => {
     setTimeout(() => {
       localStorage.clear(history.push("/kharpi"));
       window.location.reload();
     }, 2000);
  };

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

  const columns = [
    {
      title: "S.No",
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
      title: "Course Category",
      field: "courseCategory",
    },
    {
      title: "Course Name",
      field: "courseName",
    },
    {
      title: "Email",
      field: "email",
    },
    {
      title: "No. Of Course Completed",
      field: "",
    },
  ];
  const data = [
    {
      firstName: "Sarvesh",
      lastName: "kumar",
    },
  ];

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container className="my-5">
          <div className="d-flex justify-content-center align-items-center py-3">
            <h4>Student Completed Course list</h4>
          </div>
          <div className="material-table-responsive">
            <ThemeProvider theme={tableTheme}>
              <MaterialTable
                icons={tableIcons}
                columns={columns}
                data={data}
                options={{
                  actionsColumnIndex: -1,
                  addRowPosition: "last",
                  headerStyle: {
                    fontWeight: "bold",
                    backgroundColor: "#CCE6FF",
                    zIndex: 0,
                  },
                  showTitle: false,
                }}
                localization={{
                  body: {
                    emptyDataSourceMessage: "No Completed Course History",
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

export default CompletedCourseList;
