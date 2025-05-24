import React, { useContext, useEffect } from 'react'
import AuthContext from '../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

const ProtectedRoutes = () => {
    let { setNoticeMessage } = useContext(GlobalContext);
    let { user } = useContext(AuthContext);
    let navigate = useNavigate();

    useEffect(() => {
        if (!user){
            navigate('/login');
            setNoticeMessage("Please Login for access");
        }
    }, [user]);

    return user ? <Outlet/> : null
}

export default ProtectedRoutes
