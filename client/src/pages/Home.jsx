import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import styled from "styled-components";
import Welcome from "../components/Welcome";

import { getAllUsers, getUser } from "../utils/api";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import socket from "../socket";

const Home = () => {
  const navigate = useNavigate();

  const [currentChat, setCurrentChat] = useState({});
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    if (!localStorage.getItem("chat-app-auth")) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("chat-app-auth")));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(currentUser).length !== 0) {
      socket.auth = { user: currentUser };
      socket.connect();

      if (!currentUser.isAvatarSet) {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);

  const changeChat = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <HomeContainer>
        <div className="container">
          <Contacts
            currentUser={currentUser}
            changeChat={changeChat}
            socket={socket}
          />
          {Object.keys(currentChat).length === 0 ? (
            <Welcome />
          ) : (
            <ChatContainer
              currentUser={currentUser}
              currentChat={currentChat}
              socket={socket}
            />
          )}
        </div>
      </HomeContainer>
    </>
  );
};

const HomeContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Home;
