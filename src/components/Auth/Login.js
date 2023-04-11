import React, { useState } from "react";
import { Button, Checkbox, Form } from "semantic-ui-react";
import { Icon } from "../../Icons";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [userMail, setUserMail] = useState("");
  const [password, setPassword] = useState("");

  const handleUserMail = (value) => {
    setUserMail(value);
  };

  const handlePassword = (value) => {
    setPassword(value);
  };

  const handleLogin = () => {
    axios
      .post("http://localhost:8080/api/auth/authenticate", {
        userMail,
        password,
      })
      .then(function (response) {
        localStorage.setItem("tokenKey", "Bearer " + response.data.token);
        localStorage.setItem("currentUser", response.data.userId);
        localStorage.setItem("userMail", userMail);
        navigate("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="w-[8.125rem] h-14 my-6">
        <Icon name="authlogo" className=" text-white" />
      </div>
      <div className="mt-6">
        <Form onSubmit={handleLogin} className="flex flex-col gap-y-2">
          <Form.Field className="flex flex-col gap-y-2 pb-6 w-[28.125rem]">
            <label className="text-sm font-bold tracking-wide">Email</label>
            <input
              onChange={(i) => handleUserMail(i.target.value)}
              className="text-black font-normal outline-gray-500 px-3 py-2 rounded-sm w-auto"
              placeholder="Type your mail address"
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
          <div className="underline text-sm font-semibold hover:text-primary mb-5">
            <a href="#">
              <span>Forgot your password?</span>
            </a>
          </div>
          <div className="flex flex-row justify-between">
            <div>
              <input name="" type="checkbox" className="accent-primary"/>
              <label className="ml-2">Remember me</label>
            </div>
            <Button
              className="bg-primary text-black text-sm font-bold rounded-[31.25rem] w-40 h-12 uppercase border-4 border-backdrop focus:outline outline-3 outline-white hover:scale-[1.04]"
              type="submit"
            >
              Login
            </Button>
          </div>
        </Form>
        <div className="flex flex-col items-center justify-center mt-20 mb-1 gap-y-10">
          <h2 className="font-bold tracking-tight">Don't you have an account?</h2>
          <NavLink to="/register">
            <Button className="w-[26rem] bg-backdrop text-[#6a6a6a] rounded-[31.25rem] border-2 py-3 px-18 border-[#878787] font-bold tracking-wide">SIGN UP FOR SPOTIFY</Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
