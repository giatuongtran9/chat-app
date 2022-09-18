import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";

import { addMessage } from "../utils/api";

const ChatInput = ({ handleSendMsg }) => {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setEmojiPicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
      setEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emojiObject, event) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const handleEmojiPicker = () => {
    setEmojiPicker(!showEmojiPicker);
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPicker} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>

      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
};

const Container = styled.div`
  /* display: grid;
  grid-template-columns: 5% 95%; */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #080420;
  padding: 0 2rem;
  gap: 1rem;
  position: relative;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
  }

  @media screen and (max-width: 719px) {
    padding: 0;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;

    .emoji {
      svg {
        font-size: 2rem;
        color: #ffff00c8;
        cursor: pointer;

        @media screen and (max-width: 719px) {
          margin-left: 0.5rem;
        }
      }

      .EmojiPickerReact {
        position: absolute;
        bottom: 85px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;

        @media screen and (max-width: 719px) {
          width: 100%;
        }
      }
    }
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;

    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }

      &:focus {
        outline: none;
      }

      @media screen and (max-width: 719px) {
        font-size: 0.8rem;
      }
    }

    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }

      @media screen and (max-width: 719px) {
        padding: 0 0.2rem;
      }

      svg {
        font-size: 2rem;
        color: white;
      }
    }

    @media screen and (max-width: 719px) {
      margin-right: 0.5rem;
    }
  }
`;

export default ChatInput;
