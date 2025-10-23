import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { toast } from "react-toastify";

// SCSS
import "../../css/LandingPage.scss";

// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farfaHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasfaHeart } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import Api from "../../Api";

// Roles
import { ROLES_ADMIN } from "../../constants/roles";
import { useEffect } from "react";

function CourseCard({ course, key, reload, onClick }) {
  const role = localStorage.getItem("role");
  const [userId, setuserId] = useState(localStorage.getItem("userId"));
  const [courseId, setCourseId] = useState(course.id ? course.id : course._id);
  const history = useHistory();

  const isAdmin = role === ROLES_ADMIN;

  // Convert Description
  const convertFromJSONToHTML = (value) => {
    try {
      return {
        __html: stateToHTML(convertFromRaw(JSON.parse(value))),
      };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  const onSubmit = (list) => {
    const userId = localStorage.getItem("userId");
    Api.post(`api/v1/favouriteCourse`, {
      courseId: list,
      userId: userId,
    })
      .then((response) => {
        reload();
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
        }
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  return (
    <div key={key} className="landing-card-fis">
      <Card className="landing-card-height">
        {role ? (
          <Link
            to={{
              pathname: `/course/detail/${course?.aliasName}`,
              state: { courseId: course?.id },
            }}
            className="edit-link"
          >
            <div className="image-content">
              {course?.imageUrl === undefined || course?.imageUrl === null ? (
                <img
                  className="image-heigh"
                  src="https://static.wikia.nocookie.net/just-because/images/0/0c/NoImage_Available.png/revision/latest?cb=20170601005615"
                  alt="Snow"
                  width={"100%"}
                  height={"100%"}
                />
              ) : (
                <img
                  className="image-height-style"
                  src={course?.imageUrl}
                  alt={`${course?.category?.name}`}
                  width={"100%"}
                />
              )}
            </div>

            <Card.Body className="card-body-alignments">
              <Card.Title className="truncate-text">{course?.name}</Card.Title>
              <Card.Text>
                <p className="ellipsis-text" dangerouslySetInnerHTML={convertFromJSONToHTML(course?.description)}></p>
              </Card.Text>
            </Card.Body>
          </Link>
        ) : (
          <Link
            to={{
              pathname: "/login",
            }}
            className="edit-link"
          >
            <div className="image-content">
              {course?.imageUrl === undefined || course?.imageUrl === null ? (
                <img
                  className="image-heigh"
                  src="https://static.wikia.nocookie.net/just-because/images/0/0c/NoImage_Available.png/revision/latest?cb=20170601005615"
                  alt="Snow"
                  width={"100%"}
                  height={"100%"}
                />
              ) : (
                <img
                  className="image-height-style"
                  src={course?.imageUrl}
                  alt={`${course?.category?.name}`}
                  width={"100%"}
                />
              )}
            </div>

            <Card.Body className="card-body-alignments">
              <Card.Title className="truncate-text">{course?.name}</Card.Title>
              <Card.Text>
                <p className="ellipsis-text" dangerouslySetInnerHTML={convertFromJSONToHTML(course?.description)}></p>
              </Card.Text>
            </Card.Body>
          </Link>
        )}

        <Card.Footer className="d-flex justify-content-center align-items-center">
          <div style={{ width: "100%" }}>
            <div className="edit-link d-flex justify-content-center  ">
              <p className="discount-amount-text mb-0 ">${course?.discountAmount}</p>
              <p className="actual-amount-text mt-2 mb-0">${course?.actualAmount}</p>
            </div>
          </div>
          {isAdmin || userId == null ? null : course?.favourite === true ? (
            <FontAwesomeIcon
              icon={fasfaHeart}
              color="crimson"
              className="mb-2"
              style={{ fontSize: 20, cursor: "pointer" }}
              onClick={() => {
                onClick();
                onSubmit(course.id ? course.id : course._id);
              }}
            />
          ) : (
            <FontAwesomeIcon
              icon={farfaHeart}
              color="black"
              className="mb-2"
              style={{ fontSize: 20, cursor: "pointer" }}
              onClick={() => {
                onClick();
                onSubmit(course.id ? course.id : course._id);
              }}
            />
          )}
        </Card.Footer>
      </Card>
    </div>
  );
}

export default CourseCard;
