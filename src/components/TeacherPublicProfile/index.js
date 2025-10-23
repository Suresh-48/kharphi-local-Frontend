import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import Avatar from "react-avatar";
import Loader from "../../components/core/Loader";
import Api from "../../Api";
import { toast } from "react-toastify";

const TeacherPublicProfile = (props) => {
  const [teacherDetail, setTeacherDetail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const teacherId = props?.location?.state?.teacherId;

  useEffect(() => {
    getTeacherDetail();
  }, []);

  const getTeacherDetail = () => {
    Api.get(`api/v1/teacher/${teacherId}`)
      .then((response) => {
        const data = response.data.data.getOne;
        setTeacherDetail(data);
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

  const convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="p-4">
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <Row>
            <Col sm={4} md={3} xs={12}>
              <div className="me-4">
                <div className="d-flex justify-content-center mt-5 teacher-profile-public-alignment">
                  {teacherDetail?.imageUrl ? (
                    <img
                      className="profile-image-size"
                      src={teacherDetail?.imageUrl}
                      alt=""
                    />
                  ) : (
                    <Avatar
                      name={`${teacherDetail.firstName} ${teacherDetail.lastName}`}
                      size="150"
                      round={true}
                      color="silver"
                    />
                  )}
                </div>
                <div className="teacher-profile-public-alignment">
                  <p className="user-name justify-content-start mt-5 ">
                    {teacherDetail?.firstName + " " + teacherDetail?.lastName}
                  </p>
                  <p variant="secondary" className="teacher-specality">
                    Email:{`${teacherDetail?.email}`}
                  </p>
                  <p
                    variant="secondary"
                    className="teacher-specality text-left"
                  >
                    Speciality:
                    {`${
                      teacherDetail?.speciality
                        ? teacherDetail?.speciality
                        : "-"
                    }`}
                  </p>
                </div>
              </div>
            </Col>
            <Col md={9} className="ps-5 mt-2">
              <div className="about-me">
                {teacherDetail?.aboutUs === undefined ? (
                  <div>
                    <p className="aboutUs-label-style">About Me :</p>
                    <p>"Yet to be Updated"</p>
                  </div>
                ) : (
                  <div>
                    <p className="aboutUs-label-style">About Me :</p>
                    <div
                      dangerouslySetInnerHTML={convertFromJSONToHTML(
                        teacherDetail?.aboutUs
                      )}
                    ></div>
                  </div>
                )}
              </div>
              {teacherDetail?.specialityDescription === undefined ? (
                <div>
                  <p className="aboutUs-label-style">
                    Speciality Description :
                  </p>
                  <p>"Yet to be Updated"</p>
                </div>
              ) : (
                <div>
                  <p className="aboutUs-label-style">
                    Speciality Description :
                  </p>
                  <div
                    dangerouslySetInnerHTML={convertFromJSONToHTML(
                      teacherDetail?.specialityDescription
                    )}
                  ></div>
                </div>
              )}
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default TeacherPublicProfile;
