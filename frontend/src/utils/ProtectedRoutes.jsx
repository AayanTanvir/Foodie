import React, { useContext, useEffect } from 'react'
import AuthContext from '../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoutes = () => {
    let {user, setNoticeMessage} = useContext(AuthContext);
    let navigate = useNavigate()

    useEffect(() => {
        if (!user){
            navigate('/login');
            setNoticeMessage("Please Login for access");
        }
    }, [user]);

    return user ? <Outlet/> : null
}

export default ProtectedRoutes
