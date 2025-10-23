import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

// Component
import CourseCard from "../../components/core/CourseCard";
import Loader from "../core/Loader";

// Api
import Api from "../../Api";

const FavouriteCourse = () => {
  const [favouriteCourseList, setFavouriteCourseList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [spinner, setSpinner] = useState(false);

  // Logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    getFavouriteList();
  }, []);

  const getFavouriteList = () => {
    const userId = localStorage.getItem("userId");

    Api.get(`api/v1/favouriteCourse/user`, {
      params: {
        userId: userId,
      },
    })
      .then((response) => {
        const list = response.data.data.favouriteCourseList;
        setFavouriteCourseList(list);
        setIsLoading(false);
        setSpinner(false);
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
        }

        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }

        toast.error(error?.response?.data?.message);
      });
  };

  const spinnerLoader = () => {
    setSpinner(!spinner);
  };

  return (
    <Container className="mx-4">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <h3 className="mt-3">Favourite Courses</h3>
          <br />
          {favouriteCourseList?.length > 0 ? (
            <Row>
              {favouriteCourseList?.map((course, index) => (
                <Col xs={12} sm={6} md={6} lg={4} className="mb-5 mt-3">
                  <CourseCard
                    course={course.courseId}
                    key={index}
                    onClick={spinnerLoader}
                    reload={getFavouriteList}
                  />
                </Col>
              ))}
              {spinner && (
                <div className="spanner">
                  <Spinner animation="grow" variant="light" />
                  <span>
                    <h4 style={{ paddingLeft: 20 }}>Loading...</h4>
                  </span>
                </div>
              )}
            </Row>
          ) : (
            <div style={{ marginTop: "150px" }} className="text-center">
              No Favourite Courses List
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default FavouriteCourse;
