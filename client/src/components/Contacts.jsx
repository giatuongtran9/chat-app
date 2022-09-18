import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BiPowerOff } from "react-icons/bi";
import axios from "axios";
import { logout } from "../utils/api";
import { useEffect } from "react";

const Contacts = ({ currentUser, changeChat, socket }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(undefined);
  const [contacts, setContacts] = useState([]);
  const [online, setOnline] = useState([]);

  const changeCurrentChat = (contact, index) => {
    setSelected(index);
    changeChat(contact);
  };

  const handleLogout = async () => {
    const id = currentUser._id;

    const res = await axios.get(`${logout}/${id}`);

    if (res.status === 200) {
      localStorage.clear();
      socket.disconnect();
      navigate("/login");
    }
  };

  useEffect(() => {
    socket.on("user-list", (users) => {
      setContacts(users);
    });

    socket.on("user-connected", ({ user }) => {
      !contacts.some((contact) => contact._id === user._id) &&
        setContacts([...contacts, user]);
    });

    // socket.on("online-users", (onlineUsers) => {
    //   setOnline(onlineUsers);
    // });

    return () => {
      socket.off("user-list");
      socket.off("user-connected");
      // socket.off("online-users");
    };
  }, [socket, contacts]);

  // const getDifferent = (array1, array2) => {
  //   return array1.filter((object1) => {
  //     return array2.some((object2) => {
  //       return object1._id === object2._id;
  //     });
  //   });
  // };

  // console.log(getDifferent(contacts, online));

  return (
    <>
      <ContactsContainer>
        <div className="brand">
          <img alt="logo" />
          <h3>Tuong Tran</h3>
        </div>

        <div className="contacts">
          {contacts &&
            contacts.map((contact, index) => (
              <div
                className={`contact ${index === selected ? "selected" : ""}`}
                key={index}
                onClick={() => changeCurrentChat(contact, index)}
              >
                <img
                  src={`data:image/svg+xml;base64,${contact.avatarImg}`}
                  alt="avatar"
                  style={{ height: "3rem" }}
                />

                <div className="username">{contact.username}</div>
              </div>
            ))}
        </div>

        <div className="current-user">
          <div className="current-user-details">
            <img
              src={`data:image/svg+xml;base64,${currentUser.avatarImg}`}
              alt="avatar"
              style={{ height: "4rem" }}
            />
            <div className="username">
              <h2>{currentUser.username}</h2>
            </div>
          </div>

          <div className="logout-icon">
            <BiPowerOff onClick={handleLogout} />
          </div>
        </div>
      </ContactsContainer>
    </>
  );
};

const ContactsContainer = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;

    h3 {
      color: white;
      text-transform: uppercase;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;

    overflow: auto;
    gap: 0.8rem;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        border-radius: 1rem;
      }
    }

    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.4rem;
      padding: 0.4rem;
      display: flex;
      align-items: center;
      transition: 0.5s ease-in-out;
      gap: 1rem;

      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .selected {
    background-color: #9a86f3 !important;
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;

    .logout-icon {
      background-color: red;
      width: 100%;

      display: flex;
      justify-content: center;

      svg {
        font-size: 2rem;
        cursor: pointer;
      }
    }

    .current-user-details {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      width: 100%;
      padding-top: 10px;

      .username {
        h2 {
          color: white;
        }
      }
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

export default Contacts;
