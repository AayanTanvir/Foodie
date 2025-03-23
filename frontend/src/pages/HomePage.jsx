import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import PopularRestaurants from "../components/PopularRestaurants";
import TrendingRestaurants from "../components/TrendingRestaurants";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto p-4 min-h-screen overflow-auto">
      <PopularRestaurants />
      <TrendingRestaurants />
    </div>
  );
};

export default HomePage;
