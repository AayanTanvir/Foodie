import React, { useContext, useEffect } from 'react'
import AuthContext from '../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

const AdminRoutes = () => {
    const { user } = useContext(AuthContext);
    const { setMessageAndMode } = useContext(GlobalContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.groups || !user.groups.includes("admin")) {
            navigate("/");
            setMessageAndMode("Access denied", "failure");
        }
    }, [user])

    return user.groups.includes("admin") ? <Outlet /> : null
}

export default AdminRoutes
