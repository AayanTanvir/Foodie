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
import Message from './Message';
import OTPForm from './OTPForm';
import ItemChoicesPopup from './ItemChoicesPopup';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import OrderPage from '../pages/OrderPage';
import OrdersPage from '../pages/OrdersPage';
import { GlobalContext } from '../context/GlobalContext';
import ProfilePage from '../pages/ProfilePage';
import ReviewsPopup from './ReviewsPopup';
import { RestaurantContext } from '../context/RestaurantContext';
import RestaurantOwnerRoutes from '../utils/RestaurantOwnerRoutes';
import RestaurantOwnerDashboard from '../pages/RestaurantOwnerDashboard';
import AdminRoutes from '../utils/AdminRoutes';
import AdminDashboard from '../pages/AdminDashboard';
import Sidebar from '../components/Sidebar';
import RestaurantOwnerRestaurantsPage from '../pages/RestaurantOwnerRestaurantsPage';
import RestaurantOwnerRestaurantPage from '../pages/RestaurantOwnerRestaurantPage';
import RestaurantOwnerOrdersPage from '../pages/RestaurantOwnerOrdersPage';

const AppContent = () => {
    let { showOTPForm } = useContext(AuthContext);
    let { messageMode, message, showSidebar } = useContext(GlobalContext);
    let { showChoicesPopup, choicesItem } = useContext(CartContext);
    let { showReviewsPopup, reviewsPopupMode } = useContext(RestaurantContext);

    return (
        <>
            <Navbar />

            { message !== "" && <Message mode={ messageMode }/> }

            { showOTPForm && <OTPForm />}
            { showChoicesPopup && <ItemChoicesPopup item={choicesItem}/> }
            { showReviewsPopup && <ReviewsPopup mode={reviewsPopupMode}/> }
            { showSidebar && <Sidebar /> }

            <Routes>
                <Route element={ <ProtectedRoutes/> }>
                    <Route element={ <HomePage/> } path='/' exact/>
                    <Route element={ <RestaurantPage/> } path='/r/:slug/:uuid'/>
                    <Route element={ <CartPage/> } path='/cart'/>
                    <Route element={ <CheckoutPage/> } path='/checkout'/>
                    <Route element={ <OrderPage/> } path='/orders/:order_uuid'/>
                    <Route element={ <OrdersPage/> } path='/u/:user_uuid/orders'/>
                    <Route element={ <ProfilePage/> } path='/u/:user_uuid'/>
                    
                    <Route element={ <RestaurantOwnerRoutes/> }>
                        <Route element={ <RestaurantOwnerDashboard/> } path='/restaurant-owner/dashboard'/>
                        <Route element={ <RestaurantOwnerRestaurantsPage/> } path='/restaurant-owner/restaurants'/>
                        <Route element={ <RestaurantOwnerRestaurantPage/> } path='/restaurant-owner/restaurants/:uuid'/>
                        <Route element={ <RestaurantOwnerOrdersPage /> } path='/restaurant-owner/orders' />
                    </Route>

                    <Route element={ <AdminRoutes/> }>
                        <Route element={ <AdminDashboard/> } path='/admin/dashboard'/>
                    </Route>
                </Route>

                <Route element={ <LoginPage/> } path='/login'/>
                <Route element={ <SignupPage/> } path='/signup'/>
                <Route element={ <PasswordResetEmailPage/> } path='/reset-password'/>
                <Route element={ <PasswordResetNewPasswordPage/> } path='/reset-password/new-password'/>

                <Route element={ <PageNotFound/> } path='*'/>
            </Routes>
        </>
    );
};

export default AppContent;
