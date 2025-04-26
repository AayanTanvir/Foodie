import React, {useState, useEffect, useContext} from "react";
import PopularRestaurants from "../components/PopularRestaurants";
import AllRestaurants from "../components/AllRestaurants";
import AuthContext from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";

const HomePage = () => {

    let { setFailureMessage } = useContext(AuthContext);
    const [restaurants, setRestaurants] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            if (loading === false) setLoading(true);
            try {
                const response = await axiosClient.get("/restaurants/");
    
                if (response.status === 200) {
                    setRestaurants(response.data || null);
                    setLoading(false);
                } else {
                    setFailureMessage("Unexpected response.", response.status);
                    setLoading(false);
                }
    
            } catch (error) {
                setFailureMessage("An error occurred.", error.response?.status);
                setRestaurants(null);
                setLoading(false);
            }
        };
    
        fetchRestaurants();
    }, []);
    

    if (loading) {
        return <div className="pt-12 text-center">Loading...</div>;
    }

    return (
      <div className="container mx-auto p-4 min-h-screen">
        <PopularRestaurants restaurants={restaurants}/>
        <AllRestaurants restaurants={restaurants}/>
      </div>
    );
};

export default HomePage;
