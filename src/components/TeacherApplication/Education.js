import React, { useState } from "react";
import { FormContext } from "./FormContext";
import { Col, Container, Row, Form, FormControl } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import "../../css/TeacherApplicationForm.scss";

//Components
import Label from "../core/Label";
import states from "../../components/core/States";
import years from "../../components/core/Years";
import countries from "../../components/core/Countries";
import { customStyles } from "../core/Selector";

const Education = () => {
  const [value, setValue] = React.useContext(FormContext);

  const { educationData } = value;

  return (
    <>
      <div className="form-row">
        {educationData.map((inputField, index) => (
          <NormalAccordionItem index={index} inputField={inputField} />
        ))}
      </div>
    </>
  );
};

export const educationSchema = (event) => {
  const eduation = event.educationData;
  let status = false;
  let newArr = eduation.map(function (value) {
    if (
      !value.institution ||
      !value.subject ||
      !value.yearOfPassing ||
      !value.state ||
      !value.city ||
      !value.country
    ) {
      status = false;
    } else {
      status = true;
    }
  });

  return status;
};

export default Education;

const NormalAccordionItem = ({ index, inputField, expanded, onClick }) => {
  const [value, setValue] = React.useContext(FormContext);
  const [errorsShow, setErrorsShow] = React.useContext(FormContext);

  const [stateCode, setStateCode] = useState("");

  const { educationData } = value;

  const handleAddFields = () => {
    setValue((prev) => {
      const educationData = [
        ...prev.educationData,
        {
          institution: "",
          subject: "",
          yearOfPassing: "",
          state: "",
          city: "",
          country: "",
        },
      ];

      return { ...prev, educationData };
    });
  };

  const handleRemoveFields = (index) => {
    setValue((prev) => {
      const educationData = prev.educationData.filter((v, i) => i !== index);
      return { ...prev, educationData };
    });
  };

  const handleInputChange = (index, event) => {
    if (event.target) {
      const { name, value } = event.target;

      setValue((prev) => {
        const educationData = prev.educationData.map((v, i) => {
          if (i !== index) {
            return v;
          }

          return { ...v, [name]: value };
        });

        return { ...prev, educationData };
      });
    } else {
      const { name, value } = event.value;
      setValue((prev) => {
        const educationData = prev.educationData.map((v, i) => {
          if (i !== index) {
            return v;
          }

          return { ...v, [name]: value };
        });

        return { ...prev, educationData };
      });
    }
  };

  const Index = (value) => {
    let selectState = value;
    for (let i = 0; i < states.length; i++) {
      if (states[i].state === selectState.value) {
        setStateCode(i);
      }
    }
  };

  const handleChangeState = (e) => {
    inputField.state = e;
    inputField.city = "";
  };

  const handleChangeCity = (e) => {
    inputField.city = e;
  };
  const handleChangeYear = (e) => {
    inputField.yearOfPassing = e;
  };
  const handleChangeCountry = (e) => {
    inputField.country = e;
  };
  return (
    <Container>
      <Row className="mt-4">
        <Col xs={12}>
          <Form.Group
            className="form-row mb-3 input-text-style"
            style={{ marginRight: 20, width: "100%" }}
          >
            <Label notify={true} className="mb-2">
              Institution Name
            </Label>
            <FormControl
              type="text"
              className="form-control"
              placeholder="Institution Name"
              id="institution"
              name="institution"
              value={inputField.institution}
              onChange={(event) => handleInputChange(index, event)}
            />
            <span className="text-danger">
              {!inputField.institution ? value.errors.institution : ""}
            </span>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={6} md={6}>
          <Form.Group
            className="form-row mb-3 input-text-style"
            style={{ marginRight: 20, width: "100%" }}
          >
            <Label notify={true} className="mb-2">
              Degree / Department
            </Label>
            <FormControl
              type="text"
              name="subject"
              id="subject"
              className="form-control"
              placeholder="Eg: BE / CSE"
              onChange={(event) => handleInputChange(index, event)}
              value={inputField.subject}
            />
            <span className="text-danger">
              {!inputField.subject ? value.errors.subject : ""}
            </span>
          </Form.Group>
        </Col>

        <Col sm={6} md={6}>
          <Form.Group
            className="form-row mb-3 input-text-style"
            style={{ marginRight: 20, width: "100%" }}
          >
            <Label notify={true} className="mb-2">
              Year of Passing
            </Label>
            <Select
              styles={customStyles}
              value={inputField.yearOfPassing}
              name="yearOfPassing"
              placeholder="Year of Passing"
              onChange={(event) => {
                Index(event);
                handleChangeYear(event);
                handleInputChange(index, event);
              }}
              options={years.map((item) => ({
                label: item,
                value: item,
              }))}
            />
            <span className="text-danger">
              {!inputField.yearOfPassing ? value.errors.yearOfPassing : ""}
            </span>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={6} md={6}>
          <Form.Group
            className="form-row mb-3 input-text-style"
            style={{ marginRight: 20, width: "100%" }}
          >
            <Label notify={true} className="mb-2">
              City
            </Label>
            <FormControl
              placeholder="City"
              value={inputField.city}
              name="city"
              onChange={(event) => {
                handleInputChange(index, event);
              }}
            />
            <span className="text-danger">
              {!inputField.city ? value.errors.city : ""}
            </span>
          </Form.Group>
        </Col>

        <Col sm={6} md={6}>
          {" "}
          <Form.Group
            className="form-row mb-3 input-text-style"
            style={{ marginRight: 20, width: "100%" }}
          >
            <Label notify={true} className="mb-2">
              States
            </Label>
            <FormControl
              value={inputField.state}
              name="state"
              placeholder="State"
              onChange={(event) => {
                Index(event);
                handleInputChange(index, event);
              }}
            />
            <span className="text-danger">
              {!inputField.state ? value.errors.state : ""}
            </span>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={6} md={6}>
          <Form.Group
            className="form-row mb-3 input-text-style"
            style={{ marginRight: 20, width: "100%" }}
          >
            <Label notify={true} className="mb-2">
              Country
            </Label>
            <Select
              value={inputField.country}
              styles={customStyles}
              name="country"
              placeholder="Country"
              onChange={(event) => {
                Index(event);
                handleChangeCountry(event);
                handleInputChange(index, event);
              }}
              options={countries.map((item) => ({
                label: item,
                value: item,
              }))}
            />
            <span className="text-danger">
              {!inputField.country ? value.errors.country : ""}
            </span>
          </Form.Group>
        </Col>
      </Row>
      <div className="d-flex mt-2 mb-4">
        <Button
          variant="contained"
          color="primary"
          type="button"
          className={"me-2"}
          onClick={() => handleAddFields()}
        >
          ADD MORE
        </Button>

        {educationData?.length > 1 ? (
          <Button
            className="Kharpi-cancel-btn me-1"
            variant="contained"
            color="error"
            type="button"
            onClick={() => handleRemoveFields(index)}
          >
            REMOVE
          </Button>
        ) : null}
      </div>
    </Container>
  );
};
