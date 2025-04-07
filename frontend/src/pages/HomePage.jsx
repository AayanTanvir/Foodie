import React, {useState, useEffect, useContext} from "react";
import PopularRestaurants from "../components/PopularRestaurants";
import AllRestaurants from "../components/AllRestaurants";
import AuthContext from "../context/AuthContext";

const HomePage = () => {

    let { setFailureMessage } = useContext(AuthContext);
    const [restaurants, setRestaurants] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/restaurants/")
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    setRestaurants(data); 
                } else {
                    setRestaurants(null);
                }
            })
            .catch((error) => {
                setFailureMessage(`${error}`);
                setRestaurants(null);
            });
    }, []);


    return (
      <div className="container mx-auto p-4 min-h-screen">
        <PopularRestaurants restaurants={restaurants}/>
        <AllRestaurants restaurants={restaurants}/>
      </div>
    );
};

export default HomePage;
