import React, { useState, useEffect } from "react";
import { FormProvider, FormContext } from "./FormContext";
import Stepper from "react-stepper-horizontal";
import {
  Col,
  Container,
  Row,
  FormControl,
  InputGroup,
  Modal,
} from "react-bootstrap";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { educationSchema } from "./Education";
import { experienceSchema } from "./Experience";
// Api
import Api from "../../Api";

import Education from "./Education";
import Experience from "./Experience";
import OnlineProfileDetails from "./OnlineProfileDetails";
import ApplicationFormConfirmation from "./ApplicationFormConfirmation";

const Form = () => {
  const [value] = React.useContext(FormContext);
  const [errorsShow, setErrorShow] = React.useContext(FormContext);
  const [teacherId, setTeacherId] = useState("");
  const history = useHistory();
  const [show, setShow] = useState(false);
  const userId = localStorage.getItem("userId");

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const sections = [
    { title: "Education", onClick: () => setCurrentPage(1) },
    { title: "Experience", onClick: () => setCurrentPage(2) },
    { title: "Online Profile", onClick: () => setCurrentPage(3) },
    {
      title: "Application Form Confirmation ",
      onClick: () => setCurrentPage(4),
    },
  ];

  useEffect(() => {
    const teacherId = localStorage.getItem("teacherId");
    Api.get(`api/v1/teacherApplication/${teacherId}`, {
      headers: { userId: userId },
    })
      .then((response) => {
        const data = response.data.getTeacherApplication;
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
    setTeacherId(teacherId);
  }, []);

  const handleModal = () => {
    setShow(false);
  };

  const handleConfirm = () => {
    setShow(true);
  };
  const updateStatus = () => {
    alert("test");
  };

  const handleSubmit = (e) => {
    let applicationStatus = "Review";
    Api.post(`api/v1/teacherApplication`, {
      teacherId: teacherId,
      education: value.educationData,
      experience: value.experienceData,
      profile: value.profileData,
      userId: userId,
    })
      .then((response) => {
        const status = response.status;
        if (status === 201) {
          toast.success("Updated Successfully");
          history.push("/teacher/application/details");
          window.location.reload();
          Api.patch(`api/v1/teacherApplication/status/${teacherId}`, {
            status: applicationStatus,
            userId: userId,
          })
            .then((response) => {})
            .catch((error) => {
              const errorStatus = error?.response?.status;
              if (errorStatus === 401) {
                logout();
                toast.error("Session Timeout");
              }
            });
        }
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          toast.error(error.response.data.message);
        }
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const EducationValidation = () => {
    let res = educationSchema(value);
    if (res === true) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setCurrentPage((prev) => prev);
    }
  };

  const ExperienceValidation = () => {
    let res = experienceSchema(value);
    if (res === true) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setCurrentPage((prev) => prev);
    }
  };
  const prev = () => setCurrentPage((prev) => prev - 1);
  const next = () => setCurrentPage((prev) => prev + 1);

  return (
    <>
      <Container>
        <form onSubmit={handleSubmit}>
          <Stepper
            steps={sections}
            activeStep={currentPage - 1}
            activeColor="red"
            defaultBarColor="red"
            completeColor="green"
            completeBarColor="green"
          />

          {currentPage === 1 && (
            <>
              <Education />
              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  style={{ width: "15%" }}
                  onClick={EducationValidation}
                >
                  NEXT
                </Button>
              </div>
            </>
          )}

          {currentPage === 2 && (
            <>
              <Experience />
              <div className="d-flex justify-content-end mt-5">
                <Button
                  type="button"
                  className="me-2 Kharpi-cancel-btn"
                  style={{ width: "15%" }}
                  onClick={prev}
                >
                  Back
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  style={{ width: "15%" }}
                  onClick={ExperienceValidation}
                >
                  NEXT
                </Button>
              </div>
            </>
          )}

          {currentPage === 3 && (
            <>
              <OnlineProfileDetails />
              <div className="d-flex justify-content-end mt-5">
                <Button
                  type="button"
                  className="me-2 Kharpi-cancel-btn"
                  style={{ width: "15%" }}
                  onClick={prev}
                >
                  Back
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  className="me-2"
                  style={{ width: "15%" }}
                  onClick={next}
                >
                  NEXT
                </Button>
              </div>
            </>
          )}

          {currentPage === 4 && (
            <>
              <ApplicationFormConfirmation />
              <Row>
                <Col>
                  <div className="d-flex justify-content-end mt-3">
                    <Button
                      color="primary"
                      type="button"
                      className="me-2 Kharpi-cancel-btn"
                      style={{ width: "15%" }}
                      onClick={prev}
                    >
                      Back
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      type="button"
                      style={{ width: "15%" }}
                      onClick={handleConfirm}
                    >
                      Submit
                    </Button>
                  </div>
                </Col>
              </Row>
              <div>
                <Modal show={show} onHide={() => handleModal()} centered>
                  <Modal.Body id="contained-modal-title-vcenter">
                    <div className="container py-3">
                      <div className="row flex-direction-row">
                        <p>
                          Please verify the details before submitting the
                          application. Do you want to submit the application?
                        </p>
                      </div>
                      <div className="mt-3">
                        <Row className="button-content-style">
                          <Col xs={6} sm={6} md={6}>
                            <Button
                              type="submit"
                              fullWidth
                              className="Kharpi-cancel-btn"
                              style={{ width: "100%", borderRadius: 5 }}
                              onClick={handleModal}
                            >
                              Cancel
                            </Button>
                          </Col>
                          <Col xs={6} sm={6} md={6}>
                            <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              color="primary"
                              onClick={handleSubmit}
                            >
                              Submit
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
            </>
          )}
        </form>
      </Container>
    </>
  );
};

export default function App() {
  return (
    <FormProvider>
      <Form />
    </FormProvider>
  );
}
