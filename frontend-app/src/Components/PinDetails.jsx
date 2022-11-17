import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuid4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetails = ({ user }) => {
  const [Pins, setPins] = useState([]);
  const [PinDetail, setPinDetail] = useState(null);
  const [Comments, setComments] = useState("");
  const [AddingComment, setAddCingomment] = useState(false);
  const { pinId } = useParams();

  const fetchPinDetail = () => {
    let query = pinDetailQuery(pinId);

    if (!query) {
      return;
    }
    client.fetch(query).then((data) => {
      console.log(data)
      setPinDetail(data[0]);

      if (data[0]) {
        query = pinDetailMorePinQuery(data[0]);
        client.fetch(query).then((data) => {
          console.log(data)
          setPins(data);
        });
      }
    });
  };
  useEffect(() => {
    fetchPinDetail();
  }, [pinId]);

  if (!PinDetail) {
    return <Spinner message="Loading ping..." />;
  }

  const addComment = () => {
    if (Comments) {
      setAddCingomment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comments:Comments,
            _key: uuid4(),
            postedBy: { _type: "postedBy", _ref: user._id },
          },
        ])
        .commit()
        .then((data) => {
          console.log(data)
          fetchPinDetail();
          setComments("");
          setAddCingomment(false);
        });
    }
  };

  return (
    <>
    <div className="flex xl:flex-row flex-col m-auto bg-white max-w-screen-2xl rounded-[32px]">
      <div className=" flex justify-center items-center md:items-start flex-initial">
        <img
          src={PinDetail?.image && urlFor(PinDetail.image).url()}
          alt="pin"
          className="rounded-t-3xl rounded-b-lg"
        />
      </div>
      <div className="w-full p-5 flex-1 xl:min-w-620">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <a
              href={`${PinDetail.image?.asset?.url}?dl=`}
              download
              onClick={(e) => e.stopPropagation()}
              className=" bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75"
            >
              <MdDownloadForOffline />
            </a>
          </div>
          <a href={PinDetail.destination} target="_blank" rel="noreferrer">
            {PinDetail.destination}
          </a>
        </div>
        <div>
          <h1 className="text-4xl font-bold break-words mt-3">
            {PinDetail.title}
          </h1>
          <p className="mt-3">{PinDetail.about}</p>
        </div>
        <Link
          className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          to={`/user-profile/${PinDetail.postedBy?._id}`}
        >
          <img
            className="w-8 rounded-full object-cover"
            src={PinDetail.postedBy?.image}
            alt="user profile"
          />
          <p className="font-semibold capitalize">
            {PinDetail.postedBy?.userName}
          </p>
        </Link>
        <h2 className="mt-5 text-2xl">Comments</h2>
        <div className="max-h-370 overflow-y-auto">
          {PinDetail?.comments?.map((co, index) => (
            <div
              className="flex gap-2 mt-5 items-center bg-white rounded-lg"
              key={index}
            >
              <img
                src={co.postedBy.image}
                alt="user profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
              <div className="flex flex-col">
                <p className="font-bold">{co.postedBy.userName}</p>
                <p>{co.comments}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap mt-6 gap-3">
          <Link to={`/user-profile/${PinDetail.postedBy?._id}`}>
            <img
              className="w-10 h-10 rounded-full cursor-pointer"
              src={PinDetail.postedBy?.image}
              alt="user profile"
            />
          </Link>
          <input
            className="flex-1 border-gray-100 outline-none border-2 p-2 focues:border-gray-300 rounded-lg"
            type="text"
            placeholder="Add a comment"
            value={Comments}
            onChange={(e) => setComments(e.target.value)}
          />
          <button
            type="button"
            className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
            onClick={addComment}
          >
            {AddingComment ? "Posting comment" : "Post"}
          </button>
        </div>
      </div>
    </div>
      {Pins.length?(
        <>
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More Like This
        </h2>
        <MasonryLayout pins={Pins}/>
        </>
      ):(
        <Spinner message='loading pins...'/>
      )}
      </>
  );
};

export default PinDetails;
