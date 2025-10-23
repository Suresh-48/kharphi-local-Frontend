import React, { useState } from "react";
import { FormContext } from "./FormContext";
import { Col, Container, Row, Form, FormControl } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import Label from "../core/Label";

const OnlineProfileDetails = () => {
  const [value, setValue] = React.useContext(FormContext);
  const { profileData } = value;

  return (
    <>
      <div className="form-row">
        {profileData.map((inputField, index) => (
          <NormalAccordionItem index={index} inputField={inputField} />
        ))}
      </div>
    </>
  );
};

export default OnlineProfileDetails;

const NormalAccordionItem = ({ index, inputField, expanded, onClick }) => {
  const [value, setValue] = React.useContext(FormContext);
  const { profileData } = value;

  const handleAddFields = () => {
    setValue((prev) => {
      const profileData = [
        ...prev.profileData,
        { ownSite: "", facebook: "", linkedIn: "", addInfo: "" },
      ];

      return { ...prev, profileData };
    });
  };

  const handleRemoveFields = (index) => {
    setValue((prev) => {
      const profileData = prev.profileData.filter((v, i) => i !== index);
      return { ...prev, profileData };
    });
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;

    setValue((prev) => {
      const profileData = prev.profileData.map((v, i) => {
        if (i !== index) {
          return v;
        }

        return { ...v, [name]: value };
      });

      return { ...prev, profileData };
    });
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col xs={12}>
          <Form.Group
            className="form-row mb-3 input-text-style"
            style={{ marginRight: 20, width: "100%" }}
          >
            <Label className="mb-2">Professional Websites :</Label>
            <FormControl
              type="text"
              className="form-control"
              placeholder="Enter Websites"
              id="ownSite"
              name="ownSite"
              value={inputField.ownSite}
              onChange={(event) => handleInputChange(index, event)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col sm={6} md={6}>
          <Form.Group
            className="form-row mb-3"
            style={{ marginRight: 20, width: "100%" }}
          >
            <Label>Facebook :</Label>
            <FormControl
              name="facebook"
              type="type"
              id="facebook"
              placeholder="Enter Facebook Link"
              className="form-styles"
              onChange={(event) => handleInputChange(index, event)}
              value={inputField.facebook}
            />
          </Form.Group>
        </Col>
        <Col sm={6} md={6}>
          <Form.Group
            className="form-row mb-3"
            style={{ marginRight: 20, width: "100%" }}
          >
            <Label>LinkedIn :</Label>
            <FormControl
              name="linkedIn"
              type="type"
              id="linkedIn"
              placeholder="Enter LinkedIn Address"
              className="form-styles"
              onChange={(event) => handleInputChange(index, event)}
              value={inputField.linkedIn}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Form.Group
            className="form-row mb-3 input-text-style"
            style={{ marginRight: 20, width: "100%" }}
          >
            <Label  className="mb-2">
              Additional Information :
            </Label>

            <textarea
              style={{ width: "100%", height: "168px" }}
              name="addInfo"
              type="text"
              id="addInfo"
              className="form-styles"
              onChange={(event) => handleInputChange(index, event)}
              value={inputField.addInfo}
            />
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};
