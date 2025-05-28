import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import CartPage from '../pages/CartPage';
import SignupPage from '../pages/SignupPage';
import PageNotFound from '../pages/PageNotFound';
import PasswordResetNewPasswordPage from '../pages/PasswordResetNewPasswordPage';
import PasswordResetEmailPage from '../pages/PasswordResetEmailPage';
import RestaurantPage from '../pages/RestaurantPage';
import CheckoutPage from '../pages/CheckoutPage';
import ProtectedRoutes from '../utils/ProtectedRoutes';
import { CartContext } from '../context/CartContext';
import Navbar from './Navbar';
import SuccessMessage from './SuccessMessage';
import FailureMessage from './FailureMessage';
import NoticeMessage from './NoticeMessage';
import OTPForm from './OTPForm';
import ItemChoicesPopup from './ItemChoicesPopup';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import OrderPage from '../pages/OrderPage';
import OrdersPage from '../pages/OrdersPage';
import { GlobalContext } from '../context/GlobalContext';
import ProfilePage from '../pages/ProfilePage';

const AppContent = () => {
    let { showOTPForm } = useContext(AuthContext);
    let { successMessage, noticeMessage, failureMessage } = useContext(GlobalContext);
    let { showChoicesPopup, choicesItem } = useContext(CartContext);

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
                    <Route element={<RestaurantPage/>} path='/r/:slug/:uuid'/>
                    <Route element={<CartPage/>} path='/cart'/>
                    <Route element={<CheckoutPage/>} path='/checkout'/>
                    <Route element={<OrderPage/>} path='/orders/:order_uuid'/>
                    <Route element={<OrdersPage/>} path='/u/:user_uuid/orders'/>
                    <Route element={<ProfilePage/>} path='/u/:user_uuid'/>
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
