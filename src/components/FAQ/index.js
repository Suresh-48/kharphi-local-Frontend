import React, { useState } from "react";
import { Button, Carousel, Col, Dropdown, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useHistory } from "react-router-dom";
import imgOne from "./imgOne.jpg";
import imgTwo from "./imgTwo.jpg";
import imgThree from "./imgThree.jpg";
import imgFour from "./imgFour.jpg";
import "../../css/FAQ.scss";

function FAQ(props) {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [open6, setOpen6] = useState(false);
  const [open7, setOpen7] = useState(false);
  const [open8, setOpen8] = useState(false);
  const [open9, setOpen9] = useState(false);
  const [open10, setOpen10] = useState(false);
  const [open11, setOpen11] = useState(false);
  const [open12, setOpen12] = useState(false);
  const [open13, setOpen13] = useState(false);
  const [open14, setOpen14] = useState(false);
  const [open15, setOpen15] = useState(false);
  const [open16, setOpen16] = useState(false);
  const [open17, setOpen17] = useState(false);
  const [open18, setOpen18] = useState(false);
  const [open19, setOpen19] = useState(false);
  const [open20, setOpen20] = useState(false);
  const [open21, setOpen21] = useState(false);
  const token = localStorage.getItem("token");
  const history = useHistory();

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      props.history.push("/kharpi");
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="faq-main-div">
      <div>
        <Carousel interval={3000}>
          <Carousel.Item>
            <img
              className="d-block w-100 sliding-img"
              src={imgOne}
              alt="First slide"
              height="400"
              width="100%"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 sliding-img"
              src={imgTwo}
              alt="First slide"
              height="400"
              width="100%"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 sliding-img"
              src={imgThree}
              alt="First slide"
              height="400"
              width="100%"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 sliding-img"
              src={imgFour}
              alt="First slide"
              height="400"
              width="100%"
            />
          </Carousel.Item>
        </Carousel>
      </div>
      <div id="divOne"></div>
      <div style={{ marginTop: "80px" }}>
        <h1>Courses</h1>
        <Row>
          <Col>
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">How Can I Buy the course?</p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open1 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen1(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen1(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open1 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">
                How long will it take my child to complete the full program?
              </p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open2 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen2(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen2(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open2 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
          </Col>
          <Col>
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">How long does each course last?</p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open3 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen3(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen3(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open3 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">
                Does my student get help outside of class time?
              </p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open4 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen4(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen4(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open4 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
          </Col>
        </Row>
      </div>
      <div id="divTwo"></div>
      {/* About Us */}
      <div style={{ marginTop: "80px" }}>
        <Row>
          <h1> Registration</h1>
          <Col>
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">How is CodeWizardsHQ different?</p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open5 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen5(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen5(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open5 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">
                Can my school/organization sponsor classes?
              </p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open6 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen6(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen6(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open6 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">How will my child benefit?</p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open7 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen7(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen7(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open7 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
          </Col>
          <Col>
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">
                Do you offer in-person camps or in-person classes?
              </p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open8 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen8(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen8(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open8 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">Do you offer private lessons?</p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open9 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen9(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen9(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open9 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
          </Col>
        </Row>
      </div>
      <div id="divThree"></div>
      {/* APCS */}
      <div style={{ marginTop: "80px" }}>
        <h1> Forum Creation</h1>
        <Row>
          <Col>
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">Is there a money-back guarantee?</p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open10 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen10(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen10(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open10 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">
                What happens if a student misses a class?
              </p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open11 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen11(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen11(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open11 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
          </Col>
          <Col>
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">
                Is there any special software that is needed?
              </p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open12 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen12(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen12(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open12 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">Can students use tablets?</p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open13 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen13(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen13(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open13 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
          </Col>
        </Row>

        {/* Camps */}
        <div style={{ marginTop: "80px" }}>
          <h1>Camps</h1>
          <Row>
            <Col>
              <div className="faq-head-drop mt-5">
                <p className="fw-bold">Where are summer camps held?</p>
                <Dropdown>
                  <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                    {!open14 ? (
                      <FontAwesomeIcon
                        onClick={() => setOpen14(true)}
                        icon={faAngleDown}
                        className="faq-fontawesome"
                      />
                    ) : (
                      <FontAwesomeIcon
                        onClick={() => setOpen14(false)}
                        icon={faAngleUp}
                        className="faq-fontawesome"
                      />
                    )}
                  </Dropdown.Toggle>
                </Dropdown>
              </div>
              {open14 ? (
                <p className="paragraph-tag-faq">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                  <NavLink to={{ pathname: "/course/search" }}>
                    Click to buy Course
                  </NavLink>
                </p>
              ) : null}
              <hr className="mt-3" />
            </Col>
            <Col>
              <div className="faq-head-drop mt-5">
                <p className="fw-bold">What happens after the camp is over?</p>
                <Dropdown>
                  <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                    {!open15 ? (
                      <FontAwesomeIcon
                        onClick={() => setOpen15(true)}
                        icon={faAngleDown}
                        className="faq-fontawesome"
                      />
                    ) : (
                      <FontAwesomeIcon
                        onClick={() => setOpen15(false)}
                        icon={faAngleUp}
                        className="faq-fontawesome"
                      />
                    )}
                  </Dropdown.Toggle>
                </Dropdown>
              </div>
              {open15 ? (
                <p className="paragraph-tag-faq">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                  <NavLink to={{ pathname: "/course/search" }}>
                    Click to buy Course
                  </NavLink>
                </p>
              ) : null}
              <hr className="mt-3" />
            </Col>
          </Row>
        </div>
      </div>
      <div id="divFour"></div>
      {/* Classes */}
      <div style={{ marginTop: "80px" }}>
        <h1>Popular Courses</h1>
        <Row>
          <Col>
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">What are the classes like?</p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open16 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen16(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen16(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open16 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">Will my child receive a certificate?</p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open17 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen17(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen17(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open17 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">
                Does my child get support outside of class time?
              </p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open18 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen18(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen18(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open18 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
          </Col>
          <Col>
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">What is your class size?</p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open19 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen19(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen19(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open19 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">
                How will I stay updated on my child’s progress?
              </p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open20 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen20(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen20(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open20 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
            <div className="faq-head-drop mt-5">
              <p className="fw-bold">Who are your teachers?</p>
              <Dropdown>
                <Dropdown.Toggle className="teacher-menu-dropdown pt-0">
                  {!open21 ? (
                    <FontAwesomeIcon
                      onClick={() => setOpen21(true)}
                      icon={faAngleDown}
                      className="faq-fontawesome"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => setOpen21(false)}
                      icon={faAngleUp}
                      className="faq-fontawesome"
                    />
                  )}
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            {open21 ? (
              <p className="paragraph-tag-faq">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <NavLink to={{ pathname: "/course/search" }}>
                  Click to buy Course
                </NavLink>
              </p>
            ) : null}
            <hr className="mt-3" />
          </Col>
        </Row>
      </div>
      <div className="faq-footer">
        <div>
          <h1>Get Started with your Kharpi </h1>
          <div className="d-flex justify-content-center">
            <Button
              className="mt-3 fw-bold  Kharpi-cancel-btn"
              onClick={() => history.push("/login")}
            >
              ENROLL
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
