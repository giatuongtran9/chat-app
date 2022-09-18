import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import loader from "../assets/loading.gif";
import { Buffer } from "buffer";
import toast, { Toaster } from "react-hot-toast";
import { setAva } from "../utils/api";
import { useNavigate } from "react-router-dom";

const SetAvatar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    const getImg = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const res = await axios.get(
          `https://api.multiavatar.com/${Math.round(Math.random() * 1000)}`
        );

        const buffer = new Buffer(res.data);
        data.push(buffer.toString("base64"));
      }

      setAvatars(data);
      setIsLoading(false);
    };

    getImg();
  }, []);

  const randomAva = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  const setProfilePic = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar");
    } else {
      const user = JSON.parse(localStorage.getItem("chat-app-auth"));

      const res = await axios.post(`${setAva}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (res.data.isSet) {
        user.isAvatarSet = true;
        user.avatarImg = res.data.image;

        localStorage.setItem("chat-app-auth", JSON.stringify(user));

        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again");
      }
    }
  };

  return (
    <>
      <Toaster />
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${
                  selectedAvatar === index ? "selected" : ""
                }`}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  onClick={() => setSelectedAvatar(index)}
                />
              </div>
            ))}
          </div>

          <button onClick={setProfilePic} className="submit-btn">
            Set as Profile Picture
          </button>
          <button onClick={randomAva} className="random-ava">
            Choose Another Avatar
          </button>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  position: relative;

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        height: 6rem;
      }
    }

    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      /* background-color:  */
    }
  }

  .random-ava {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
  }
`;

export default SetAvatar;
