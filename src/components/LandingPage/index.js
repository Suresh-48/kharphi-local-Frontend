import React, { useEffect, useState } from "react";
import students from "./images/students.png";
import "../../css/LandingPage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import KharpiLogo from "./images/KharpiLogo.png";
import { Button, Card, Form, InputGroup, Container, Row, Col } from "react-bootstrap";
import Avatar from "react-avatar";
import {
  faAddressCard,
  faArrowRightFromBracket,
  faArrowUpRightFromSquare,
  faBook,
  faChevronCircleLeft,
  faChevronCircleRight,
  faLink,
  faSearch,
  faThumbsUp,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Rating } from "@mui/material";
import layer1 from "./images/Layer1.png";
import layer2 from "./images/Layer2.png";
import layer3 from "./images/Layer3.png";
import layer4 from "./images/Layer4.png";
import Carousel, { consts } from "react-elastic-carousel";
import Item from "./Item";
import ItemOne from "./ItemOne";
import ItemTwo from "./ItemTwo";
import backImg1 from "./images/backImg1.png";
// import backImg2 from "./images/backImg2.png";
// import backImg3 from "./images/backImg3.png";
// import backImg4 from "./images/backImg4.png";
import laptopImg from "./images/laptopImg.png";
import Img1 from "./images/Img1.png";
import Img2 from "./images/Img2.png";
import Img3 from "./images/Img3.png";
import Api from "../../Api";
import user1 from "./images/user1.png";
import Img4 from "./images/Img4.png";
import DQ from "./images/DQ.png";
import { useHistory } from "react-router-dom";
// import ChatBotConversation from "../ChatBotConversation/ChatBotConversation";
import Aimg1 from "./images/Aimg1.png";
import Aimg2 from "./images/Aimg2.png";
import Aimg3 from "./images/Aimg3.png";
import Aimg4 from "./images/Aimg4.png";
import curveImg from "./images/curveImg.png";
import emptyGallery from "./images/emptyGallery.jpg";
import loginArrow from "./images/loginArrow.png";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import overlayImg from "./images/overlayImg.png";
import { faYoutube, faFacebook, faTwitter, faInstagram, faMailchimp } from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faLocationDot,
  faMailBulk,
  faMailReply,
  faPaperPlane,
  faPhone,
  faPhoneFlip,
} from "@fortawesome/free-solid-svg-icons";
import Kharpi from "../../components/core/Kharpi.png";
import England from "../../container/PublicLayout/England.png";
import Russia from "../../container/PublicLayout/Russia.jpg";
import USA from "../../container/PublicLayout/USA.png";

function LandingPage(props) {
  const loginClosed = props?.location?.state?.sideClose;
  const [allCourseList, setAllCourseList] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [teacher, setTeacher] = useState([]);

  const history = useHistory();

  const ChangeArrow = ({ type, onClick, isEdge }) => (
    <div onClick={onClick} className="arrow-div">
      {type === consts.PREV ? (
        <FontAwesomeIcon icon={faChevronCircleLeft} fontSize="35px" color="#375474" className="arrow-div-main" />
      ) : (
        <FontAwesomeIcon icon={faChevronCircleRight} fontSize="35px" color="#375474" className="arrow-div-main" />
      )}
    </div>
  );
  const ChangeArrowOne = ({ type, onClick, isEdge }) => (
    <div onClick={onClick} className="arrow-div1">
      {type === consts.PREV ? (
        <FontAwesomeIcon icon={faChevronCircleLeft} fontSize="60px" color="#375474" className="arrow-div-main1" />
      ) : (
        <FontAwesomeIcon icon={faChevronCircleRight} fontSize="60px" color="#375474" className="arrow-div-main2" />
      )}
    </div>
  );

  //get publish course data
  const getPublishCourse = () => {
    Api.get("api/v1/course/publish").then((res) => {
      const data = res?.data?.data?.data;
      setAllCourseList(data);
    });
  };

  const getAllCourse = () => {
    Api.get("api/v1/course/").then((res) => {
      const allCourse = res?.data?.data?.data;
      // setAllCourseList(allCourse);
    });
  };

  const getCategory = () => {
    Api.get("api/v1/category/").then((res) => {
      const categoryDetails = res?.data?.data?.data;
      setCategoryDetails(categoryDetails);
    });
  };
  const getTeacherList = () => {
    Api.get("api/v1/teacher/publish/list").then((res) => {
      const data = res?.data?.data;
      setTeacher(data);
    });
  };

  const convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };
  const role = localStorage.getItem("role");

  useEffect(() => {
    getAllCourse();
    getCategory();
    getTeacherList();
    getPublishCourse();
    localStorage.clear();
  }, []);

  return (
    <div className="landing-page-content-main">
      <div className="curve-shape-main-div">
        <div className="curve-shape-main-div-sec">
          <img src={curveImg} alt="" className="curve-shape-main-image" />
        </div>
        <div className="kharpi-img-div">
          <img src={KharpiLogo} alt="" className="kharpi-logo" />
          {role === "admin" || role === "teacher" || role === "parent" || role === "student" ? null : (
            <div className="login-arrow-div" onClick={() => history.push("/login")}>
              <img src={loginArrow} className="login-arrow" />
              <p className="login-pTag mb-0 mx-1">Login</p>
            </div>
          )}
        </div>
        <div className="kharpi-img-div-two">
          <div className="content-link">
            <p className="links mx-4" onClick={() => history.push("/course/search")}>
              Courses
            </p>
            <p className="links mx-4" onClick={() => history.push("/trainers")}>
              Trainers
            </p>
            <p className="links mx-4" onClick={() => history.push("/about-us")}>
              About Us
            </p>
            <p className="links mx-4" onClick={() => history.push("/help")}>
              Help
            </p>
          </div>
        </div>
      </div>
      <div
        className="image-div-one"
        style={{
          backgroundImage: `url(${students})`,
          backgroundSize: "cover",
          height: "73vh",
        }}
      >
        <div className="card-main">
          <Card className="card-align mx-5 ">
            <Card.Header className="card-header">
              <p className="card-header-pTag ">Choose From a Range of Online Courses</p>
            </Card.Header>
            <Card.Body>
              <p className="card-body-pTag">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s,
              </p>
              {/* <div className="input-group">
                <button type="button" className="btn btn-primary">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
                <input id="search-focus" type="search" className="form-control" placeholder="Search" />
              </div> */}
            </Card.Body>
          </Card>

          {/* <div>
            <Button className="boost-btn mx-5 my-5">
              <FontAwesomeIcon icon={faBook} className="mx-2" />
              Boosted Course
            </Button>
          </div> */}
        </div>

        <div className="one-line-comment">
          <div>
            <div className=" d-flex">
              <p className="one-line-comment-pTag1 mb-0 ">Where</p>
              <p className="one-line-comment-pTag2 mb-0 mx-3 ">EveryOne</p>
            </div>
            <div className=" d-flex mx-5">
              <p className="one-line-comment-pTag3 mb-0 mx-4">Love</p>
              <p className="one-line-comment-pTag1 mb-0 ">Learning...</p>
            </div>
          </div>
          {/* <div className="card-two-div">
            <Card className="card-two">
              <Card.Header>
                <p className="card-two-pTag">Computer Science</p>
                <div
                  className="user-icon-div"
                >
                  <div><p className="mb-0 mx-2 fw-bold user-count" >Advance</p></div>
                  <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faUser} color="#767676" />
                  <p className="mb-0 mx-2 fw-bold user-count" >20</p>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="card-body-two">
                <Rating defaultValue={4} />
                <Button className="btn-card-two mx-3">$200</Button>
              </Card.Body>
            </Card>
          </div> */}
        </div>
      </div>

      <div className="extra-content-div my-4">
        <div className="extra-content-list">
          <img src={layer2} alt="" className="extra-content" />
          <p className="extra-content-pTag-one ">
            High Quality
            <p className="extra-content-pTag-two">We value quality over quantity</p>
          </p>
        </div>
        <div className="extra-content-list">
          <img src={layer3} alt="" className="extra-content" />
          <p className="extra-content-pTag-one ">
            Convenience
            <p className="extra-content-pTag-two">All courses in one place</p>
          </p>
        </div>
        <div className="extra-content-list">
          <img src={layer4} alt="" className="extra-content" />
          <p className="extra-content-pTag-one ">
            Hassle Free
            <p className="extra-content-pTag-two">Quick, easy and reliable</p>
          </p>
        </div>
        <div className="extra-content-list">
          <img src={layer1} alt="" className="extra-content" />
          <p className="extra-content-pTag-one ">
            24/7 Support
            <p className="extra-content-pTag-two">Easy Communication</p>
          </p>
        </div>
      </div>
      {categoryDetails?.length > 0 ? (
        <div className="slider-main-one">
          <div className="slider-main">
            <div className={categoryDetails?.length > 5 ? "category-div" : "category-div-one"}>
              <h3 className="slider-category">Categories</h3>
              <Button className="btn-color Kharpi-save-btn" onClick={() => history.push("/login")}>
                View All
              </Button>
            </div>
            <div className="carousel-wrapper">
              <Carousel
                itemsToShow={4}
                itemsToScroll={2}
                renderArrow={categoryDetails?.length > 5 ? ChangeArrow : null}
                className="rec-button"
              >
                {categoryDetails.map((categoryDetail, i) => (
                  <Item
                    key={categoryDetail}
                    onClick={() => {
                      history.push({
                        pathname: "course/search",
                        state: categoryDetail,
                      });
                    }}
                  >
                    <Card className="slider-card-main">
                      <div className="category-name">
                        <div className="category-sec"></div>
                        {/* <img src={overlayImg} alt="" className="category-overlay-img" /> */}
                        <p className="category-name-pTag">{categoryDetail.name}</p>
                      </div>
                      <img
                        src={categoryDetail.imageUrl ? categoryDetail.imageUrl : emptyGallery}
                        className="slider-image"
                      />
                    </Card>
                  </Item>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      ) : null}
      {/* <div className="recom-div-main">
        <div className="slider-main-recom">
          <p className="slider-category-one">Recommended Courses for you</p>
          <div className="carousel-wrapper">
            <Carousel
              itemsToShow={3}
              itemsToScroll={2}
              renderArrow={ChangeArrow}
            >
              {allCourseList.map((item, i) => (
                <ItemOne key={item}>
                  <Card className="slider-card-main-recom">
                    <div className="category-name-recom">
                      <div className="category-sec-recom"></div>
                      <img src={overlayImg} alt="" className="category-overlay-img"/>
                      <p className="category-name-pTag">{item.category.name}</p>
                    </div>
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="slider-image-recom"
                    />
                  </Card>
                </ItemOne>
              ))}
            </Carousel>
          </div>
        </div>
      </div> */}
      {allCourseList?.length > 0 ? (
        <div className="upcoming-div-main">
          <div className="upcoming-main">
            <div className={allCourseList?.length > 3 ? "upcoming-category-div-one" : "upcoming-category-div"}>
              <h3 className="slider-category-upcoming">Recommended Courses for you</h3>
              <Button className="btn-color Kharpi-save-btn" onClick={() => history.push("/login")}>
                View All
              </Button>
            </div>
            <div className="carousel-wrapper">
              <Carousel itemsToShow={3} itemsToScroll={2} renderArrow={allCourseList?.length > 3 ? ChangeArrow : null}>
                {allCourseList.map((item, i) => (
                  <ItemTwo
                    key={item}
                    onClick={() => {
                      history.push({
                        pathname: `/login`,
                        state: {
                          courseId: item.id,
                        },
                      });
                    }}
                  >
                    <Card className="slider-card-main-upcoming">
                      <img src={item.imageUrl} alt="" className="slider-image-upcoming" />
                      <div className="slider-bottom-content">
                        <div>
                          <p className="slider-bottom-content-pTag1">{item.name}</p>
                          {/* <div className="rating-user-div">
                            <div className="d-flex">
                                <FontAwesomeIcon icon={faUser} fontSize={"18px"} color="#767676" />
                                <p className="mb-0 count-tag mx-2">20</p>
                              </div>
                          </div> */}
                        </div>
                      </div>
                      <div className="desc-content">
                        <p className="desc-pTag" dangerouslySetInnerHTML={convertFromJSONToHTML(item?.description)} />
                      </div>
                      <div className="rate-btn-div-recom">
                        <Button className="rate-btn-recom">
                          <p className=" discount-amount-text-landing mb-0">${item?.discountAmount}</p>
                          <p className="actual-amount-text-landing mb-0 ">${item?.actualAmount}</p>
                        </Button>
                      </div>
                    </Card>
                  </ItemTwo>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      ) : null}
      <div className="back-image-main">
        <img src={backImg1} alt="" className="back-image-one" />
        <div className="back-image-center">
          <div className="back-image-sub-center">
            <div className="back-image-align">
              <p className="back-image-pTag1">Become an Instructor</p>
              <p className="back-image-pTag2">
                Teach what you love. Kharpi gives you the tools start
                <br /> an online course.
              </p>
              <div className="round-image-content">
                <div className="round-and-pTag justify-content-end">
                  <div className="round-img-div">
                    <img src={Img1} alt="" className="round-img" />
                  </div>
                  <p className=" next-to-image mx-2">
                    Online Based <br />
                    Class
                  </p>
                </div>
                <div className="round-and-pTag1 mx-5 justify-content-center">
                  <div className="round-img-div">
                    <img src={Img2} alt="" className="round-img" />
                  </div>
                  <p className=" next-to-image mx-2">
                    Perfect
                    <br /> Understanding
                  </p>
                </div>
                <div className="round-and-pTag justify-content-start">
                  <div className="round-img-div">
                    <img src={Img3} alt="" className="round-img" />
                  </div>
                  <p className=" next-to-image mx-2">
                    100% <br />
                    Utilization
                  </p>
                </div>
              </div>
              <div className="btn-back-image">
                <Button className="btn-back-image-main Kharpi-save-btn" onClick={() => history.push("/teacher/signup")}>
                  Teacher Signup
                </Button>
              </div>
            </div>
            <div>
              <img src={laptopImg} className="back-image-center-main" />
            </div>
          </div>
        </div>
      </div>
      {allCourseList?.length > 0 ? (
        <div className="upcoming-div-main">
          <div className="upcoming-main">
            <div className={allCourseList?.length > 3 ? "upcoming-category-div-one" : "upcoming-category-div"}>
              <h3 className="slider-category-upcoming">Upcoming Courses</h3>
              <Button className="Kharpi-save-btn" onClick={() => history.push("/login")}>
                View All
              </Button>
            </div>
            <div className="carousel-wrapper">
              <Carousel itemsToShow={3} itemsToScroll={2} renderArrow={allCourseList?.length > 3 ? ChangeArrow : null}>
                {allCourseList.map((item, i) => (
                  <ItemTwo
                    key={item}
                    onClick={() => {
                      history.push({
                        pathname: `/login`,
                        state: {
                          courseId: item.id,
                        },
                      });
                    }}
                  >
                    <Card className="slider-card-main-upcoming">
                      <img src={item.imageUrl} alt="" className="slider-image-upcoming" />
                      <div className="slider-bottom-content">
                        <div>
                          <p className="slider-bottom-content-pTag1">{item.name}</p>
                          {/* <p className="slider-bottom-content-pTag2">Advance</p> */}
                          {/* <div className="rating-user-div">
                            <Rating defaultValue={3} />
                            <div className="d-flex">
                                <FontAwesomeIcon
                                  icon={faUser}
                                  fontSize={"18px"}
                                  color="#767676"
                                />
                                <p className="mb-0 count-tag mx-2">20</p>
                              </div>
                          </div> */}
                        </div>
                      </div>
                      <div className="desc-content">
                        <p className="desc-pTag" dangerouslySetInnerHTML={convertFromJSONToHTML(item?.description)} />
                      </div>
                      <div className="rate-btn-div">
                        <Button className="rate-btn ">
                          <p className=" discount-amount-text-landing mb-0">${item?.discountAmount}</p>
                          <p className="actual-amount-text-landing mb-0 ">${item?.actualAmount}</p>
                        </Button>
                      </div>
                    </Card>
                  </ItemTwo>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      ) : null}
      {/* <div className="popular-div-main">
        <div className="upcoming-main">
          <div className="popular-category-div">
            <p className="slider-category">Popular Course Requests</p>
            <Button onClick={() => history.push("/course/search")}>
              View All
            </Button>
          </div>
          <div className="carousel-wrapper-popular">
            <Carousel
              itemsToShow={3}
              itemsToScroll={2}
              renderArrow={ChangeArrow}
            >
              {allCourseList.map((item, i) => (
                <Card className="slider-card-main-popular">
                  <div className="popular-header">
                    <div className="avatar-div-main mx-3 my-3">
                      <div className="ava-div-top">
                        <Avatar
                          src={Aimg1}
                          size="55"
                          round={true}
                          color="silver"
                        />
                      </div>
                      <div className=" slider-card-nxt-div ">
                        <p className="nxt-avatar">Teacher Name</p>
                        <p className="nxt-avatar1">1 months ago</p>
                      </div>
                    </div>
                    <div className="like-div-one">
                      <div className="like-div-sec">
                        <p className="nxt-avatar">15</p>
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          fontSize="25px"
                          color="#3992aa"
                          className="like-icon"
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="hr-line" />
                  <div>
                    <p className="pTag-content-heading">
                      Lorem ipsum is simply dummy text
                    </p>
                    <p className="pTag-main-content">
                      Lorem ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem ipsum has been the industry’s
                      standard dummy test ever since the 1500s.
                    </p>
                  </div>
                  <div className="popular-attach-content">
                    <div className="d-flex ">
                      <FontAwesomeIcon icon={faLink} className="attach-icon" />
                      <p className="attach-pTag mx-3">Attached Courses</p>
                    </div>
                    <div className="d-flex">
                      <FontAwesomeIcon
                        icon={faAddressCard}
                        className="attach-address-card mx-2 my-2"
                      />
                      <p className="adrress-card-pTag mx-2 my-2">
                        Lorem ipsum is simply dummy text
                      </p>
                    </div>
                    <div className="associated-div">
                      <p className="pTag-associated">Associated Trainers</p>
                    </div>
                  </div>
                  <div className="last-avatar-div">
                    <Avatar
                      src={Aimg2}
                      size="55"
                      round={true}
                      color="silver"
                      className="mx-1 ava-img1"
                    />
                    <Avatar
                      src={Aimg3}
                      size="55"
                      round={true}
                      color="silver"
                      className="mx-1 ava-img1"
                    />
                    <Avatar
                      src={Aimg4}
                      size="55"
                      round={true}
                      color="silver"
                      className="mx-1 ava-img1"
                    />
                  </div>
                </Card>
              ))}
            </Carousel>
          </div>
        </div>
      </div> */}
      {teacher?.length > 0 ? (
        <div className="profile-div-main">
          <div className="profile-div-sub">
            <p className="slider-trainer-upcoming">Top Trainers</p>
            <div className="carousel-wrapper">
              <Carousel itemsToShow={3} itemsToScroll={1} renderArrow={ChangeArrow}>
                {teacher?.slice(0, 5).map((item, i) => (
                  <div className="inside-carousel-div1">
                    <div className="inside-carousel-div2">
                      {item?.imageUrl ? <img src={item?.imageUrl} className="trainer-img" /> : <img src={user1} />}

                      <div className="user-details-div">
                        <div>
                          <p className="kharpi-user-name mb-0">{item?.firstName + " " + item?.lastName}</p>
                          <hr className="hr-line-user my-2" />
                          <p className="kharpi-user-profession">Business Representative</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      ) : null}
      {
        allCourseList?.length > 0 ? (
          <div className="back-image-main-last">
            <img src={backImg1} alt="" className="back-image-one" />
            <div className="back-image-center">
              <Carousel itemsToShow={1} itemsToScroll={1} renderArrow={ChangeArrowOne}>
                {allCourseList.map((item, i) => (
                  <div className="back-image-center-last">
                    <div className="coma-div">
                      <div className="coma-div2">
                        <img src={DQ} alt="" className="coma-img" />
                      </div>
                    </div>
                    <img src={Img4} className="curve-image-last" />
                    <div className="user-center-div">
                      <div>
                        <p className="user-pTag">
                          Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has
                          been the industry’s standard dummy test ever since the 1500s.
                        </p>
                        <hr className="hr-line-last m" />
                        <p className="user-date-pTag">01-01-2020</p>
                        <div className="user-content-last">
                          <Avatar src={Aimg2} size="55" round={true} color="silver" className="mx-1" />
                          <div className="mt-3">
                            <p className="kharpi-user-name-last mx-3">Kharpi User</p>
                            <p className="kharpi-user-profession-last mx-3">Business Representative</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        ) : null
        // (
        //   <Card>
        //     <h4 className="text-center my-3">Kharpi users</h4>
        //     <p className="text-center mt-3 mb-4">No Records to show !</p>
        //   </Card>
        // )
      }
      {/* <ChatBotConversation /> */}
      <div className="landing-page-footer-background">
        <Container className="p-4">
          <Row>
            <Col className=" mb-3">
              <div>
                <img src={Kharpi} width="100" height="30" className="d-inline-block align-top mt-3" alt="logo" />
              </div>
              <div
                className="d-flex flex-direction-row mt-2"
                onClick={() => {
                  window.open("https://goo.gl/maps/t5zr5AvAAzVYcWkB7", "_blank");
                }}
              >
                <FontAwesomeIcon icon={faLocationDot} width={"20px"} className="mt-1 me-1 footer-map" color="#3f51b5" />
                <text className="footer-font footer-map">Austin, </text>
                <text className="footer-font footer-map">Texas</text>
              </div>
              <div className="d-flex flex-direction-row mt-2">
                <FontAwesomeIcon icon={faPhone} width={"20px"} className="mt-1 me-1" color="#3f51b5" />
                <b className="footer-font">
                  <a href="tel:65463 464 5433" className="footer-text-decoderation linkColor">
                    +65463 464 5433
                  </a>
                </b>
              </div>
              <div className="d-flex flex-direction-row mt-2">
                <FontAwesomeIcon icon={faEnvelope} className="mt-1 me-1" color="#3f51b5" width={"20px"} />{" "}
                <b className="footer-font">
                  <a href="mailto:Kharphi@gmail.com" className="footer-text-decoderation linkColor">
                    Kharphi@gmail.com
                  </a>
                </b>
              </div>
            </Col>
            <Col className="mt-2">
              <div>
                <b>Explore</b>
                <br />
                <b>
                  <a href="/login" className="footer-font-size">
                    Courses
                  </a>
                </b>
                <br />
                <b>
                  <a href="/trainers" className="footer-font-size">
                    Trainers
                  </a>
                </b>
                <br />
                <b>
                  <a href="/about-us" className="footer-font-size">
                    About Us
                  </a>
                </b>
                <br />
                <b>
                  <a href="/terms-of-use" className="footer-font-size">
                    Terms of use
                  </a>
                </b>
                <br />
                <b>
                  <a href="privacy-policy" className="footer-font-size">
                    Privacy Policy
                  </a>
                </b>
              </div>
            </Col>
            <Col className="mt-2">
              <div>
                <b>Account</b> <br />
                <b>
                  <a href="/login" className="footer-font-size">
                    Login
                  </a>
                </b>
              </div>
            </Col>
            <Col className="mt-4">
              <div>
                <b>Stay Connected</b> <br />
                <div>
                  <a href="#facebook" className="footer-font-size d-flex flex-direction-row">
                    <FontAwesomeIcon className="me-2 mt-1" icon={faFacebook} />
                    Facebook
                  </a>
                </div>
                <div>
                  <a href="#instagram" className="footer-font-size d-flex flex-direction-row">
                    <FontAwesomeIcon className="me-2 mt-1" icon={faInstagram} />
                    Instagram
                  </a>
                </div>
                <div>
                  <a href="#twitter" className="footer-font-size d-flex flex-direction-row">
                    <FontAwesomeIcon className="me-1 mt-1" icon={faTwitter} />
                    Twitter
                  </a>
                </div>
              </div>
            </Col>
          </Row>
          <hr className="my-2 mb-2" />
          <div className="text-center copy-rights ">
            &copy; {new Date().getFullYear()} Kharphi Team <br />
            Designed by{" "}
            <a
              onClick={() => {
                window.open("https://aviartechservices.com/");
              }}
              className="footer-text-decoderation"
            >
              Aviar Technology Services
            </a>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default LandingPage;
