import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import shareVideo from "../assets/assets/share.mp4";
import Logo from "../assets/assets/logo.png";
import jwt_decode from "jwt-decode";
import { client } from "../client";
const Login = () => {
  const navigate = useNavigate();
  function handleCallbackResponse(response) {
    const userObject = jwt_decode(response.credential);
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(userObject));
    const { name, picture, sub } = userObject;

    const doc = {
      _id: sub,
      _type: "user",
      userName: name,
      image: picture,
    };
    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
  }

  useEffect(() => {
    // eslint-disable-next-line no-undef
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse,
    });
    // eslint-disable-next-line no-undef
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);
  return (
    <div className="flex justify-start items-center flex-col ">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          typeof="video/mp4"
          loop
          muted
          autoPlay
          controls={false}
          className="w-full h-screen object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0">
          <div className="p-5">
            <img src={Logo} width="130px" alt="logo" />
          </div>
          <div id="signInDiv"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
