import React, { useState, useEffect } from "react";

import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import { feedQuery, searchQuery } from "../utils/data";
import Spinner from "./Spinner";

const Search = ({ searchTerm }) => {
  const [Pins, setPins] = useState([]);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  return (
    <div>
      {Loading && <Spinner message="searching for pins" />}
      {Pins?.length !== 0 && <MasonryLayout pins={Pins} />}
      {Pins?.length === 0 && searchTerm !== "" && !Loading && (
        <div className="mt-10 text-center text-xl">No pins found</div>
      )}
    </div>
  );
};

export default Search;
