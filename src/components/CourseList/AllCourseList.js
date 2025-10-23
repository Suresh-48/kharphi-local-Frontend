import React, { useState, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import { Container, Row, Col, Button, Spinner, FormControl, Form, InputGroup, Modal } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Slider } from "@material-ui/core";
import Label from "../../components/core/Label";
import "../../css/AllCourseList.scss";
import Api from "../../Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilter } from "@fortawesome/free-solid-svg-icons";
import Loader from "../core/Loader";
import CourseCard from "../../components/core/CourseCard";
import { toast } from "react-toastify";

const AllCourseList = (props) => {
  const [landingPageCategoryList, setLandingPageCategoryList] = useState(props?.location?.state);
  const [courseList, setCourseList] = useState([]);
  const [data, setData] = useState([]);
  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState([0, 500]);
  const [spinner, setSpinner] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [courseDataList, setCourseDataList] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]);

  useEffect(() => {
    getCategory();
    courseFilter();
  }, []);

  useEffect(() => {
    courseFilter(search);
  }, [search]);

  useEffect(() => {
    const lastPage = currentPage * postPerPage;
    const firstPage = lastPage - postPerPage;
    const courseDataList = courseList.slice(firstPage, lastPage);
    setCourseDataList(courseDataList);
  }, [currentPage, postPerPage, courseList]);

  useEffect(() => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(courseList?.length / postPerPage); i++) {
      pageNumbers.push(i);
    }
    setPageNumbers(pageNumbers);
  }, [courseList, postPerPage]);

  const getCategory = () => {
    const userId = localStorage.getItem("userId");
    Api.get("api/v1/category", {
      headers: {
        userId: userId,
      },
    })
      .then((res) => {
        setCategory(res.data.data.data);
        setIsLoading(false);
        setSpinner(false);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const courseFilter = (searchData) => {
    const userId = localStorage.getItem("userId");
    const filterData = landingPageCategoryList ? [landingPageCategoryList] : data;
    Api.post("api/v1/course/filter", {
      userId: userId,
      filter: filterData,
      range: range,
      search: searchData === undefined ? search : searchData,
      userId: userId,
    })
      .then((res) => {
        const data = res.data.data;
        const assending = data.sort((a, b) => a - b);
        setCourseList(assending);
        setIsLoading(false);
        setSpinner(false);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const handleChange = (e) => {
    setSearch(e);
  };

  const spinnerLoader = () => {
    setSpinner(!spinner);
  };

  const logout = () => {
    setTimeout(() => {
      localStorage.clear(props.history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  const onSelected = (selectedList) => {
    setData(selectedList);
  };

  const onRemove = (selectedList) => {
    setData(selectedList);
  };

  const handlePageClick = (data) => {
    let selected = data.selected + 1;
    setCurrentPage(selected);
  };

  return (
    <div>
      {isLoading ? null : (
        <div className="ms-4 search-col mt-4">
          <h4 className="d-flex align-items-center">Courses</h4>
          <Form className="d-flex mt-2">
            <div>
              <Form.Group className="search-col">
                <Label>Search By Course Name</Label>
                <FormControl
                  type="text"
                  name="name"
                  onChange={(e) => {
                    handleChange(e.target.value);
                    courseFilter(e.target.value);
                  }}
                  className="form-width"
                  placeholder="Search By Course Name"
                />
              </Form.Group>
            </div>
            <div className="mt-4 ">
              <InputGroup
                className="mx-2 filter-ico"
                onClick={() => {
                  setSearchModalOpen(true);
                }}
              >
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faFilter} />
                </InputGroup.Text>
              </InputGroup>
            </div>
          </Form>
        </div>
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <Container fluid style={{ marginTop: "0%" }}>
          <Row>
            <Col className="d-flex mt-1 h-100">
              {isLoading === true ? (
                <div className="d-flex position-absolute top-50 start-50 ">
                  <Spinner animation="grow" variant="primary" />
                  <span>
                    <h4 style={{ paddingLeft: 20 }}>Loading...</h4>
                  </span>
                </div>
              ) : courseDataList.length > 0 ? (
                <Row style={{ marginLeft: 10, width: "100%" }}>
                  <Row className="mt-3">
                    {courseDataList.map((course, index) => (
                      <Col xs={12} sm={4} md={4} lg={4} xl={4} key={index}>
                        <CourseCard course={course} onClick={spinnerLoader} reload={courseFilter} />
                      </Col>
                    ))}
                  </Row>
                  <Row className="mt-3">
                    <div className="pagination-width">
                      <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageNumbers?.length}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                      />
                    </div>
                  </Row>
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
                <div className="position-absolute top-50 start-50 center-alignment">No Courses Available Here</div>
              )}
            </Col>
          </Row>
        </Container>
      )}
      <Modal
        show={searchModalOpen}
        centered
        backdrop="static"
        onHide={() => {
          setSearchModalOpen(false);
          setSearch("");
        }}
        size="md"
      >
        <Modal.Header closeButton className="border-bottom-0">
          <h5 className="filter-head-cls">Apply Filters</h5>
        </Modal.Header>
        <Modal.Body className="p-4 pt-0">
          <div>
            <div className="d-block justify-content-center">
              <p className="filter-type-name mb-1">Category</p>
              <div>
                <Multiselect
                  options={category}
                  onSelect={onSelected}
                  onRemove={onRemove}
                  displayValue="name"
                  placeholder="Select Category"
                  avoidHighlightFirstOption={true}
                  style={{ backgroundColor: "white" }}
                />
              </div>

              <div className="mt-4">
                <p className="filter-type-name mb-1">Search by name</p>
                <div className="input-group">
                  <input
                    type="text"
                    value={search}
                    className="form-control input-font-style"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      courseFilter(e.target.value);
                    }}
                    placeholder="Search"
                    aria-label="Dollar amount (with dot and two decimal places)"
                  />
                </div>
              </div>
              <div className="mt-4">
                <p className="filter-type-name mb-0">Price Range</p>
                <Slider
                  className="range-clr mx-2"
                  getAriaLabel={() => "Minimum distance"}
                  min={0}
                  max={1000}
                  value={range}
                  onChange={(event, newValue) => {
                    setRange(newValue);
                  }}
                  valueLabelDisplay="auto"
                />
                <div className="slider-count m-0">
                  <p>${range[0]}</p>
                  <p>${range[1]}</p>
                </div>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <div>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setSearch("");
                      setData([""]);
                      setRange("");
                    }}
                  >
                    Clear
                  </Button>
                </div>
                <div>
                  <Button
                    className="Kharpi-cancel-btn mx-3"
                    variant="light"
                    onClick={() => {
                      setSearchModalOpen(false);
                      setSearch("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="Kharpi-save-btn"
                    onClick={() => {
                      courseFilter();
                      setSearchModalOpen(false);
                      setSearch("");
                    }}
                  >
                    Apply Filter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AllCourseList;
