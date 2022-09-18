import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

import styled from "styled-components";
import { registerRoute } from "../utils/api";

const Register = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const nagivate = useNavigate();

  const handleInput = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = values;

    try {
      if (password !== confirmPassword) {
        toast.error("Password not match");
        return;
      }

      const res = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      toast.success(res.data.msg);

      nagivate("/login");
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  return (
    <>
      <Toaster />
      <RegisterFormContainer>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <img alt="logo" />
            <h1>Tuong Tran</h1>
          </div>

          <input
            onChange={(e) => handleInput(e)}
            type="text"
            placeholder="Username"
            name="username"
            value={values.username}
          />
          <input
            onChange={(e) => handleInput(e)}
            type="email"
            placeholder="Email"
            name="email"
            value={values.email}
          />
          <input
            onChange={(e) => handleInput(e)}
            type="password"
            placeholder="Password"
            name="password"
            value={values.password}
          />
          <input
            onChange={(e) => handleInput(e)}
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={values.confirmPassword}
          />
          <button type="submit">Create</button>
          <span>
            Already have an account ? <Link to="/login">Login</Link>
          </span>
        </form>
      </RegisterFormContainer>
    </>
  );
};

const RegisterFormContainer = styled.div`
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

export default Register;
