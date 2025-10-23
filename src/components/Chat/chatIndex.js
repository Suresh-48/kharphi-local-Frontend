import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Container, Form, Col, Row } from "react-bootstrap";

import Api from "../../Api";
import { toast } from "react-toastify";

function Chat() {
  const [chatList, setChatList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    getCourseID();
  }, []);

  const getCourseID = () => {
    const courseId = "620f652a7aebd931987cf953";
    const courseScheduleId = "62134a2c7738170f6c05a4e6";

    Api.get("api/v1/chat/getChatMembers", {
      params: {
        courseId: courseId,
        courseScheduleId: courseScheduleId,
        userId: userId,
      },
    })
      .then((response) => {
        const data = response?.data?.chatList;
        setChatList(data);
        setSearchList(data);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const handleOnChange = async (e) => {
    let value = e.target.value;
    const ww = value.toLowerCase();
    const ss = chatList.filter((value) => value.firstName.toLowerCase().match(new RegExp(ww, "g")));
    setSearchList(ss);
  };

  return (
    <Container fluid style={{ position: "relative" }}>
      <Row
        shadow
        style={{
          height: "calc(100vh - 123px)",
          position: "absolute",
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Col sm={4} style={{ overflowY: "scroll", height: "calc(100vh - 123px)" }}>
          <Form>
            <Form.Group
              shadow
              style={{ width: "100%", boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2),0 3px 10px 0 rgba(0,0,0,0.19)" }}
            >
              <Form.Control
                type="text"
                name="search"
                placeholder="Search..."
                id="search "
                onChange={handleOnChange}
                className="mt-2"
                style={{ width: "100%" }}
                hover
              />
            </Form.Group>

            <div>
              {searchList.map((list, i) => (
                <>
                  <Stack direction="row" spacing={2} className="mt-2 mb-2">
                    <Avatar alt="avatar" sx={{ width: 45, height: 45 }} />
                    <div className="d-flex justify-content-center align-items-center">
                      <h6>{list.firstName}</h6>
                    </div>
                  </Stack>
                  <hr className=" " />
                </>
              ))}
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Chat;
