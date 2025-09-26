import React, { useContext } from "react";
import PopularRestaurants from "../components/PopularRestaurants";
import AllRestaurants from "../components/AllRestaurants";
import { RestaurantContext } from "../context/RestaurantContext";


const HomePage = () => {
    let { restaurants } = useContext(RestaurantContext);

    return (
      <div className="container mx-auto p-4 min-h-screen">
        <PopularRestaurants restaurants={restaurants}/>
        <AllRestaurants restaurants={restaurants}/>
      </div>
    );
};

export default HomePage;
