import React, { useState, useRef, useEffect } from "react";
import { Overlay, Tooltip } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import ReactDOM from "react-dom";
import moment from "moment-timezone";
import { useHistory } from "react-router-dom";

// Component
import Loader from "../core/Loader";

// Api
import Api from "../../Api";

// Styles
import "../../css/Calendar.scss";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);

function CalendarView(props) {
  const [teacherId, setteacherId] = useState(props?.location?.state?.rowData?.id);
  const [schedule, setschedule] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [firstName, setfirstName] = useState(props?.location?.state?.rowData?.firstName);
  const [lastName, setlastName] = useState(props?.location?.state?.rowData?.lastName);
  const userId = localStorage.getItem("userId");
  const history = useHistory();

  // Log out
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
        <Overlay rootClose target={getTarget} show={showTooltip} placement="top">
          <Tooltip id="test">
            <span>
              <div>{eventData.title}</div>
            </span>
          </Tooltip>
        </Overlay>
      </div>
    );
  }

  // get Teacher availability list
  const getAvailabilityList = () => {
    Api.get(`api/v1/teacherAvailability/list`, {
      params: {
        teacherId: teacherId,
        userId: userId,
      },
    })
      .then((response) => {
        const scheduleValue = response.data.data.availabilityList;
        setschedule(scheduleValue);
        for (let i = 0; i < scheduleValue.length; i++) {
          scheduleValue[i].start = moment.utc(scheduleValue[i].start).toDate();
          scheduleValue[i].end = moment.utc(scheduleValue[i].end).toDate();
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

  function eventStyleGetter(event, start, end, isSelected) {
    var style = {
      backgroundColor: event.status === "CourseSchedule" ? "#74be9c" : "#eaa2a2",
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

  useEffect(() => {
    getAvailabilityList();
  }, []);

  return (
    <div className="pt-1 mx-2">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="d-flex justify-content-center align-items-center">
            <h5>{`${firstName + " " + lastName}`}</h5>
          </div>
          <Calendar
            tooltipAccessor={null}
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

export default CalendarView;
