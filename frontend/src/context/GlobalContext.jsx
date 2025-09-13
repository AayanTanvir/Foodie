import React, { createContext, useState, useEffect } from 'react'

export const GlobalContext = createContext()

export const GlobalContextProvider = ({ children }) => {
    const [message, setMessage] = useState("");
    const [messageMode, setMessageMode] = useState("success");
    const [showSidebar, setShowSidebar] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const setMessageAndMode = (message="", mode="") => {
        setMessageMode(mode);
        setMessage(message);
    }


    useEffect(() => {
        const timeout = setTimeout(() => { setMessage("") }, 5000);
        return () => clearTimeout(timeout);
    }, [message]);

    useEffect(() => {
        if (notifications.length > 5) {
            setNotifications(notifications.slice(0, 5));
        }
    }, [notifications])
    
    let context = {
        message, 
        messageMode, setMessageAndMode,
        showSidebar, setShowSidebar,
        showNotifications, setShowNotifications,
        notifications, setNotifications,
    }

    return (
        <GlobalContext.Provider value={context}>
            {children}
        </GlobalContext.Provider>
    )
}
