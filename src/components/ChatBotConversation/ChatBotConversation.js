import "./chatBot.css";
import react, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { BiBot, BiUser } from "react-icons/bi";
import io from "socket.io-client";
import Api from "../../Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowRight,
  faBars,
  faCircleArrowRight,
  faMessage,
  faPaperPlane,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import { Link } from "react-router-dom";
import BotImage from "../../components/core/bot.png";
import closeImage from "../../components/core/close.jpg";
import leftMinimize from "../../components/core/right.png";
import minimizeCircle from "../../components/core/minimizeCircle.jpg";
import { Dropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

function ChatBotConversation() {
  const [chat, setChat] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [botTyping, setbotTyping] = useState(false);
  const [open, setOpen] = useState(false);
  const [navBar, setNavBar] = useState(false);
  const [active, setActive] = useState(false);
  const [previousChat, setPreviousChat] = useState([]);
    const history = useHistory();


  const ref = useRef(null);
  useEffect(() => {
    ref.current?.scrollIntoView();
  }, [chat]);

  const showBox = () => {
    setOpen(true);
    getInitialData();
  };
  const getInitialData = () => {
    const recipient_msg = "Hi - I am Drona. I can help you with some initial questions";
    const recipient_msg1 = (
      <ul>
        <li>
          <a
            className="link-desc"
            // target={"_blank"}
            href="/faq#divOne"
          >
            How Can I Buy the course?
          </a>{" "}
        </li>
        <li>
          <a
            className="link-desc"
            // target={"_blank"}
            href="/faq#divTwo"
          >
            Registration
          </a>{" "}
        </li>
        <li>
          <a
            className="link-desc"
            // target={"_blank"}
            href="/faq#divThree"
          >
            Forum Creation
          </a>{" "}
        </li>
        <li>
          <a
            className="link-desc"
            // target={"_blank"}
            href="/faq#divFour"
          >
            Help with identifying the right course for me
          </a>{" "}
        </li>
      </ul>
    );
    const response_temp = { sender: "bot", msg: recipient_msg };
    const response_temp1 = { sender: "bot", msg: recipient_msg1 };

    // setPreviousChat((chat) => [...chat, response_temp, response_temp1]);
    if (chat.length > 0) {
      setChat((chat) => [...chat]);
    } else {
      setChat((chat) => [...chat, response_temp, response_temp1]);
    }
  };

  // Log out
  const logout = () => {
     setTimeout(() => {
       localStorage.clear(history.push("/kharpi"));
       window.location.reload();
     }, 2000);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const request_temp = { sender: "user", msg: inputMessage };

    if (inputMessage !== "") {
      setChat((chat) => [...chat, request_temp]);
      // setPreviousChat((chat) => [...chat]);
      setbotTyping(true);
      setInputMessage("");
    }

    Api.post("api/v1/chatbot/faq", {
      question: inputMessage,
    })
      .then((response) => {
        const status = response.status;
        if (status === 200) {
          const recipient_msg = response.data.answerData[0].answer;
          if (recipient_msg.match("help")) {
            const help_msg = "Here are few things I can help with you";
            const recipient_msg1 = (
              <ul>
                <li>
                  <a className="link-desc" target={"_blank"} href="https://kharphi.herokuapp.com/course/search">
                    How to check out the courses
                  </a>{" "}
                </li>
                <li>
                  <a className="link-desc" target={"_blank"} href="https://kharphi.herokuapp.com/student/signup">
                    How to create student login
                  </a>{" "}
                </li>
                <li>
                  <a className="link-desc" target={"_blank"} href="https://kharphi.herokuapp.com/parent/signup">
                    How to create Parent Login
                  </a>{" "}
                </li>
                <li>
                  <a className="link-desc" target={"_blank"} href="https://kharphi.herokuapp.com/favourite/course">
                    Help with identifying the right course for me
                  </a>{" "}
                </li>
              </ul>
            );
            const response_temp = { sender: "bot", msg: help_msg };
            const response_temp1 = { sender: "bot", msg: recipient_msg1 };
            setChat((chat) => [...chat, response_temp, response_temp1]);
            // setPreviousChat((chat) => [...chat]);
            setbotTyping(false);
          } else {
            const response_temp = { sender: "bot", msg: recipient_msg };
            setChat((chat) => [...chat, response_temp]);
            // setPreviousChat((chat) => [...chat, response_temp]);
            setbotTyping(false);
          }
        } else {
          const recipient_msg = (
            <text>
              Unable to get Your Questions-<b>{inputMessage}</b>
            </text>
          );

          const recipient_msg1 = (
            <a>
              Please contact{" "}
              <a href="https://kharphi.herokuapp.com/kharpi" target={"_blank"}>
                kharpi.edu@gmail.com
              </a>{" "}
              for further help or <a href="#">contact 1-888-88-8888</a>
            </a>
          );

          const response_temp = { sender: "bot", msg: recipient_msg };

          const response_temp1 = { sender: "bot", msg: recipient_msg1 };

          setChat((chat) => [...chat, response_temp, response_temp1]);
          setbotTyping(false);
        }
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  const styleBody = {
    paddingTop: "10%",
    height: "26rem",
    overflowY: "a",
    overflowX: "hidden",
    backgroundColor: "#d3d3d3",
  };

  return (
    <div>
      <div onClick={() => showBox()} className="circle-chat">
        <div className="circle-inner">
          <FontAwesomeIcon icon={faMessage} color="white" style={{ fontSize: "22px" }} />
        </div>
      </div>
      {open === true ? (
        <div className="chat-div-main" style={{ background: "#375474" }}>
          <div className="Botcard">
            <div className="bot-body">
              <div className="BotHeader ">
                <div className="d-flex justify-content-between ">
                  <div
                    onClick={() => {
                      setOpen(false);
                      setChat((previousChat) => [...previousChat]);
                    }}
                    className="mt-2"
                  >
                    {/* <img src={leftMinimize} width="30" height="25" className="d-inline-block align-top" alt="logo" /> */}
                    <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "20px" }} className="arrow-cross" />
                  </div>
                  <div className="d-flex justify-content-center mt-2">Kharphi Support Team</div>
                  <div
                    className="cancel-btn"
                  >
                    <Dropdown>
                      <Dropdown.Toggle>
                        <FontAwesomeIcon icon={faBars} size="1x" className="menu-button" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="drop-menu">
                        <Dropdown.Item className="drop-item">
                          <FontAwesomeIcon
                            icon={faCircleArrowRight}
                            style={{ fontSize: "25px" }}
                            className="minimize-btn mt-2 mb-0"
                            onClick={() => setOpen(false)}
                          />
                          <p className="mb-0" style={{ fontSize: "14px", color: "white" }}>
                            Minimize
                          </p>
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="drop-item"
                          onClick={() => {
                            setOpen(false);
                            setChat("");
                          }}
                        >
                          <FontAwesomeIcon icon={faX} style={{ fontSize: "20px" }} className="menu-button mt-3 mb-0" />
                          <p className="mb-0" style={{ fontSize: "14px", color: "white" }}>
                            End Chat
                          </p>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div>
                  {botTyping ? (
                    <div className="d-flex align-items-center typing-div ">
                      <div className="green-dot mx-1 "></div>
                      <p className="mb-0 chat-typing">Drona Typing....</p>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="cardBody" id="messageArea" style={styleBody}>
                <div className="row msgarea">
                  {chat.map((user, key) => (
                    <div key={key}>
                      {user.sender === "bot" ? (
                        <div className="msgalignstart">
                          {/* <BiBot className="botIcon" /> */}
                          <img
                            src={BotImage}
                            width="40"
                            height="40"
                            className="d-inline-block align-top mx-2"
                            alt="logo"
                          />
                          <h5 className="botmsg mx-1">{user.msg}</h5>
                        </div>
                      ) : (
                        <div className="msgalignend">
                          <h5 className="usermsg">{user.msg}</h5>
                          <BiUser className="userIcon mx-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div ref={ref} />
              </div>
              <div className="footer-align">
                <form style={{ display: "flex", width: "100%", border: "none" }} onSubmit={handleSubmit}>
                  <div className="footer-sec" style={{ paddingRight: "0px" }}>
                    <input
                      onChange={(e) => setInputMessage(e.target.value)}
                      value={inputMessage}
                      type="text"
                      className="msginp"
                      placeholder="Type Message..."
                    />
                  </div>
                  <div className="cola">
                    <button type="submit" className="circleBtn" disabled={!inputMessage}>
                      <SendIcon
                        fontSize={"10px"}
                        icon={faPaperPlane}
                        disable
                        className={`${inputMessage ? "sendBtnOn" : "sendBtnOff"}`}
                      />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ChatBotConversation;
