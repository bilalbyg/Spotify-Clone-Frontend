import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Icon } from "../../Icons";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userMail, setUserMail] = useState("");
  const [password, setPassword] = useState("");

  const handleFirstName = (value) => {
    setFirstName(value);
  };

  const handleLastName = (value) => {
    setLastName(value);
  };

  const handleUserMail = (value) => {
    setUserMail(value);
  };

  const handlePassword = (value) => {
    setPassword(value);
  };

  const handleRegister = () => {
    axios
      .post("http://localhost:8080/api/auth/register", {
        firstName,
        lastName,
        userMail,
        password,
      })
      .then(function (response) {
        localStorage.setItem("tokenKey", response.data.token);
        localStorage.setItem("currentUser", response.data.userId);
        localStorage.setItem("userMail", userMail);
        //window.location.replace("http://localhost:3000/login");
        //navigate("/login");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center pb-6 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-black scrollbar-thumb-rounded-lg">
      <div className="flex flex-col items-center justify-center pt-10 pb-8 w-[28.125rem] h-auto">
        <a className="w-[8.125rem]">
          <Icon name="authlogo" className="w-10 text-white" />
        </a>
        <h2 className="text-4xl text-center font-semibold tracking-tighter m-10">
          Dinlemeye başlamak için ücretsiz kaydol.
        </h2>
      </div>
      <Form
        onSubmit={handleRegister}
        className="flex flex-col gap-y-2 w-[28.125rem] pb-5"
      >
        <Form.Field className="flex flex-col gap-y-2 pb-6">
          <label className="text-sm font-bold tracking-wide">First Name</label>
          <input
            onChange={(i) => handleFirstName(i.target.value)}
            className="text-black font-normal outline-gray-500 px-3 py-2 rounded-sm w-auto"
            placeholder="Type your first name"
            type="text"
            name="firstName"
          />
        </Form.Field>
        <Form.Field className="flex flex-col gap-y-2 pb-6">
          <label className="text-sm font-bold tracking-wide">Last Name</label>
          <input
            onChange={(i) => handleLastName(i.target.value)}
            className="text-black font-normal outline-gray-500 px-3 py-2 rounded-sm w-auto"
            placeholder="Type your last name"
            type="text"
            name="lastName"
          />
        </Form.Field>
        <Form.Field className="flex flex-col gap-y-2 pb-6">
          <label className="text-sm font-bold tracking-wide">Email</label>
          <input
            onChange={(i) => handleUserMail(i.target.value)}
            className="text-black font-normal outline-gray-500 px-3 py-2 rounded-sm w-auto"
            placeholder="Type your email address"
            name="userMail"
            type="email"
          />
        </Form.Field>
        <Form.Field className="flex flex-col gap-y-2 pb-6">
          <label className="text-sm font-bold tracking-wide">Password</label>
          <input
            onChange={(i) => handlePassword(i.target.value)}
            className="text-black font-normal outline-gray-500 px-3 py-2 rounded-sm w-auto"
            placeholder="Type your password"
            type="password"
            name="password"
          />
        </Form.Field>
        <div className="flex items-center justify-center">
          <Button
            className="bg-primary text-black rounded-tl-full rounded-bl-full rounded-tr-full rounded-br-full w-[9.625rem] h-14 font-bold text-lg tracking-wide hover:scale-[1.04] border-4 border-backdrop focus:outline outline-3 outline-white"
            type="submit"
          >
            Register
          </Button>
        </div>
      </Form>

      <div className="flex flex-row gap-x-1 items-center justify-center">
        <span>
          Already registered?
          <NavLink to={"/login"}>
            <span className="underline font-bold text-primary ml-2">
              Log in
            </span>
          </NavLink>
          .
        </span>
      </div>
    </div>
  );
}
