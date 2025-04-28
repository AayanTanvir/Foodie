import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import CartPage from '../pages/CartPage';
import SignupPage from '../pages/SignupPage';
import PageNotFound from '../pages/PageNotFound';
import PasswordResetNewPasswordPage from '../pages/PasswordResetNewPasswordPage';
import PasswordResetEmailPage from '../pages/PasswordResetEmailPage';
import RestaurantPage from '../pages/RestaurantPage';
import ProtectedRoutes from '../utils/ProtectedRoutes';
import { CartContext } from '../context/CartContext';
import Navbar from './Navbar';
import SuccessMessage from './SuccessMessage';
import FailureMessage from './FailureMessage';
import NoticeMessage from './NoticeMessage';
import OTPForm from './OTPForm';
import ItemChoicesPopup from './ItemChoicesPopup';
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const AppContent = () => {
    const { showChoicesPopup, choicesItem } = useContext(CartContext);
    const { successMessage, noticeMessage, failureMessage, showOTPForm } = useContext(AuthContext);

    return (
        <>
            <Navbar />

            {successMessage !== "" && <SuccessMessage />}
            {failureMessage !== "" && <FailureMessage />}
            {noticeMessage !== "" && <NoticeMessage />}

            {showOTPForm && <OTPForm />}
            {showChoicesPopup && <ItemChoicesPopup item={choicesItem}/>}

            <Routes>
                <Route element={<ProtectedRoutes/>}>
                    <Route element={<HomePage/>} path='/' exact/>

                    {/* restaurants */}
                    <Route element={<RestaurantPage/>} path='/r/:slug/:uuid'/>
                    <Route element={<CartPage/>} path='/cart'/>
                </Route>

                {/* auth */}
                <Route element={<LoginPage/>} path='/login'/>
                <Route element={<SignupPage/>} path='/signup'/>
                <Route element={<PasswordResetEmailPage/>} path='/reset-password'/>
                <Route element={<PasswordResetNewPasswordPage/>} path='/reset-password/new-password'/>

                <Route element={<PageNotFound/>} path='*'/>
            </Routes>
        </>
    );
};

export default AppContent;
