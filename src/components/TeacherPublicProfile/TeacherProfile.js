import { useState, useEffect } from "react";
import { Row, Card, Col, Form, Accordion } from "react-bootstrap";
import { Avatar, Button } from "@mui/material";
import { Link, useHistory } from "react-router-dom";

import "../../css/EditTeacher.scss";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { stateToHTML } from "draft-js-export-html";
import { convertFromRaw } from "draft-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Api from "../../Api";
import {
  faBrain,
  faBriefcase,
  faGraduationCap,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function TeacherProfile(props) {
  const teacherId = props?.match?.params?.id;
  const [data, setData] = useState();
  const [skills, setSkills] = useState();
  const [description, setDescription] = useState();
  const [aboutUs, setAboutUs] = useState();
  const [training, setTraining] = useState();
  const userId = localStorage.getItem("userId");
  const [experience, setExperience] = useState();
  const history = useHistory();

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    getTeacherDetails();
    getTeacherExperience();
  }, []);

  const convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  const getTeacherExperience = () => {
    Api.get(`/api/v1/teacherApplication/${teacherId}`, {
      headers: { userId: userId },
    })
      .then((res) => {
        const data = res?.data?.getTeacherApplication;
        setTraining(data?.education);
        setExperience(data?.experience);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const getTeacherDetails = () => {
    Api.get(`api/v1/teacher/${teacherId}`).then((res) => {
      const data = res.data.data.getOne;
      const selectSkill = data.skills ? JSON.parse(data.skills) : "";
      setData(data);
      setSkills(selectSkill);
      setDescription(data?.specialityDescription);
      setAboutUs(data?.aboutUs);
    });
  };

  return (
    <div className="px-3 pb-3 m-0">
      <Card className="p-3 mt-4">
        <Row>
          <Col
            md={3}
            className="d-flex justify-content-center align-items-center"
          >
            <div>
              {data?.imageUrl ? (
                <Avatar
                  alt="Teacher"
                  className="teacher-profile-avatar-image"
                  src={data?.imageUrl}
                  sx={{ width: 180, height: 180 }}
                />
              ) : (
                <Avatar alt="No Image" sx={{ width: 180, height: 180 }}>
                  {data?.firstName?.charAt(0) + " " + data?.lastName?.charAt(0)}
                </Avatar>
              )}
            </div>
          </Col>
          <Col md={9}>
            <Row>
              <Col className="teacher-edit-profile">
                <div className="mt-4">
                  <h5 className="teacher-edit-profile-color">
                    {data?.firstName} {data?.lastName}
                  </h5>
                  <p>{data?.email}</p>
                </div>
              </Col>
              <Col className="teacher-edit-profile-last">
                <div>
                  <Button
                    variant="contained"
                    className="edit-profile-btn m-2 "
                    onClick={() => {
                      history.push(`/teacher/edit/${teacherId}`);
                    }}
                  >
                    <BsFillPersonPlusFill size={25} />
                    Edit Profile
                  </Button>
                </div>
              </Col>
            </Row>
            <hr className="pt-1 mb-2" />
            {aboutUs ? (
              <p
                dangerouslySetInnerHTML={convertFromJSONToHTML(`${aboutUs}`)}
              ></p>
            ) : (
              <p>About Me:</p>
            )}
          </Col>
        </Row>
      </Card>
      <Row>
        <Col md={8} className="mt-3">
          <Card className="p-3 shadow p-3  bg-white teacher-card">
            <div>
              <h5 className="teacher-edit-profile-color">
                <FontAwesomeIcon icon={faIdCard} size={25} className="me-2" />
                Biography
              </h5>
            </div>
            <Row>
              <Col>
                <div className="teacher-profile-screen mt-2">
                  <text className="teacher-profile-width-text ">
                    First Name
                  </text>
                  <text className="teacher-profile-width-bold">
                    {" "}
                    {data?.firstName}
                  </text>
                </div>
                <div className="teacher-profile-screen mt-2">
                  <text className="teacher-profile-width-text"> Last Name</text>
                  <text className="teacher-profile-width-bold">
                    {" "}
                    {data?.lastName}
                  </text>
                </div>
                <div className="teacher-profile-screen mt-2">
                  <text className="teacher-profile-width-text">BirthDay</text>
                  <text className="teacher-profile-width-bold">
                    {" "}
                    15-08-1947
                  </text>
                </div>
                <div className="teacher-profile-screen mt-2">
                  <text className="teacher-profile-width-text">Country</text>
                  <text className="teacher-profile-width-bold">
                    {" "}
                    {data?.country}{" "}
                  </text>
                </div>
              </Col>
              <Col>
                <div className="teacher-profile-screen mt-2">
                  <text className="teacher-prf-width-text"> Occupation</text>
                  <text className="teacher-prf-width-bold">
                    {" "}
                    Bill and Account Counter
                  </text>
                </div>
                <div className="teacher-profile-screen mt-2">
                  <text className="teacher-prf-width-text">Email</text>
                  <text className="teacher-prf-width-bold"> {data?.email}</text>
                </div>
                <div className="teacher-profile-screen mt-2">
                  <text className="teacher-prf-width-text">Phone</text>
                  <text className="teacher-prf-width-bold"> {data?.phone}</text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col md={4} className="mt-3">
          <Card
            className="p-3 shadow p-3  bg-white teacher-card"
            style={{ height: "100%", overflow: "hidden" }}
          >
            <h5 className="teacher-edit-profile-color">
              <FontAwesomeIcon icon={faBrain} size={25} className="me-2" />
              Skills
            </h5>
            {skills?.length > 0
              ? skills.map((list) => (
                  <ul>
                    <li>{list.label}</li>
                  </ul>
                ))
              : null}
          </Card>
        </Col>
      </Row>
      <Row>
        <Col className="mt-3">
          <Card className="p-3 shadow p-3  bg-white teacher-profile-card-height teacher-card">
            <div>
              <h5 className="teacher-edit-profile-color ">
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  size={30}
                  className="me-2"
                />
                Educational Information
              </h5>

              {training?.length > 0
                ? training?.map((list) => (
                    <Accordion className="mb-2">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>{list?.institution}</Accordion.Header>
                        <Accordion.Body>
                          <p className="mt-3">
                            <b className="me-1">Institution :</b>
                            {list?.institution}
                          </p>
                          <p>
                            <b className="me-1">Year Of Passing :</b>
                            {list?.yearOfPassing?.value}
                          </p>
                          <p>
                            <b className="me-1">Subject :</b>
                            {list?.subject}
                          </p>
                          <p>
                            <b className="me-1">City :</b>
                            {list?.city}
                          </p>
                          <p>
                            <b className="me-1">State :</b>
                            {list?.state}
                          </p>
                          <p>
                            <b className="me-1">Country :</b>
                            {list?.country?.value}
                          </p>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  ))
                : null}
            </div>
          </Card>
        </Col>
        <Col className="mt-3">
          <Card className="p-3 shadow p-3  bg-white teacher-profile-card-height teacher-card">
            <div>
              <h5 className="teacher-edit-profile-color">
                <FontAwesomeIcon icon={faBriefcase} className="me-2 " />{" "}
                Experience
              </h5>
              {experience?.length > 0
                ? experience?.map((list) => (
                    <Accordion className="mb-2">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>
                          {list?.workInstitution}
                        </Accordion.Header>
                        <Accordion.Body>
                          <p>
                            <b className="me-1">Role :</b>
                            {list?.role?.label}
                          </p>
                          <p>
                            <b className="me-1">Age Range :</b>
                            {list?.ageRangeFrom} -{list?.ageRangeTo}
                          </p>

                          <p>
                            <b className="me-1">Date :</b>
                            {list?.startDate} - {list?.endDate}
                          </p>
                          <p>
                            <b className="me-1">Role :</b>
                            {list?.role?.label}
                          </p>
                          <p>
                            <b className="me-1">Experience :</b>
                            {list?.experience}
                          </p>
                          <p>
                            <b className="me-1">Address 1 :</b>
                            {list?.workAddress1}
                          </p>
                          <p>
                            <b className="me-1">Address 2 :</b>
                            {list?.workAddress2}
                          </p>
                          <p>
                            <b className="me-1">City :</b>
                            {list?.workState}
                          </p>
                          <p>
                            <b className="me-1">State :</b>
                            {list?.workState}
                          </p>
                          <p>
                            <b className="me-1">Country :</b>
                            {list?.workCountry?.label}
                          </p>
                          {list?.workInsWebsite ? (
                            <p>
                              <b className="me-1">Institute Website :</b>
                              {list?.workInsWebsite}
                            </p>
                          ) : null}

                          <p>
                            <b className="me-1">Zip Code :</b>
                            {list?.workZipCode}
                          </p>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  ))
                : null}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
