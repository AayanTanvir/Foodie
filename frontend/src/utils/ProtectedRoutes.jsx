import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoutes = () => {
    let {user, setNoticeMessage} = useContext(AuthContext);
    let navigate = useNavigate()


    return user ? <Outlet/> : () => {navigate('/login', setNoticeMessage("Please Login to view this page.")); }
}

export default ProtectedRoutes
