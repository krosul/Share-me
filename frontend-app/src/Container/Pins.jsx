import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { NavBar, Search, Feed, PinDetails, CreatePin } from "../Components";


const Pins = ({user}) => {
  const [SearchTerm, seTSearchTerm] = useState("");
  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50 dark:rounded-full">
        <NavBar searchTerm={SearchTerm} setSearchTerm={seTSearchTerm} user={user && user} />
      </div>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route path="/pin-detail/:pinId" element={<PinDetails user={user && user} />} />
          <Route path="/create-pin" element={<CreatePin user={user && user} />} />
          <Route path="/search" element={<Search searchTerm={SearchTerm} setSearchTerm={seTSearchTerm} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
