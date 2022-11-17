import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { client, urlFor } from "../client";
import { fecthUser } from "../utils/fecthUser";

const Pin = ({ pin: { postedBy, image, _id, destination, save },reload }) => {
  const navigate = useNavigate();
  const [PostHovered, setPostHovered] = useState(false);
  const [SavedPost, setSavedPost] = useState(false);
  const user = fecthUser();

  let alreadySaved = save?.filter(
    (item) => item?.postedBy?._id === user?.sub
  );

  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];
  const handleChangeHovered = () => {
    return setPostHovered(!PostHovered);
  };
  // console.log(alreadySaved)
  const savePin = (_id) => {
    console.log(alreadySaved);
    if (!alreadySaved.length) {
      console.log("entro");
      setSavedPost(true);
      client
        .patch(_id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuid4(),
            userId: user?.sub,
            postedBy: {
              _type: "postedBy",
              _ref: user?.sub,
            },
          },
        ])
        .commit()
        .then((data) => {

          // window.location.reload();
          console.log("llego")
          reload(true)
          setSavedPost(false);
        });
    }
  };
  const deletePin = (_id) => {
    client.delete(_id).then(() => {
      window.location.reload();
    });
  };
  const handleSavedPin = (e) => {
    e.stopPropagation();
    savePin(_id);
  };
  const handleDeletePin = (e) => {
    e.stopPropagation();
    deletePin(_id);
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => handleChangeHovered()}
        onMouseLeave={() => handleChangeHovered()}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          src={urlFor(image).width(250).url()}
          className="rounded-lg w-full"
          alt="pin"
        />
        {PostHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className=" bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved.length ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
                  onClick={(e) => handleSavedPin(e)}
                >
                  {save?.length} {SavedPost ? "Saving" : "Save"}
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4  pr-4 rounded-full opacity-70 hover:100 hover:shadow-md"
                  lef="noreferrer"
                  rel="noreferrer"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination?.length > 20
                    ? destination.slice(8, 20)
                    : destination.slice(8)}
                </a>
              )}
              {postedBy?._id === user?.sub && (
                <button
                  type="button"
                  onClick={(e) => handleDeletePin(e)}
                  className="bg-white p-2 opacity-70 hover:opacity-100  font-bold text-dark text-base rounded-3xl hover:shadow-md outlined-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user profile"
        />
        <p className="font-semibold capitalize dark:text-white">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
