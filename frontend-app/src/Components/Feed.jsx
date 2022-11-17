import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout.jsx";
import Spinner from "./Spinner";

const Feed = () => {
  const [Loading, seTLoading] = useState(false);
  const [Pins, setPins] = useState(null);
  const [Reload, setReload] = useState(false)
  const { categoryId } = useParams();

  useEffect(() => {
    seTLoading(true);

    if (categoryId) {
      const query = searchQuery(categoryId);

      client.fetch(query).then((data) => {
        console.log(data);
        setPins(data);
        seTLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        console.log(data);
        setPins(data);
        seTLoading(false);
      });
    }
  }, [categoryId,Reload]);

  if (Loading) {
    return <Spinner message="We are adding new ideas to your feed!" />;
  }
  if(!Pins?.length){
    return <h2 className="w-full text-center">no pins available</h2>
  }
  return <div>{Pins && <MasonryLayout pins={Pins} reload={setReload} />}</div>;
};

export default Feed;
