/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { AioutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

  const randomImage =
  "https://source.unsplash.com/1600x900/?nature,technology,photograpy/";

const activeBtnStyles =
  "bg-red-500 tex-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";
const UserProfile = () => {
  const [User, setUser] = useState(null);
  const [Pins, setPins] = useState([]);
  const [Text, setText] = useState("created");
  const [ActiveBton, setActiveBton] = useState("created");
  const navigate = useNavigate();

  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (Text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [Text, userId]);
  if (!User) {
    return <Spinner message="loading user profile" />;
  }

  google.accounts.id.renderButton(document.getElementById("g_id_signout"), {
    theme: "outline",
    size: "large",
    type: "icon",
    // text: "signin"
  });

  const logout = () => {
    localStorage.clear();
  };
  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
              alt="banner-pic"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={User.image}
              alt="user-pic"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {User.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === User._id && (
                <div
                  // className="g_id_signout"
                  id="g_id_signout"
                  onClick={() => google.accounts.id.disableAutoSelect()}
                ></div>
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBton("Created");
              }}
              className={`${
                ActiveBton === "Created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBton("Saved");
              }}
              className={`${
                ActiveBton === "Saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>
          <div>
            {Pins.length ? (
              <div className="px-2">
                <MasonryLayout pins={Pins} />
              </div>
            ) : (
              <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
                No pins found..
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
