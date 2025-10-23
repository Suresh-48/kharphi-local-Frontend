import React, { useState, useEffect } from "react";
import { Container, Row, Button, Modal, Alert } from "react-bootstrap";

// Component
import DashboardTiles from "../../components/core/DashboardTiles";

// Api
import Api from "../../Api";
import Loader from "../core/Loader";
import { useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";

function AdminDashboard() {
  const [adminDashboard, setAdminDashboard] = useState("");
  const [approvedData, setApprovedData] = useState("");
  const [pendingData, setPendingData] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const history = useHistory();
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  const browserHistory = createBrowserHistory();

  const [show, setShow] = useState();
  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  const userId = localStorage.getItem("userId");

  // useEffect(() => {
  //   const handlePopstate = debounce(() => {
  //     // Check if the confirmation dialog is already open
  //     history.go(1);

  //     if (!isConfirmationOpen) {
  //       setConfirmationOpen(true);

  //       // Show the confirmation dialog
  //       const confirmLogout = window.confirm("Are you sure you want to logout?");

  //       // After the user closes the confirmation dialog
  //       setConfirmationOpen(false);

  //       if (confirmLogout) {
  //         // Perform logout logic here
  //         console.log("User confirmed logout.");
  //         localStorage.clear(history.push("/kharpi"));
  //         window.location.reload();
  //         // Add your logout logic here, such as updating the state or making API calls.
  //         // Example: setLoggedOut(true);
  //       } else {
  //         console.log("User cancelled logout.");
  //         // Optionally, you can handle the case when the user cancels the logout.
  //       }
  //     }
  //   }, 2000);

  //   // window.addEventListener("beforeunload", handleBeforeUnload);
  //   window.addEventListener("popstate", handlePopstate);
  //   return () => {
  //     // Clean up the event listeners when the component unmounts
  //     // window.removeEventListener("beforeunload", handleBeforeUnload());
  //     window.removeEventListener("popstate", handlePopstate(), false);
  //   };
  // }, []);
 

  const getAdminDashboard = () => {
    Api.get("api/v1/dashboard/admin/", { headers: { userId: userId } }).then((response) => {
      const data = response.data.data;
      setAdminDashboard(data);
      setisLoading(false);
    });
  };

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  //get approved teacher list
  const getTeacherApprovedListData = () => {
    Api.get("api/v1/teacher/list").then((response) => {
      const approvedData = response.data.teacherList;
      setApprovedData(approvedData);
      setisLoading(false);
    });
  };

  // get pending teacher list
  const getTeacherPendingListData = () => {
    Api.get("api/v1/teacher/pending/list", { headers: { userId: userId } }).then((response) => {
      const pendingData = response.data.PendingList;
      setPendingData(pendingData);
      setisLoading(false);
    });
  };

  const handlePopState = (event) => {
    history.go(1);
  };

  useEffect(() => {
    getTeacherApprovedListData();
    getAdminDashboard();
    getTeacherPendingListData();

    window.onpopstate = async (event) => {
      const r = await window.confirm("Are you sure! Do you want logout?");
      if (r === true) {
        // Call Back button programmatically as per user confirmation.
        await history.go(1);
        await localStorage.clear(history.push("/kharpi"));
        window.location.reload();
        return;
        // Uncomment below line to redirect to the previous page instead.
        // window.location = document.referrer // Note: IE11 is not supporting this.
      } else {
        // Stay on the current page.
        history.go(1);
        return;
      }
    };
    // window.addEventListener(
    //   "popstate",
    //   function (event) {
    //     // The popstate event is fired each time when the current history entry changes.
    //     event.preventDefault();
    //     const r = this.window.confirm("You pressed a Back button! Are you sure?!");
    //     console.log("r", r);
    //     if (r === true) {
    //       console.log("first");
    //       // Call Back button programmatically as per user confirmation.
    //       history.go(1);
    //       return;
    //       // Uncomment below line to redirect to the previous page instead.
    //       // window.location = document.referrer // Note: IE11 is not supporting this.
    //     } else {
    //       console.log("second");
    //       // Stay on the current page.
    //       history.go(1);
    //       return;
    //     }
    //     console.log("third");
    //     history.pushState(null, null, window.location.pathname);
    //   },
    //   false
    // );
  }, []);

  // useEffect(() => {
  //   // browserHistory.listen((update) => {
  //   //   if (update.action === "POP") {
  //   //     console.log("Backbutton pressed");
  //   //     history.go(1);
  //   //   }
  //   // });

  //   window.onpopstate = async (event) => {
  //     const r = await window.confirm("Are you sure! Do you want logout?");
  //     console.log("r", r);
  //     if (r === true) {
  //       console.log("first");
  //       // Call Back button programmatically as per user confirmation.
  //       await history.go(1);
  //       await localStorage.clear(history.push("/kharpi"));
  //       window.location.reload();
  //       return;
  //       // Uncomment below line to redirect to the previous page instead.
  //       // window.location = document.referrer // Note: IE11 is not supporting this.
  //     } else {
  //       console.log("second");
  //       // Stay on the current page.
  //       history.go(1);
  //       return;
  //     }
  //   };
  // }, []);

  return (
    <div className="admin-dashboard-min-height mt-2">
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <Row className="mb-4">
            <DashboardTiles label="Parents" count={adminDashboard?.totalParent} url="/parents/list" />
            <DashboardTiles label="Students" count={adminDashboard?.totalStudent} url="/students/list" />
            <DashboardTiles label="Courses" count={adminDashboard?.totalCourse} url="/course/list" />
            <DashboardTiles
              label="Approved Teachers"
              count={approvedData?.length}
              url={{
                pathname: "/teacher/list",
                state: {
                  indexCount: 0,
                },
              }}
            />
            <DashboardTiles
              label="Pending Teachers"
              count={pendingData?.length}
              url={{
                pathname: "/teacher/list",
                state: {
                  indexCount: 1,
                },
              }}
            />
            <DashboardTiles label="Amount Received ($)" count={adminDashboard?.totalAmount} url="/payment/list" />
          </Row>
        )}
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminDashboard;
