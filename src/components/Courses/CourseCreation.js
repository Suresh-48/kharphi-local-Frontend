import React, { useState, useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import {
  InputGroup,
  FormControl,
  Form,
  Container,
  Modal,
  Col,
  Row,
} from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw } from "draft-js";
import { Link, useHistory } from "react-router-dom";

// Api
import Api from "../../Api";

// Styles
import "../../css/CourseCreation.scss";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faDollarSign,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

// Component
import Label from "../../components/core/Label";
import Loader from "../core/Loader";

//selector custom style
import { customStyles } from "../core/Selector";
import { useHistory } from "react-router-dom"

const SignInSchema = Yup.object().shape({
  category: Yup.object().required("Category Name Is Required"),
  courseName: Yup.string().required("Course Name Is Required"),
  descriptionValue: Yup.string().required("Description Is Required"),
  courseImage: Yup.mixed().required("Image Is Required"),
  duration: Yup.object().required("Duration is Required").nullable(),
});

const CoursesCreation = () => {
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState("");
  const [typeId, setTypeId] = useState("Draft");
  const [options, setOptions] = useState([]);
  const [show, setShow] = useState(false);
  const [selectCategory, setSelectCategory] = useState("");
  const [date, setDate] = useState("");
  const [isFuture, setIsFuture] = useState(false);
  const [imagePreview, setImagePreview] = useState(undefined);
  const [categoryImagePreview, setCategoryImagePreview] = useState(undefined);
  const [isSubmit, setIsSubmit] = useState(false);
  const [duration, setDuration] = useState("1");
  const [durationValue, setDurationValue] = useState("");
  const [imageType, setImageType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [description, setDescription] = useState(EditorState.createEmpty());
  const history = useHistory();

  useEffect(() => {
    getCategory();
  }, []);

  // Description on change
  const onChangeDescription = ({ setFieldValue }, e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    setFieldValue("descriptionValue", editedText.blocks[0].text);
  };

  // Get Course Category
  const getCategory = () => {
    const userId = localStorage.getItem("userId");
    Api.get("/api/v1/category/", { headers: { userId: userId } })
      .then((res) => {
        const option = res.data.data.data;
        setOptions(option);
        setIsLoading(false);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const handleModal = () => {
    setShow(!show);
    setSelectCategory("");
    setCategoryImagePreview(undefined);
  };

  // Form submit
  const submitForm = (values) => {
    const userId = localStorage.getItem("userId");
    const convertedData = JSON.stringify(
      convertToRaw(description.getCurrentContent())
    );
    setIsSubmit(true);
    Api.post("api/v1/course", {
      category: categoryId,
      name: values.courseName,
      description: convertedData,
      type: typeId,
      isFuture: isFuture,
      duration: duration,
      userId: userId,
    })
      .then((response) => {
        const status = response.status;
        const image = imagePreview;
        if (status === 201) {
          if (image) {
            const courseId = response.data.data.createData.id;
            Api.patch("api/v1/course/image/upload", {
              courseId: courseId,
              image: imagePreview,
              userId: userId,
            }).then((res) => {
              history.goBack();
              setIsSubmit(false);
            });
          } else {
            history.goBack();
            setIsSubmit(false);
          }
          toast.success(response?.data?.message);
        } else {
          toast.error(response.data.message);
          setIsSubmit(false);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
          setIsSubmit(false);
        }
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
        setIsSubmit(false);
      });
  };

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Create Category
  const createCategory = () => {
    setIsSubmit(true);
    const userId = localStorage.getItem("userId");
    Api.post("api/v1/category/", {
      name: selectCategory,
      createdBy: userId,
      userId: userId,
    })
      .then((response) => {
        const status = response.status;
        const data = response.data.data;
        const categoryImage = categoryImagePreview;
        if (status === 201) {
          if (categoryImage) {
            const categoryId = response.data.data.createCategory.id;
            Api.patch("api/v1/category/image/upload", {
              categoryId: categoryId,
              image: categoryImagePreview,
              userId: userId,
            }).then((res) => {
              getCategory();
              setIsSubmit(false);
            });
          } else {
            history.goBack();
            setIsSubmit(false);
          }
          setCategory({
            id: data?.createCategory?.id,
            label: data?.createCategory?.name,
          });
          setCategoryId(data?.createCategory?.id);
          setSelectCategory("");
          handleModal();
          getCategory();
          setIsSubmit(false);
        } else {
          toast.error(response.data.message);
          setIsSubmit(false);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
          setIsSubmit(false);
        }
      });
  };

  // Select Image from file
  const selectFile = async (event, { setFieldValue }) => {
    const file = event.target.files[0];
    const type = file?.type?.split("/")[0];
    const base64 = await convertBase64(file);
    setImagePreview(base64);
    setFieldValue("courseImage", base64);
  };

  // Select Image from file
  const selectCategoryFile = async (event) => {
    const file = event.target.files[0];
    const type = file?.type?.split("/")[0];
    const base64 = await convertBase64(file);
    setCategoryImagePreview(base64);
    setImageType(type);
  };

  // Convert Image to Base64
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const closePreview = (setFieldValue) => {
    setImagePreview(undefined);
    setFieldValue("courseImage", "");
  };

  const categoryImageClosePReview = () => {
    setCategoryImagePreview(undefined);
  };

  return (
    <Container>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="row">
          <div className="d-flex justify-content-center align-items-center mt-1">
            <FontAwesomeIcon icon={faBookOpen} size="3x" color="#1d1464" />
          </div>
          <div className="d-flex justify-content-center align-items-center mt-1">
            <h2>Course Creation</h2>
          </div>
          <div className="col-sm-12">
            <Formik
              enableReinitialize={true}
              initialValues={{
                category: category,
                courseName: "",
                description: "",
                descriptionValue: "",
                type: { value: "Draft", label: "Draft" },
                courseImage: "",
                duration: { value: "1", label: "1 Hour" },
              }}
              validationSchema={SignInSchema}
              onSubmit={(values) => submitForm(values)}
            >
              {(formik) => {
                const {
                  values,
                  handleChange,
                  handleSubmit,
                  handleBlur,
                  isValid,
                  setFieldValue,
                } = formik;
                return (
                  <Row>
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={7}>
                          <Form.Group className="form-row mb-3">
                            <Label notify={true}>Category</Label>
                            <Select
                              value={values.category}
                              styles={customStyles}
                              placeholder="Select Category"
                              name="category"
                              onChange={(e) => {
                                if (e.value === "create new") {
                                  handleModal();
                                } else {
                                  setFieldValue("category", e);
                                  setCategory(e);
                                  setCategoryId(e.value);
                                }
                              }}
                              options={[
                                {
                                  value: "create new",
                                  label: "Create New Category",
                                },
                                {
                                  options: options?.map((list) => ({
                                    value: list.id,
                                    label: list.name,
                                  })),
                                },
                              ]}
                            />
                            <ErrorMessage
                              name="category"
                              component="span"
                              className="error text-danger error-message"
                            />
                          </Form.Group>
                          <Form.Group className="form-row mb-3">
                            <Label notify={true}>Course Name</Label>
                            <FormControl
                              type="type"
                              name="courseName"
                              id="courseName"
                              placeholder="Enter Course Name"
                              value={values.courseName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-styles"
                            />
                            <ErrorMessage
                              name="courseName"
                              component="span"
                              className="error text-danger error-message"
                            />
                          </Form.Group>
                          <div className="mb-3">
                            <Label notify={true}>Description</Label>
                            <div className="description">
                              <Editor
                                spellCheck
                                name="descriptionValue"
                                editorState={description}
                                onEditorStateChange={(e) => {
                                  setDescription(e);
                                  onChangeDescription({ setFieldValue }, e);
                                }}
                                toolbar={{
                                  options: ["inline", "list", "textAlign"],
                                }}
                              />
                            </div>
                            <ErrorMessage
                              name="descriptionValue"
                              component="span"
                              className="error text-danger"
                            />
                          </div>

                          <div className="row mb-3">
                            <Col xs={12} sm={6} md={6}>
                              <Form.Group
                                className="form-row"
                                style={{ marginRight: 20, width: "100%" }}
                              >
                                <Label notify={true}>Status</Label>
                                <br />
                                <Select
                                  value={values.type}
                                  styles={customStyles}
                                  placeholder="Select Status"
                                  onChange={(e) => {
                                    setFieldValue("type", e);
                                    setTypeId(e.value);
                                  }}
                                  options={[{ value: "Draft", label: "Draft" }]}
                                />
                                <ErrorMessage
                                  name="type"
                                  component="span"
                                  className="error text-danger error-message"
                                />
                              </Form.Group>
                            </Col>
                            <Col xs={12} sm={6} md={6}>
                              <Form.Group className="form-row">
                                <Label notify={true}>Duration</Label>
                                <Select
                                  name="duration"
                                  styles={customStyles}
                                  placeholder="Select Duration"
                                  value={values.duration}
                                  onChange={(e) => {
                                    setFieldValue("duration", e);
                                    setDuration(e.value);
                                  }}
                                  options={[
                                    {
                                      value: "1 ",
                                      label: "1 Hour",
                                    },
                                  ]}
                                />
                                <ErrorMessage
                                  name="duration"
                                  component="span"
                                  className="error text-danger error-message"
                                />
                              </Form.Group>
                            </Col>
                          </div>
                          <div>
                            <Col
                              xs={12}
                              sm={12}
                              md={12}
                              className="d-flex justify-content-start align-items-center"
                            >
                              <Form.Group className="form-row">
                                <Form.Check
                                  className="checkbox-style mt-0"
                                  type="checkbox"
                                  label="Display In Landing Page"
                                  checked={isFuture}
                                  onChange={(e) => {
                                    setIsFuture(!isFuture);
                                  }}
                                />
                              </Form.Group>
                            </Col>
                          </div>
                        </Col>
                        <Col md={5}>
                          <Row>
                            <Row className="d-flex justify-content-center flex-direction-row ">
                              <Label className="file-upload" notify={true}>
                                <input
                                  type="file"
                                  name="courseImage"
                                  accept="image/*"
                                  className="fileToUpload"
                                  id="fileToUpload"
                                  onChange={(e) => {
                                    selectFile(e, { setFieldValue });
                                  }}
                                />
                                {imagePreview ? "Change File" : "Choose File"}
                              </Label>
                            </Row>
                            <div>
                              {imagePreview ? (
                                <div>
                                  <div className="d-flex justify-content-center mt-4">
                                    <img
                                      className="image-preview-size"
                                      src={imagePreview}
                                      alt=""
                                    />
                                  </div>
                                  <div className="d-flex justify-content-center align-items-center mt-3 ">
                                    {imageType !== "image" ? (
                                      <p className="d-flex justify-content-center error text-danger fs-6">
                                        Please Select A Image File
                                      </p>
                                    ) : (
                                      <p
                                        style={{
                                          color: "red",
                                          fontWeight: "400",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          closePreview(setFieldValue);
                                        }}
                                      >
                                        <FontAwesomeIcon
                                          icon={faTrashAlt}
                                          size="sm"
                                          color="#bf1000"
                                          className="delete-icon"
                                        />
                                        Remove Image
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <Row className="d-flex justify-content-center">
                                  <Row>
                                    <img
                                      className="image-preview-size"
                                      src="https://thumbs.dreamstime.com/b/arrow-upload-icon-logo-design-template-117344870.jpg"
                                      alt=""
                                    />
                                  </Row>
                                  <Row>
                                    <ErrorMessage
                                      className="d-flex justify-content-center error text-danger fs-6"
                                      name="courseImage"
                                      component="span"
                                    />
                                  </Row>
                                </Row>
                              )}
                            </div>
                          </Row>
                        </Col>
                        <Row className="d-flex justify-content-end align-items-center mb-4  ">
                          <Button
                            type="submit"
                            disabled={!isValid || isSubmit}
                            style={{ width: "30%" }}
                            variant="contained"
                            className={`${
                              !isValid || isSubmit
                                ? "create-disable"
                                : "create-active"
                            }`}
                          >
                            CREATE
                          </Button>
                        </Row>
                      </Row>
                    </Form>
                  </Row>
                );
              }}
            </Formik>
            <Modal show={show} centered onHide={() => handleModal()}>
              <Modal.Body id="contained-modal-title-vcenter">
                <div className="container py-3">
                  <div className="row flex-direction-row">
                    <h3 className=" d-flex justify-content-center align-self-center ">
                      Create Course Category
                    </h3>
                  </div>
                  <div className="mt-3">
                    <Row>
                      <Form className="category-form-style">
                        <Form.Group
                          className="form-row mb-3"
                          style={{ width: "100%" }}
                        >
                          <Label notify={true}>Category Name</Label>
                          <FormControl
                            className="form-styles align-self-center"
                            type="text"
                            placeholder="Category Name"
                            value={selectCategory}
                            onChange={(e) => setSelectCategory(e.target.value)}
                          />
                        </Form.Group>
                      </Form>
                    </Row>
                    <Row>
                      <Form className="category-form-style">
                        <Form.Group
                          className="form-row mb-1"
                          style={{ width: "100%" }}
                        >
                          <Label notify={true}>Select Category Image</Label>
                        </Form.Group>
                        <Form.Group
                          className="form-row "
                          style={{ width: "100%", marginBottom: "30px" }}
                        >
                          <label className="file-upload">
                            <input
                              type="file"
                              name="courseImage"
                              accept="image/*"
                              className="fileToUpload"
                              id="fileToUpload"
                              onChange={(e) => {
                                selectCategoryFile(e);
                              }}
                            />
                            {categoryImagePreview
                              ? "Change Image"
                              : "Upload Image"}
                          </label>
                        </Form.Group>
                      </Form>
                    </Row>
                    <Row>
                      <div>
                        {categoryImagePreview ? (
                          <div>
                            <div className="d-flex justify-content-center mt-4">
                              <img
                                className="image-preview-size"
                                src={categoryImagePreview}
                                alt=""
                              />
                            </div>
                            <div className="d-flex justify-content-center align-items-center mt-3 ">
                              {imageType !== "image" ? (
                                <p className="d-flex justify-content-center error text-danger fs-6">
                                  Please Select A Image File
                                </p>
                              ) : (
                                <p
                                  style={{
                                    color: "red",
                                    fontWeight: "400",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    categoryImageClosePReview();
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    size="sm"
                                    color="#bf1000"
                                    className="delete-icon"
                                  />
                                  Remove Image
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <Row className="d-flex justify-content-center">
                            <Row>
                              <img
                                className="image-preview-size"
                                src="https://thumbs.dreamstime.com/b/arrow-upload-icon-logo-design-template-117344870.jpg"
                                alt=""
                              />
                            </Row>
                          </Row>
                        )}
                      </div>
                    </Row>
                  </div>
                  <div className="mt-3 mb-3">
                    <Row>
                      <Button
                        variant="contained"
                        onClick={() => createCategory()}
                        disabled={!selectCategory}
                        style={{
                          backgroundColor: !selectCategory ? "gray" : "#1d1464",
                          color: "#fff",
                          borderRadius: "4px",
                        }}
                        className="create-category-button-style"
                      >
                        CREATE
                      </Button>
                    </Row>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      )}
    </Container>
  );
};

export default CoursesCreation;
