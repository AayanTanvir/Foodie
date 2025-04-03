import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import PopularRestaurants from "../components/PopularRestaurants";
import TrendingRestaurants from "../components/TrendingRestaurants";

const HomePage = () => {

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <PopularRestaurants />
      <TrendingRestaurants />
    </div>
  );
};

export default HomePage;
