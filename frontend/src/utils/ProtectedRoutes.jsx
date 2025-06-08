import React, { useContext, useEffect } from 'react'
import AuthContext from '../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

const ProtectedRoutes = () => {
    let { setMessageAndMode } = useContext(GlobalContext);
    let { user } = useContext(AuthContext);
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));
    let navigate = useNavigate();

    useEffect(() => {
        if (!user || !authTokens) {
            navigate('/login');
            setMessageAndMode("Please Login for access", "notice");
        }
    }, [user, authTokens]);

    return user ? <Outlet/> : null
}

export default ProtectedRoutes
