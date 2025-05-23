import React, { createContext, useState, useEffect } from 'react'

export const GlobalContext = createContext()

export const GlobalContextProvider = ({ children }) => {
    const [successMessage, setSuccessMessage] = useState("");
    const [failureMessage, setFailureMessage] = useState("");
    const [noticeMessage, setNoticeMessage] = useState("");
        const [currentOrder, setCurrentOrder] = useState(() => {
        const saved = localStorage.getItem('currentOrder');
        return saved ? JSON.parse(saved) : {};
    });

    const setCurrentOrderAndPersist = (order) => {
        setCurrentOrder(order);
        localStorage.setItem('currentOrder', JSON.stringify(order));
    }

    useEffect(() => {
        const timeout = setTimeout(() => {setSuccessMessage(""), setNoticeMessage(""), setFailureMessage("")}, 3000);
        return () => clearTimeout(timeout);
    }, [successMessage, noticeMessage, failureMessage]);

    let context = {
        noticeMessage,
        failureMessage,
        successMessage,
        currentOrder,
        setCurrentOrder,
        setNoticeMessage,
        setFailureMessage,
        setSuccessMessage,
        setCurrentOrderAndPersist,
    }

    return (
        <GlobalContext.Provider value={context}>
            {children}
        </GlobalContext.Provider>
    )
}
