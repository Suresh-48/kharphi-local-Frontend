import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import CountUp from "react-countup";
import Avatar from "react-avatar";

// Component
import Loader from "../core/Loader";

// Api
import Api from "../../Api";

// style
import "../../css/StudentDetails.scss";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

function StudentPublicProfile(props) {
  const [userDetail, setUserDetail] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [cardDetail, setCardDetail] = useState([]);
  const userId = localStorage.getItem("userId");
  const history = useHistory();

  useEffect(() => {
    userDetails();
    getDashboardDetails();
  }, []);

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  const userDetails = () => {
    Api.get(`api/v1/student/${props.studentId}`, {
      headers: { userId: userId },
    })
      .then((response) => {
        const data = response.data.data.getOne;
        setUserDetail(data);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const getDashboardDetails = () => {
    Api.get("api/v1/dashboard/student/", {
      params: {
        studentId: props.studentId,
      },
    }).then((res) => {
      const data = res?.data?.data;
      setCardDetail(data);
      setisLoading(false);
    });
  };

  return (
    <div>
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <Row className="student-details">
              <div xs={6} md={3} className="user-avatar-style">
                {userDetail.imageUrl === undefined ||
                userDetail.imageUrl === "null" ||
                userDetail.imageUrl === "" ? (
                  <Avatar
                    name={`${userDetail?.firstName} ${userDetail?.lastName}`}
                    size="170"
                    round={true}
                    color="silver"
                  />
                ) : (
                  <Avatar
                    src={userDetail?.imageUrl}
                    size="170"
                    round={true}
                    color="silver"
                  />
                )}
              </div>
              <div>
                <p className="student-detail">
                  {userDetail?.firstName} {userDetail?.lastName}
                </p>
                <p className="student-detail">{userDetail?.email}</p>
                {userDetail?.phone && (
                  <p className="student-detail">{userDetail?.phone}</p>
                )}
                {userDetail?.address1 &&
                  userDetail?.city &&
                  userDetail?.state && (
                    <div style={{ marginTop: 20 }}>
                      <p className="student-detail">{`${
                        userDetail?.address1 + ", " + userDetail?.address2
                      }`}</p>
                      <p className="student-detail">{`${
                        userDetail?.city + ", " + userDetail?.state
                      }`}</p>
                      <p className="student-detail">{`${
                        userDetail?.country + " - " + userDetail?.zipCode
                      }`}</p>
                    </div>
                  )}
              </div>
              <Row style={{ marginBottom: 20 }}>
                <Col xs={12} sm={6} xd={6}>
                  <Card className="popup-card-shadow" style={{ marginTop: 20 }}>
                    <div style={{ textAlign: "center" }}>
                      <p className="popup-label-style">Course Enrolled</p>
                      <p className="popup-count-style">
                        {cardDetail ? cardDetail?.activeCourse : cardDetail}
                      </p>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={6} xd={6}>
                  <Card className="popup-card-shadow" style={{ marginTop: 20 }}>
                    <div style={{ textAlign: "center" }}>
                      <p className="popup-label-style">Course Completed</p>
                      <p className="popup-count-style">
                        {cardDetail ? cardDetail?.completeCourse : cardDetail}
                      </p>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Row>
          </div>
        )}
      </Container>
    </div>
  );
}

export default StudentPublicProfile;
