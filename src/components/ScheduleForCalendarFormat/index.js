import React, { useState, useRef, useEffect, Children } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Modal,
  Row,
  Form,
  Col,
  Overlay,
  Tooltip,
  FormControl,
} from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Button from "@restart/ui/esm/Button";
import { Formik } from "formik";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import ReactDOM from "react-dom";
import moment from "moment-timezone";
import { useHistory } from "react-router-dom";

// Component
import Loader from "../core/Loader";

// Api
import Api from "../../Api";

// Styles
import "../../css/Calendar.scss";

//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);

function ScheduleForCalendarFormat(props) {
  const [studentId, setstudentId] = useState(props?.location?.state?.studentId);
  const [parentId, setparentId] = useState(props?.location?.state?.parentId);
  const [teacherId, setteacherId] = useState(props?.location?.state?.teacherId);
  const [firstName, setfirstName] = useState(props?.location?.state?.firstName);
  const [lastName, setlastName] = useState(props?.location?.state?.lastName);
  const [schedule, setschedule] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const history = useHistory();
  const userId = localStorage.getItem("userId");

  //logout
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Overlay for tooltip
  function Event(event) {
    const [showTooltip, setShowTooltip] = useState(false);

    const closeTooltip = () => {
      setShowTooltip(false);
    };
    const openTooltip = () => {
      setShowTooltip(true);
    };
    const ref = useRef(null);

    const getTarget = () => {
      return ReactDOM.findDOMNode(ref.current);
    };

    const eventData = event.event;

    return (
      <div ref={ref}>
        <span onMouseEnter={openTooltip} onMouseLeave={closeTooltip}>
          {event.title}
        </span>
        <Overlay
          rootClose
          target={getTarget}
          show={showTooltip}
          placement="top"
        >
          <Tooltip id="test">
            <span>
              <div>{event.title}</div>
            </span>
          </Tooltip>
        </Overlay>
      </div>
    );
  }

  const getStudentScheduleList = () => {
    Api.get(`api/v1/upcomingCourse/calendar/view`, {
      params: {
        studentId: studentId,
        userId: userId,
      },
    })
      .then((response) => {
        const data = response.data.upcomingList;
        setschedule(data);
        for (let i = 0; i < data.length; i++) {
          data[i].start = moment.utc(data[i].start).toDate();
          data[i].end = moment.utc(data[i].end).toDate();
        }
        setisLoading(false);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const getParentScheduleList = () => {
    Api.get(`api/v1/upcomingCourse/calendar/view`, {
      params: {
        parentId: parentId,
        userId: userId,
      },
    })
      .then((response) => {
        const data = response.data.upcomingList;
        setschedule(data);
        for (let i = 0; i < data.length; i++) {
          data[i].start = moment.utc(data[i].start).toDate();
          data[i].end = moment.utc(data[i].end).toDate();
        }
        setisLoading(false);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const getTeacherScheduleList = async () => {
    await setschedule(props.location.state.teacherSchedule);
    setisLoading(false);
  };

  useEffect(() => {
    studentId && getStudentScheduleList();
    parentId && getParentScheduleList();
    teacherId && getTeacherScheduleList();
  }, []);

  function eventStyleGetter(event, start, end, isSelected) {
    var style = {
      backgroundColor: "#74be9c",
      borderRadius: "6px",
      color: "black",
      fontSize: 14,
      border: "0px",
      display: "block",
    };
    return {
      style: style,
    };
  }

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="pt-1 mx-3">
          <div className="d-flex justify-content-end pt-3">
            <FontAwesomeIcon
              icon={faTable}
              color="#397ad4"
              style={{ cursor: "pointer", fontSize: 30 }}
              onClick={() => {
                history.goBack();
              }}
            />
          </div>
          {firstName === undefined && lastName === undefined ? null : (
            <h5 className="d-flex justify-content-center align-items-center pb-3">
              {`${firstName + " " + lastName + " Upcoming Schedule "}`}
            </h5>
          )}
          <Calendar
            tooltipAccessor={null}
            views={["month", "day", "agenda"]}
            components={{ event: Event }}
            selectable={true}
            localizer={localizer}
            events={schedule}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={(event) => eventStyleGetter(event)}
            style={{ height: 500, margin: "50px" }}
          />
        </div>
      )}
    </div>
  );
}

export default ScheduleForCalendarFormat;
