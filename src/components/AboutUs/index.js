import React from "react";
import { Container, Row, Col } from "react-bootstrap";
// Style
import "../../css/LandingPage.scss";

function AboutUs() {
  return (
    <div>
      <Container>
        <div>
          <h1 className="heading mt-2">Preparing Kids For Life After School...!</h1>
        </div>
        <div className="d-flex justify-content-center pt-4">
          <p  className="txt_top">
            <b>Our mission</b> is to help kids develop the skills and mindsets
            to become innovators ,inventors and entrepreneurs. <br />
            Will your child graduate from high school or college with all the
            skills needed to get and keep a job ? Many parents look to educators
            to prepare their children for the workplace. Teaching soft skills is
            more important than ever before.
          </p>
        </div>
        <br />
        <Row className="m-0">
          <Col className="d-flex justify-content-center" xs={12} sm={6}>
            <img
              className="image_view_1"
              src="https://images.squarespace-cdn.com/content/v1/583ed05c59cc68a8c3e45c0f/1482074282081-KQBCRLEWPLWTJKWBCR4X/vision.png?format=750w"
              alt="Snow"
            />
          </Col>

          <Col
            xs={12}  sm={6}
            className=" d-flex justify-content-center align-items-center txt_view"
          >
            <p className="mb-0">
              For years, hiring managers have long been reporting a lack of soft
              skills in recent graduates. Research conducted in 2018 with
              Fortune 500 CEOs by the Stanford Research Institute International
              and the Carnegie Melon Foundation, found that 75% of long-term job
              success depends on people skills. Only 25% depended on job-related
              skills.Curiosity Quotient and Emotional Quotient are vital in life, yet
              the official education system predominantly concentrates on IQ.
            </p>
          </Col>
        </Row>
        <br />
        <Row>
          <Col
            className="d-flex justify-content-center align-items-center txt_view"
            xs={12}  sm={6}
          >
            <p>
               We
              looked for a comprehensive resource to assist us guide our child
              toward becoming self-assured, responsible, and future-ready, but
              we couldn't find one. Kharpi is here to address this void by
              offering a structured framework for children to build life skills.
              Our curriculum was created in collaboration with professionals in
              the fields of education, health, nutrition, child development,
              parenting, and psychology. We want to work with you to help our
              children grow strength, character, knowledge, and skills.
              <b>Let's make the future generation confident and joyful.</b>
            </p>
          </Col>
          <Col className="d-flex justify-content-center" xs={12}  sm={6}>
            <img
              className="image_view_1 mb-5"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR38xBLKoM7n78xMUuL51iKMmpd-Bu3nBzWdyzsaYmm1-U8h7atjRmYerABn5Y4wNgo07Y&usqp=CAU"
              alt="Snow"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AboutUs;
