import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { formatTime } from '../utils/Utils';

const AllRestaurants = ({ restaurants }) => {

    const navigate = useNavigate();

    if (!restaurants) {
        return null;
    }

    return (
      <div className="w-full min-h-full py-10">
        <h1 className="font-roboto text-3xl font-bold mb-6 text-neutral-800"> Restaurants</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.uuid}
              className={`shadow-lg rounded-lg overflow-hidden w-full cursor-pointer transform transition duration-300 ${
                restaurant.is_open ? "hover:scale-105" : "opacity-60"
              }`}
              onClick={() =>
                restaurant.is_open && navigate(`/r/${restaurant.slug}/${restaurant.uuid}`)
              }
            >
              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-40 object-cover"
                />
                {!restaurant.is_open && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <h1 className="bg-red-500 text-white px-4 py-2 rounded-md">
                      Closed
                    </h1>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h1 className="text-lg font-semibold text-neutral-800">{restaurant.name}</h1>
                <p className="text-neutral-800">{restaurant.is_open ? restaurant.category : `${formatTime(restaurant.opening_time)} - ${formatTime(restaurant.closing_time)}`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}

export default AllRestaurants
