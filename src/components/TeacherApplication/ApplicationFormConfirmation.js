import React, { useState } from "react";
import { FormContext } from "./FormContext";
import { Col, Row } from "react-bootstrap";
import moment from "moment";
import "../../css/TeacherApplicationForm.scss";
import { List, ListItem, ListItemText } from "@material-ui/core";

const ApplicationFormConfirmation = () => {
  const [value, setValue] = React.useContext(FormContext);
  const { educationData } = value;
  const { experienceData } = value;
  const { profileData } = value;
  return (
    <>
      <div className="form-row">
        {educationData?.length > 0 ? (
          <div>
            {" "}
            {educationData.map((index, i) => (
              <List className="application">
                <div>
                  <Row className="teacher-profile-header">
                    <h5 className="d-flex justify-content-start">
                      EDUCATION INFORMATION
                    </h5>
                  </Row>
                  <Row>
                    <Col>
                      <ListItem>
                        <ListItemText
                          id="institution"
                          primary="Institution Name"
                        ></ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={
                            index.institution ? index.institution : "-"
                          }
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText id="subject" primary="Subject" />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={index.subject ? index.subject : "-"}
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText
                          id="yearOfPassing"
                          primary="Year of Passing"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={
                            index.yearOfPassing.value
                              ? index.yearOfPassing.value
                              : "-"
                          }
                        ></ListItemText>
                      </ListItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ListItem>
                        <ListItemText id="state" primary="State"></ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={index.state ? index.state : "-"}
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText id="city" primary="City" />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={index.city ? index.city : "-"}
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText id="country" primary="Country" />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={
                            index.country.value ? index.country.value : "-"
                          }
                        ></ListItemText>
                      </ListItem>
                    </Col>
                  </Row>
                </div>
              </List>
            ))}
          </div>
        ) : null}
      </div>
      <hr />
      <div className="form-row">
        {experienceData?.length > 0 ? (
          <div>
            {" "}
            {experienceData.map((index, i) => (
              <List className="application">
                <div>
                  <Row className="teacher-profile-header">
                    <h5 className="d-flex justify-content-start">
                      WORKING INFORMATION
                    </h5>
                  </Row>
                  <Row>
                    <Col>
                      <ListItem>
                        <ListItemText
                          id="workInstitution"
                          primary="Work Institution Name"
                        ></ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={
                            index.workInstitution ? index.workInstitution : "-"
                          }
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText
                          id="subjectTaught"
                          primary="Subjects Taught"
                        />
                      </ListItem>
                      <ListItem>
                        {index.subjectTaught.map(
                          (skill, i) => skill.value + ",  "
                        )}
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText
                          id="experience"
                          primary="Year of Experience"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={index.experience ? index.experience : "-"}
                        ></ListItemText>
                      </ListItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ListItem>
                        <ListItemText id="role" primary="Role"></ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={index.role.value ? index.role.value : "-"}
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText id="startDate" primary="Start Date" />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={
                            index.startDate
                              ? moment(index.startDate).format("MMM DD YYYY")
                              : "-"
                          }
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText id="endDate" primary="End Date" />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={
                            index.endDate
                              ? moment(index.endDate).format("MMM DD YYYY")
                              : "-"
                          }
                        ></ListItemText>
                      </ListItem>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <ListItem>
                        <ListItemText
                          id="classSize"
                          primary="Class Size"
                        ></ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={index.classSize ? index.classSize : "-"}
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText
                          id="ageRangeFrom"
                          primary="Age Range From"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={
                            index.ageRangeFrom ? index.ageRangeFrom : "-"
                          }
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText id="ageRangeTo" primary="Age Range To" />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={index.ageRangeTo ? index.ageRangeTo : "-"}
                        ></ListItemText>
                      </ListItem>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <ListItem>
                        <ListItemText
                          id="workAddress1"
                          primary="Address Line 1"
                        ></ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={
                            index.workAddress1 ? index.workAddress1 : "-"
                          }
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText
                          id="workAddress2"
                          primary="Address Line 2"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={
                            index.workAddress2 ? index.workAddress2 : "-"
                          }
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText id="workState" primary="State" />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={index.workState ? index.workState : "-"}
                        ></ListItemText>
                      </ListItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ListItem>
                        <ListItemText
                          id="workCity"
                          primary="City"
                        ></ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={index.workCity ? index.workCity : "-"}
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText id="workCountry" primary="Country" />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={
                            index.workCountry.value
                              ? index.workCountry.value
                              : "-"
                          }
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText id="workZipCode" primary="Zip Code" />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={
                            index.workZipCode ? index.workZipCode : "-"
                          }
                        ></ListItemText>
                      </ListItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ListItem>
                        <ListItemText
                          id="workInsWebsite"
                          primary="Web site"
                        ></ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={
                            index.workInsWebsite ? index.workInsWebsite : "-"
                          }
                        ></ListItemText>
                      </ListItem>
                    </Col>
                  </Row>
                </div>
              </List>
            ))}
          </div>
        ) : null}
      </div>
      <hr />
      <div className="form-row">
        {profileData?.length > 0 ? (
          <div>
            {" "}
            {profileData.map((index, i) => (
              <List className="application">
                <div>
                  <Row className="teacher-profile-header">
                    <h5 className="d-flex justify-content-start">
                      PROFILE INFORMATION
                    </h5>
                  </Row>
                  <Row>
                    <Col>
                      <ListItem>
                        <ListItemText
                          id="ownSite"
                          primary="Professional Websites"
                        ></ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={index.ownSite ? index.ownSite : "-"}
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col>
                      <ListItem>
                        <ListItemText id="facebook" primary="Facebook" />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={index.facebook ? index.facebook : "-"}
                        ></ListItemText>
                      </ListItem>
                    </Col>
                    <Col style={{ flexDirection: "column" }}>
                      <ListItem>
                        <ListItemText id="linkedIn" primary="LinkedIn" />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={index.linkedIn ? index.linkedIn : "-"}
                        ></ListItemText>
                      </ListItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ListItem>
                        <ListItemText
                          id="addInfo"
                          primary="Additional Information"
                        ></ListItemText>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          secondary={index.addInfo ? index.addInfo : "-"}
                        ></ListItemText>
                      </ListItem>
                    </Col>
                  </Row>
                </div>
              </List>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ApplicationFormConfirmation;
