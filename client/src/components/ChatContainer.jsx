import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

import styled from "styled-components";
import { addMessage, getAllMessages } from "../utils/api";
import ChatInput from "./ChatInput";

const ChatContainer = ({ currentUser, currentChat, socket }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    const getMessages = async () => {
      const res = await axios.post(getAllMessages, {
        from: currentUser._id,
        to: currentChat._id,
      });
      setMessages(res.data);
    };

    getMessages();
  }, [currentChat]);

  useEffect(() => {
    socket.on("msg-recieve", (msg) => {
      console.log(msg);
      setMessages((prev) => [...prev, { fromSelf: false, message: msg }]);
    });

    return () => {
      socket.off("msg-recieve");
    };
  }, [socket, messages]);

  // useEffect(() => {
  //   if (Object.keys(arrivalMess).length !== 0) {
  //     setMessages((prev) => [...prev, arrivalMess]);
  //   }
  // }, [arrivalMess]);

  const handleSendMsg = async (msg) => {
    socket.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      msg,
    });

    await axios.post(addMessage, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    const msgArray = [...messages];
    msgArray.push({ fromSelf: true, message: msg });
    setMessages(msgArray);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImg}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, i) => (
          <div ref={scrollRef} key={i}>
            <div
              className={`message ${message.fromSelf ? "sended" : "recieved"}`}
            >
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  overflow: hidden;

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }

    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }

    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatContainer;
