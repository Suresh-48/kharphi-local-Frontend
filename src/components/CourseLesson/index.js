import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { toast } from "react-toastify";

// Material Table Icons
import AddBox from "@material-ui/icons/AddBox";
import Edit from "@material-ui/icons/Edit";

// Api
import Api from "../../Api";

// Material Table Styles
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";

// Component
import Loader from "../core/Loader";
import CourseSideMenu from "../CourseSideMenu";
import { tableIcons } from "../core/TableIcons";

function CourseLesson(props) {
  const [data, setData] = useState([]);
  const [courseDetail, setCourseDetail] = useState([]);
  const [courseId, setcourseId] = useState(props.location.state.courseId);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  const history = useHistory();

  // Column Heading
  const columns = [
    {
      title: "Lesson",
      width: "5%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Lesson Name",
      field: "lessonName",
    },
    {
      title: "Actual Amount",
      render: (rowData) =>
        rowData.lessonActualAmount ? <p className="amount-text"> {rowData.lessonActualAmount}</p> : "-",
    },
    {
      title: "Discount Amount",
      render: (rowData) => (rowData.lessonDiscountAmount ? <p>{rowData.lessonDiscountAmount}</p> : "-"),
    },
    {
      title: "Description",
      render: (rowData) => (
        <div
          className="descriptions-text-align"
          dangerouslySetInnerHTML={convertFromJSONToHTML(`${rowData.description}`)}
        ></div>
      ),
      cellStyle: {
        maxWidth: 420,
      },
    },
    {
      title: "Duration",
      render: (rowData) => `1 hour`,
    },
  ];

  // Get Course Lesson List
  const courseLessonData = () => {
    Api.get("api/v1/courseLesson/lessonlist", {
      params: {
        courseId: courseId,
        userId: userId,
      },
    })
      .then((response) => {
        const data = response.data.lessonList;
        data.sort((a, b) => (a.lessonNumber > b.lessonNumber ? 1 : -1));
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
            this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  // Get Course Detail
  const getCourseDetail = () => {
    Api.get(`api/v1/course/${courseId}`, { headers: { userId: userId } })
      .then((response) => {
        const courseDetail = response.data.data;
        setCourseDetail(courseDetail);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
            this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  const convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  useEffect(() => {
    courseLessonData();
    getCourseDetail();
  }, []);

  // Log out
  const logout = () => {
     setTimeout(() => {
       localStorage.clear(history.push("/kharpi"));
       window.location.reload();
     }, 2000);
  };

  // Delete Lesson
  const deleteLesson = (data, reload) => {
    Api.delete("api/v1/courseLesson/" + data.id, { headers: { userId: userId } })
      .then((response) => {
        courseLessonData();
        reload();
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
            reload();
          }
          reload();
          toast.error(error.response.data.message);
        }
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
            this.logout();
          toast.error("Session Timeout");
        }
      });
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
          "&:nth-child(even)": {
            backgroundColor: "#f0f5f5",
          },
        },
      },
    },
  });

  return (
    <Container className="mt-1">
      <CourseSideMenu courseId={courseId} />
      <div className="row edit-course-lesson-style">
        <ThemeProvider theme={tableTheme}>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="mb-3">
              <div className="mt-2 py-3">
                <h4>Lessons</h4>
              </div>
              <div className="material-table-responsive">
                <MaterialTable
                  style={{ width: "100%" }}
                  icons={tableIcons}
                  title={data?.length === 0 ? "" : data[0]?.courseId?.name}
                  data={data}
                  columns={columns}
                  actions={[
                    {
                      icon: () => <AddBox style={{ color: "#1d1464" }} />,
                      tooltip: "Add Lesson",
                      isFreeAction: true,
                      onClick: (event, rowData) => {
                        history.push({
                          pathname: "/course/lesson/add",
                          state: {
                            courseId: courseId,
                            courseName: courseDetail?.name,
                          },
                        });
                      },
                    },
                    {
                      icon: () => <Edit style={{ color: "#1458E0" }} />,
                      tooltip: "Edit Lesson",
                      onClick: (event, rowData) => {
                        history.push(`/course/lesson/edit/${rowData.id}`, rowData);
                      },
                    },
                  ]}
                  localization={{
                    body: {
                      emptyDataSourceMessage: "No Lessons Are Created",
                    },
                  }}
                  editable={{
                    onRowDelete: (selectedRow) =>
                      new Promise((resolve, reject) => {
                        deleteLesson(selectedRow, resolve);
                      }),
                    saveTooltip: "Delete",
                  }}
                  options={{
                    actionsColumnIndex: -1,
                    addRowPosition: "last",
                    headerStyle: {
                      backgroundColor: "#1d1464",
                      color: "white",
                      fontWeight: "bold",
                      zIndex: 0,
                    },
                  }}
                />
              </div>
            </div>
          )}
        </ThemeProvider>
      </div>
    </Container>
  );
}
export default CourseLesson;
