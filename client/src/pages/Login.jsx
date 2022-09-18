import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import styled from "styled-components";
import { loginRoute } from "../utils/api";

const Login = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = values;

    try {
      const res = await axios.post(loginRoute, { username, password });
      console.log(res.data);

      if (res.status === 200) {
        localStorage.setItem("chat-app-auth", JSON.stringify(res.data.user));
        toast.success(res.data.msg);

        navigate("/");
      }
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  return (
    <>
      <Toaster />
      <LoginFormContainer>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <img alt="logo" />
            <h1>Tuong Tran</h1>
          </div>

          <input
            type="text"
            placeholder="Username"
            name="username"
            value={values.username}
            onChange={(e) => handleInput(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={(e) => handleInput(e)}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/register">Register</Link>
          </span>
        </form>
      </LoginFormContainer>
    </>
  );
};

const LoginFormContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #131324;

  .brand {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    img {
      height: 5rem;
    }

    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #00000076;
    gap: 2rem;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;

    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }

  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem;
    border: none;
    cursor: pointer;
    font-weight: bold;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    width: 100%;
    &:hover {
      background-color: #997af0;
    }
  }

  span {
    color: white;
    text-transform: uppercase;

    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Login;
