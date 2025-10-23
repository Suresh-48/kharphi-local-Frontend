import React, { useEffect, useState } from "react";
import { FormContext } from "./FormContext";
import {
  Col,
  Container,
  Row,
  Form,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DatePicker from "react-datepicker";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import Select from "react-select";

//Components
import Label from "../core/Label";
import states from "../../components/core/States";
import countries from "../../components/core/Countries";

// Api
import Api from "../../Api";

//Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { customStyles } from "../core/Selector";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const Experience = () => {
  const [value, setValue] = React.useContext(FormContext);
  const { experienceData } = value;

  return (
    <>
      <div className="form-row">
        {experienceData.map((inputField, index) => (
          <NormalAccordionItem index={index} inputField={inputField} />
        ))}
      </div>
    </>
  );
};

export const experienceSchema = (event) => {
  const experience = event.experienceData;
  let status = false;
  let newArr = experience.map(function (value) {
    if (
      !value.workInstitution ||
      !value.experience ||
      !value.role ||
      !value.startDate ||
      !value.workInstitution ||
      !value.classSize ||
      !value.ageRangeFrom ||
      !value.ageRangeTo ||
      !value.workAddress1 ||
      !value.workState ||
      !value.workCity ||
      !value.workCountry ||
      !value.workZipCode
    ) {
      status = false;
    } else {
      status = true;
    }
  });

  return status;
};

export default Experience;

const NormalAccordionItem = ({ index, inputField, expanded, onClick }) => {
  const [value, setValue] = React.useContext(FormContext);
  const { experienceData } = value;
  const [stateCode, setStateCode] = useState("");
  const [category, setCategory] = useState([]);
  const history = useHistory();

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Get Course Category
  const getCategory = () => {
    Api.get("api/v1/category").then((res) => {
      const option = res.data.data.data;
      setCategory(option);
    });
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handleAddFields = () => {
    setValue((prev) => {
      const experienceData = [
        ...prev.experienceData,
        {
          workInstitution: "",
          subjectTaught: [],
          experience: "",
          role: "",
          startDate: "",
          endDate: "",
          classSize: "",
          ageRangeFrom: "",
          ageRangeTo: "",
          workAddress1: "",
          workAddress2: "",
          workState: "",
          workCity: "",
          workCountry: "",
          workZipCode: "",
          workInsWebsite: "",
        },
      ];

      return { ...prev, experienceData };
    });
  };

  const handleRemoveFields = (index) => {
    setValue((prev) => {
      const experienceData = prev.experienceData.filter((v, i) => i !== index);
      return { ...prev, experienceData };
    });
  };

  const handleInputChange = (index, event) => {
    if (event.target) {
      const { name, value } = event.target;

      setValue((prev) => {
        const experienceData = prev.experienceData.map((v, i) => {
          if (i !== index) {
            return v;
          }

          return { ...v, [name]: value };
        });

        return { ...prev, experienceData };
      });
    } else {
      const { name, value } = event;

      setValue((prev) => {
        const experienceData = prev.experienceData.map((v, i) => {
          if (i !== index) {
            return v;
          }

          return { ...v, [name]: value };
        });

        return { ...prev, experienceData };
      });
    }
  };

  const handleChange = (e) => {
    inputField.role = e;
  };

  const options = [
    { value: "Teacher", label: "Teacher" },
    {
      value: "Teaching Assistant,",
      label: "Teaching Assistant",
    },
    { value: "Admin", label: "Admin" },
    {
      value: "Volunteer",
      label: "Volunteer",
    },
    { value: "Personal", label: "Personal" },
    { value: "Other", label: "Other" },
  ];

  const Index = (value) => {
    let selectState = value;
    for (let i = 0; i < states.length; i++) {
      if (states[i].state === selectState.value) {
        setStateCode(i);
      }
    }
  };
  const handleChangeStartDate = (e) => {
    inputField.startDate = e;
  };
  const handleChangeEndDate = (e) => {
    inputField.endDate = e;
  };

  const handleChangeState = (e) => {
    inputField.workState = e;
    inputField.workCity = "";
  };

  const handleChangeCity = (e) => {
    inputField.workCity = e;
  };

  const handleChangeCountry = (e) => {
    inputField.workCountry = e;
  };
  const handleChangeRole = (e) => {
    inputField.role = e;
  };
  const handleChangeSubjectTaught = (e) => {
    inputField.subjectTaught = e;
  };
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Container>
        <Row className="mt-4">
          <Col xs={12} sm={6} md={6}>
            <Form.Group
              className="form-row mb-2"
              style={{
                marginRight: 20,
                width: "100%",
              }}
            >
              <Label notify={true}> Work Institution Name</Label>
              <FormControl
                type="text"
                className="form-control"
                placeholder="Work Institution Name"
                id="workInstitution"
                name="workInstitution"
                value={inputField.workInstitution}
                onChange={(event) => handleInputChange(index, event)}
              />
              <span className="text-danger">
                {!inputField.workInstitution
                  ? value.errors.workInstitution
                  : ""}
              </span>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Form.Group className="form-row mb-2">
              <Label>Subjects Taught</Label>
              <Select
                isMulti
                styles={customStyles}
                value={inputField.subjectTaught}
                name="subjectTaught"
                placeholder="Choose Skills..."
                onChange={(event) => {
                  handleChangeSubjectTaught(event);
                  handleInputChange(index, event);
                }}
                options={[
                  {
                    options: category.map((list) => ({
                      value: list.name,
                      label: list.name,
                    })),
                  },
                ]}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col xs={12} sm={6} md={6}>
            <Form.Group
              className="form-row mb-2"
              style={{
                marginRight: 20,
                width: "100%",
              }}
            >
              <Label notify={true}>Experience</Label>
              <FormControl
                type="type"
                id="experience"
                name="experience"
                placeholder="Enter Your Experience"
                className="form-styles"
                onChange={(event) => handleInputChange(index, event)}
                value={inputField.experience}
              />
              <span className="text-danger">
                {!inputField.experience ? value.errors.experience : ""}
              </span>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <Form.Group className="form-row mb-2">
              <Label notify={true}>Role</Label>
              <Select
                value={inputField.role}
                name="role"
                styles={customStyles}
                placeholder="Choose Role..."
                onChange={(event) => {
                  handleChangeRole(event);
                  handleInputChange(index, event);
                }}
                options={options}
              />
              <span className="text-danger">
                {!inputField.role ? value.errors.role : ""}
              </span>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col xs={12} sm={6}>
            <Form.Group className="form-row mb-2">
              <Label notify={true}>Role Start Date</Label>
              <br />
              <KeyboardDatePicker
                variant="standard"
                className="start-time-style"
                style={{ paddingLeft: 10 }}
                placeholder="Select Start Date"
                helperText={""}
                InputProps={{
                  disableUnderline: true,
                }}
                format="MMM dd yyyy"
                value={inputField.startDate}
                onChange={(event) => {
                  handleChangeStartDate(event);
                  handleInputChange(index, event);
                }}
                keyboardIcon={
                  <FontAwesomeIcon
                    icon={faCalendarDay}
                    size="sm"
                    color="grey"
                    style={{ padding: 0 }}
                  />
                }
              />
              <span className="text-danger">
                {!inputField.startDate ? value.errors.startDate : ""}
              </span>
            </Form.Group>
          </Col>

          <Col xs={12} sm={6}>
            <Form.Group className="form-row mb-2">
              <Label>Role End Date</Label>
              <br />
              <KeyboardDatePicker
                variant="standard"
                className="start-time-style"
                style={{ paddingLeft: 10 }}
                placeholder="Select End Date"
                helperText={""}
                InputProps={{
                  disableUnderline: true,
                }}
                format="MMM dd yyyy"
                value={inputField.endDate}
                onChange={(event) => {
                  handleChangeEndDate(event);
                  handleInputChange(index, event);
                }}
                keyboardIcon={
                  <FontAwesomeIcon
                    icon={faCalendarDay}
                    size="sm"
                    color="grey"
                    style={{ padding: 0 }}
                  />
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col sm={4} md={4}>
            <Form.Group
              className="form-row mb-2"
              style={{
                marginRight: 20,
                width: "100%",
              }}
            >
              <Label notify={true}>Class Size</Label>
              <FormControl
                type="type"
                placeholder="Enter Class Size"
                id="classSize"
                name="classSize"
                className="form-width"
                onChange={(event) => handleInputChange(index, event)}
                value={inputField.classSize}
              />
              <span className="text-danger">
                {!inputField.classSize ? value.errors.classSize : ""}
              </span>
            </Form.Group>
          </Col>
          <Col sm={4} md={4}>
            <Form.Group
              className="form-row mb-2"
              style={{
                marginRight: 20,
                width: "100%",
              }}
            >
              <Label notify={true}>Student Age Range From</Label>
              <FormControl
                type="type"
                placeholder="Age Range From"
                id="ageRangeFrom"
                name="ageRangeFrom"
                className="form-width"
                onChange={(event) => handleInputChange(index, event)}
                value={inputField.ageRangeFrom}
              />
              <span className="text-danger">
                {!inputField.ageRangeFrom ? value.errors.ageRangeFrom : ""}
              </span>
            </Form.Group>
          </Col>
          <Col sm={4} md={4}>
            <Form.Group
              className="form-row mb-2"
              style={{
                marginRight: 20,
                width: "100%",
              }}
            >
              <Label notify={true}>Student Age Range To</Label>
              <FormControl
                type="type"
                placeholder="Age Range To"
                id="ageRangeTo"
                name="ageRangeTo"
                className="form-width"
                onChange={(event) => handleInputChange(index, event)}
                value={inputField.ageRangeTo}
              />
              <span className="text-danger">
                {!inputField.ageRangeTo ? value.errors.ageRangeTo : ""}
              </span>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col sm={6} md={6}>
            <Form.Group
              className="form-row mb-2"
              style={{
                marginRight: 20,
                width: "100%",
              }}
            >
              <Label notify={true}>Institution Address Line 1</Label>
              <FormControl
                type="type"
                placeholder="Address Line 1"
                id="workAddress1"
                name="workAddress1"
                className="form-width"
                onChange={(event) => handleInputChange(index, event)}
                value={inputField.workAddress1}
              />
              <span className="text-danger">
                {!inputField.workAddress1 ? value.errors.workAddress1 : ""}
              </span>
            </Form.Group>
          </Col>
          <Col sm={6} md={6}>
            <Form.Group
              className="form-row mb-2"
              style={{
                marginRight: 20,
                width: "100%",
              }}
            >
              <Label>Institution Address Line 2</Label>
              <FormControl
                type="type"
                placeholder="Address Line 2"
                id="workAddress2"
                name="workAddress2"
                className="form-width"
                onChange={(event) => handleInputChange(index, event)}
                value={inputField.workAddress2}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm={4} md={4}>
            <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
              <Label notify={true}>City</Label>
              <FormControl
                placeholder="City"
                value={inputField.workCity}
                name="workCity"
                onChange={(event) => {
                  handleInputChange(index, event);
                }}
              />
              <span className="text-danger">
                {!inputField.workCity ? value.errors.workCity : ""}
              </span>
            </Form.Group>
          </Col>
          <Col sm={4} md={4}>
            <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
              <Label notify={true}>State</Label>
              <FormControl
                value={inputField.workState}
                name="workState"
                placeholder="State"
                onChange={(event) => {
                  handleInputChange(index, event);
                }}
              />
              <span className="text-danger">
                {!inputField.workState ? value.errors.workState : ""}
              </span>
            </Form.Group>
          </Col>
          <Col sm={4} md={4}>
            <Form.Group
              className="form-row mb-2"
              style={{
                marginRight: 20,
                width: "100%",
              }}
            >
              <Label notify={true}>Country</Label>
              <Select
                value={inputField.workCountry}
                name="workCountry"
                placeholder="Country"
                styles={customStyles}
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
                {!inputField.workCountry ? value.errors.workCountry : ""}
              </span>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={6}>
            <Form.Group
              className="form-row mb-2"
              style={{
                marginRight: 20,
                width: "100%",
              }}
            >
              <Label notify={true}>Zip Code</Label>
              <FormControl
                type="tel"
                placeholder="Zip Code"
                id="workZipCode"
                name="workZipCode"
                maxLength={5}
                className="form-width"
                onChange={(event) => handleInputChange(index, event)}
                value={inputField.workZipCode}
              />
              <span className="text-danger">
                {!inputField.workZipCode ? value.errors.workZipCode : ""}
              </span>
            </Form.Group>
          </Col>
          <Col sm={6} md={6}>
            <Form.Group
              className="form-row mb-2"
              style={{
                marginRight: 20,
                width: "100%",
              }}
            >
              <Label>Web site</Label>
              <FormControl
                type="type"
                placeholder="Enter Website if any"
                name="workInsWebsite"
                id="workInsWebsite"
                onChange={(event) => handleInputChange(index, event)}
                value={inputField.workInsWebsite}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-start mt-2 mb-4">
          {experienceData?.length > 1 ? (
            <Button
              variant="contained"
              color="error"
              className="Kharpi-cancel-btn me-1"
              type="button"
              onClick={() => handleRemoveFields(index)}
            >
              REMOVE
            </Button>
          ) : null}
          <Button
            variant="contained"
            color="primary"
            type="button"
            className={"ms-1"}
            onClick={() => handleAddFields()}
          >
            ADD MORE
          </Button>
        </div>
      </Container>
    </MuiPickersUtilsProvider>
  );
};
