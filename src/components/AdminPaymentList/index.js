import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

// Styles
import "../../css/AdminPaymentList.scss";

// Api
import Api from "../../Api";

// Component
import { tableIcons } from "../core/TableIcons";

//Loader
import Loader from "../../components/core/Loader";
import { toast } from "react-toastify";

function AdminPaymentList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const history = useHistory();

  // Column Heading
  const columns = [
    {
      title: "S.No",
      render: (rowData) => `${rowData.tableData.id + 1}`,
    },
    {
      title: "Name",
      render: (rowData) => `${rowData.firstName + " " + rowData.lastName}`,
    },
    {
      title: "Phone Number",
      field: "phone",
    },
    {
      title: "Email",
      field: "email",
    },
    {
      title: "Course Name",
      field: "courseId.name",
    },
    {
      title: "Start Time",
      field: "courseScheduleId.startTime",
    },
    {
      title: "End Time",
      field: "courseScheduleId.endTime",
    },
    {
      title: "Payment",
      render: (rowData) => `${"$" + rowData.payment}`,
    },
  ];

  // Table Styles
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

  // Log out
  const logout = () => {
     setTimeout(() => {
       localStorage.clear(history.push("/kharpi"));
       window.location.reload();
     }, 2000);
  };

  // Get Payment List
  const getAdminPaymentList = () => {
    Api.get("api/v1/dashboard/admin/billing/detail", {
      headers: {
        userId: userId,
      },
    })
      .then((response) => {
        const data = response.data.data;
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

  useEffect(() => {
    getAdminPaymentList();
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container className="mb-3">
          <Row>
            <h5>Course Payments</h5>
          </Row>
          <div className="material-table-responsive">
            <ThemeProvider theme={tableTheme}>
              <MaterialTable
                icons={tableIcons}
                columns={columns}
                data={data}
                options={{
                  showTitle: false,
                  headerStyle: {
                    fontWeight: "bold",
                    backgroundColor: "#1d1464",
                    color: "white",
                    zIndex: 0,
                  },
                }}
                localization={{
                  body: {
                    emptyDataSourceMessage: "No Payment List",
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

export default AdminPaymentList;
