import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";

// Api
import Api from "../../Api";

// Component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

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

function CourseCategory(props) {
  const [isLoading, setisLoading] = useState(true);
  const [category, setcategory] = useState([]);
  const userId = localStorage.getItem("userId");
  const history = useHistory();

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Column Heading
  const columns = [
    {
      title: "S.No",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Category Name",
      field: "name",
    },
    {
      title: "Created By",
      render: (rowData) => (rowData.createdBy ? `${rowData.createdBy.firstName} ${rowData.createdBy.lastName}` : null),
    },
    {
      title: "Created At",
      field: "createdAt",
    },
  ];

  useEffect(() => {
    courseCategoryData();
  }, []);

  // Get Course Category
  const courseCategoryData = () => {
    Api.get("api/v1/category/list", { headers: { userId: userId } })
      .then((res) => {
        const data = res?.data?.data;
        setcategory(data);
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

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container className="mb-5">
          <div className="py-3">
            <h5>Course Category</h5>
          </div>
          <ThemeProvider theme={tableTheme}>
            <div className="material-table-responsive">
              <MaterialTable
                icons={tableIcons}
                data={category}
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
              />
            </div>
          </ThemeProvider>
        </Container>
      )}
    </div>
  );
}

export default CourseCategory;
