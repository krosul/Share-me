import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { client } from "../client";
import Spinner from "./Spinner";
import { categories } from "../utils/data";

const CreatePin = ({ user }) => {
  const [Title, setTitle] = useState("");
  const [About, setAbout] = useState("");
  const [Destination, setDestination] = useState("");
  const [Loading, setLoading] = useState(false);
  const [Fields, setFields] = useState(false);
  const [Category, setCategory] = useState(null);
  const [ImageAsset, setImageAsset] = useState(null);
  const [WrongTypeImage, setWrongTypeImage] = useState("");

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if (!type.includes("images")) {
      setWrongTypeImage(true);
    }
    setWrongTypeImage(false);
    setLoading(true);
    client.assets
      .upload("image", e.target.files[0], { contentType: type, filename: name })
      .then((doc) => {
        console.log(doc);
        setImageAsset(doc);
        setLoading(false);
      })
      .catch((err) => {
        console.log("something fail in the upload of the image", err);
      });
  };
  const savePin = (e) => {
    if (!Title || !About || !Destination || !ImageAsset?._id || !Category) {
      setFields(true);
      setTimeout(()=>setFields(false),3500)
      return
    }
    const doc = {
      _type: "pin",
      title: Title,
      about: About,
      destination: Destination,
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: ImageAsset?._id,
        },
      },
      userId: user._id,
      postedBy: {
        _type: "postedBy",
        _ref: user._id,
      },
      Category,
    };
    client.create(doc).then((data) => {

      navigate("/");
    });
  };
  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:4/5">
      {Fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
          Please fill all the fields
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {Loading && <Spinner />}
            {WrongTypeImage && <p>Wrong image type</p>}
            {!ImageAsset ? (
              <label>
                <div className="flex flex-col justify-center items-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    use high-quality JPG,SVG,PNG, GIF less than 20 MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className=" w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={ImageAsset?.url}
                  alt="uploaded pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={Title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          {user && (
            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
              <img
                src={user.image}
                className="w-10 h-10 rounded-full"
                alt="user profile"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}
          <input
            type="text"
            value={About}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="what is your pin about"
            className="outline-none text-base sm:text-large border-b-2 border-gray-200 p-2"
          />
          <input
            type="text"
            value={Destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="outline-none text-base sm:text-large border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">
                Choose your pin category
              </p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="other" className="bg-white">
                  Select category
                </option>

                {categories.map((cat) => (
                  <option
                    key={cat.name}
                    className="text-base border-0 outline-none capitalize bg-white text-black"
                    value={cat.name}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
