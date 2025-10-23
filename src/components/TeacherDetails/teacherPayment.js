import React, { useState, useEffect } from "react";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import MaterialTable from "material-table";
import { tableIcons } from "../core/TableIcons";
import Button from "@mui/material/Button";
import Api from "../../Api";
import { Modal, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { TEACHER_ACCOUNT_CURRENCY } from "../../constants/roles";

function TeacherPayment(props) {
  const [data, setData] = useState();
  const adminTeacherId = props?.location?.state;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [courseName, setCourseName] = useState();
  const [lessonName, setLessonName] = useState();
  const [teacherName, setTeacherName] = useState();

  const [payment, setPayment] = useState("");
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentId, setPaymentId] = useState();
  const userId = localStorage.getItem("userId");
  const history = useHistory();
  const [customerId, setCustomerId] = useState();

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

  const getTeacherAllPayments = () => {
    const localTeacherId = localStorage.getItem("teacherId");
    const teacherId = adminTeacherId ? adminTeacherId : localTeacherId;
    Api.get(`/api/v1/teacher/teacher/payment/${teacherId}`, {
      headers: { userId: userId },
    })
      .then((res) => {
        setData(res?.data?.teacherPaymentList);
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
    getTeacherAllPayments();
  }, []);

  const role = localStorage.getItem("role");

  const PaymentForTeacher = (values) => {
    setCourseName(values.courseName);
    setLessonName(values.lessonName);
    setPayment(values.teacherPayableAmount);
    setPaymentId(values.id);
    setCustomerId(values.teacherId.customerId);
    setTeacherName(
      values.teacherId.firstName + " " + values.teacherId.lastName
    );
    setShow(true);
  };

  const TeacherUpdatePayment = () => {
    setShow(false);
    const date = new Date();
    let courseAndLessonName =
      teacherName +
      " have completed lesson " +
      lessonName +
      " from " +
      courseName +
      " course  On : " +
      date;

    Api.post("/api/v1/teacher/charge/customer", {
      amount: payment,
      currency: TEACHER_ACCOUNT_CURRENCY,
      description: courseAndLessonName,
      customer: customerId,
      updatePaymentId: paymentId,
      payment: true,
      paymentDate: date,
      userId: userId,
    })
      .then((res) => {
        getTeacherAllPayments();
        setPaymentModal(true);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const columns = [
    {
      title: "S.No",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Course Name",
      render: (rowData) => `${rowData.courseName} ( ${rowData.lessonName})`,
    },
    { title: "Date", field: "date" },
    {
      title: "Start Time",
      field: "zoomStartTime",
    },
    {
      title: "End Time",
      field: "zoomEndTime",
    },

    {
      title: "Amount",
      field: "teacherPayableAmount",
    },

    {
      title: "Paid Date",
      field: "paymentDate",
    },

    {
      title: "Status",
      render: (rowData) =>
        rowData.payment === true ? <p>Paid</p> : <p>Pending</p>,
      hidden: role === "admin",
    },
    {
      title: "Payment",
      render: (rowData) =>
        rowData.payment === true ? (
          <p className="text-center">Paid</p>
        ) : (
          <Row>
            <button
              className="teacher-payment-color"
              onClick={() => PaymentForTeacher(rowData)}
            >
              Pay Now ${rowData.teacherPayableAmount}
            </button>
          </Row>
        ),
      hidden: role === "teacher",
    },
  ];

  return (
    <div className="mx-3 mt-3">
      <h4 className="mb-3">Teacher Payment</h4>
      <div className="material-table-responsive">
        <ThemeProvider theme={tableTheme}>
          <MaterialTable
            title="Teaacher Payment"
            columns={columns}
            style={{ marginBottom: "10px" }}
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
            localization={{
              body: {
                emptyDataSourceMessage: "Yet to be paid teacher payment",
              },
            }}
          />
        </ThemeProvider>
      </div>

      <Modal
        show={show}
        centered
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <div className="m-4">
          <h4 className="p-4 text-center" style={{ color: "#1d1464" }}>
            Teacher Payment{" "}
          </h4>
          <Row className="mx-auto">
            <p className="ms-2">
              <b>Course Name : </b>
              {courseName}
            </p>
            <p className="ms-2">
              <b>Lesson Name : </b>
              {lessonName}
            </p>
            <p className="ms-2">
              <b>Payment Amount : </b>$ {payment}
            </p>
          </Row>

          <hr className="my-4" />
          <Row>
            <Col className="d-flex justify-content-end mb-2">
              <Button
                className="confirm-payment-cancel-btn me-2"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                className="confirm-payment-btn"
                onClick={() => TeacherUpdatePayment()}
              >
                Confirm Payment
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
      <Modal
        centered
        show={paymentModal}
        backdrop="static"
        keyboard={false}
        onHide={() => setPaymentModal(false)}
      >
        <div className="px-4 pt-5">
          <h5 className="Teachr-pay-msg">
            Transaction Completed Successfully !
          </h5>
          <div className="d-flex justify-content-center">
            <img
              src="https://global-uploads.webflow.com/5e4ddea9c4f11f4fe9a36623/5e58967a1c2c930a89d0cf0a_Success.gif"
              width="150px"
            />
          </div>
          <Modal.Footer className=" me-2 mb-4">
            <Button
              onClick={() => {
                setPaymentModal(false);
                setShow(false);
              }}
              className="confirm-payment-btn px-4"
            >
              Close
            </Button>
          </Modal.Footer>{" "}
        </div>
      </Modal>
    </div>
  );
}

export default TeacherPayment;
