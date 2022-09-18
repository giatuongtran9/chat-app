import React, { useEffect, useState } from "react";

import Robot from "../assets/robot.gif";

import styled from "styled-components";

const Welcome = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const handleUser = () => {
      setUser(JSON.parse(localStorage.getItem("chat-app-auth")));
    };

    handleUser();
  }, []);

  return (
    <WelcomeContainer>
      <img src={Robot} alt="gif" />
      <h1>
        Welcome, <span>{user.username}</span>
      </h1>
      <h3>Please select a chat to start messaging</h3>
    </WelcomeContainer>
  );
};

const WelcomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;

  img {
    height: 20rem;
  }

  span {
    color: #4e0eff;
  }
`;

export default Welcome;
