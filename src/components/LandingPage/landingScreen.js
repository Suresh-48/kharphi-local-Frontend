import React from "react";
import {
  Container,
  Carousel,
  Button,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";
import cd from "./cd.png";

import "../../css/LandingPage.scss";

const courseData = [
  {
    title: "Cooking Delicious Dinners",
    description:
      "In this weekly class learners are guided to cook nutritious, delicious dinners from scratch.",
    imageUrl:
      "https://images.unsplash.com/photo-1549740425-5e9ed4d8cd34?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwzOTU0NTB8fGVufDB8fHx8&w=1000&q=80",
    price: 100,
    offeredPrice: 70,
    discount: 30,
  },
  {
    title: "Cooking Delicious Dinners",
    description:
      "In this weekly class learners are guided to cook nutritious, delicious dinners from scratch.",
    imageUrl: "https://wallpaperaccess.com/full/222577.jpg",
    price: 100,
    offeredPrice: 70,
    discount: 30,
  },
  {
    title: "Cooking Delicious Dinners",
    description:
      "In this weekly class learners are guided to cook nutritious, delicious dinners from scratch.",
    imageUrl: cd,
    price: 100,
    offeredPrice: 70,
    discount: 30,
  },
  {
    title: "Cooking Delicious Dinners",
    description:
      "In this weekly class learners are guided to cook nutritious, delicious dinners from scratch.",
    imageUrl: "https://wallpaperaccess.com/full/222577.jpg",
    price: 100,
    offeredPrice: 70,
    discount: 30,
  },
  {
    title: "Cooking Delicious Dinners",
    description:
      "In this weekly class learners are guided to cook nutritious, delicious dinners from scratch.",
    imageUrl: cd,
    price: 100,
    offeredPrice: 70,
    discount: 30,
  },
  {
    title: "Cooking Delicious Dinners",
    description:
      "In this weekly class learners are guided to cook nutritious, delicious dinners from scratch.",
    imageUrl:
      "https://images.unsplash.com/photo-1549740425-5e9ed4d8cd34?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwzOTU0NTB8fGVufDB8fHx8&w=1000&q=80",
    price: 100,
    offeredPrice: 70,
    discount: 30,
  },
];

const LandingPage = () => {
  return (
    <Container fluid>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://wallpaperaccess.com/full/1285952.jpg"
            alt="First slide"
            height="500"
            width="100%"
          />
          <Carousel.Caption>
            <h3>Where Kids Love Learning</h3>
            <Button className="Kharpi-save-btn" variant="success">
              Start Now
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <Container className="session-top">
        <Row className="justify-content-md-center mb-3">
          <Col md="auto">
            <h1>Over 100,000 Interactive Online Classes</h1>
          </Col>
        </Row>

        <Row>
          {courseData.map((course) => (
            <Col sm={4} className="mb-3">
              <Card>
                <Card.Img variant="top" src={course.imageUrl} height="200" />
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text className="card-text">
                    {course.description}
                  </Card.Text>
                  <div className="card-div">
                    <Badge pill bg="success">
                      4.4
                    </Badge>

                    <span className="card-text">(1000)</span>
                  </div>{" "}
                  <div className="card-div">
                    <span>
                      <h6 className="card-price">
                        {" "}
                        Price: ${course.offeredPrice}
                      </h6>{" "}
                      <s className="card-text">${course.price}</s>
                      <Badge pill bg="success">
                        {course.discount}% off
                      </Badge>
                    </span>
                  </div>
                </Card.Body>
                <Card.Footer className="card-footer">
                  <Button
                    variant="primary"
                    className="cart-button Kharpi-save-btn"
                  >
                    Add to Cart
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <div className="footer">
        <h6>Copyrights @ Kharphi</h6>
      </div>
    </Container>
  );
};

export default LandingPage;
