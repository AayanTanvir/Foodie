import React, { createContext, useState, useEffect } from 'react'

export const GlobalContext = createContext()

export const GlobalContextProvider = ({ children }) => {
    const [message, setMessage] = useState("");
    const [messageMode, setMessageMode] = useState("success");
    const [showSidebar, setShowSidebar] = useState(false);

    const setMessageAndMode = (message="", mode="") => {
        setMessageMode(mode);
        setMessage(message);
    }


    useEffect(() => {
        const timeout = setTimeout(() => { setMessage("") }, 5000);
        return () => clearTimeout(timeout);
    }, [message]);
    
    let context = {
        message, 
        messageMode, setMessageAndMode,
        showSidebar, setShowSidebar,
    }

    return (
        <GlobalContext.Provider value={context}>
            {children}
        </GlobalContext.Provider>
    )
}
