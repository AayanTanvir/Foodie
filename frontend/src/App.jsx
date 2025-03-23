import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import SignupPage from './pages/SignupPage';
import SuccessMessage from './components/SuccessMessage';
import FailureMessage from './components/FailureMessage';
import NoticeMessage from './components/NoticeMessage';
import PasswordResetNewPasswordPage from './pages/PasswordResetNewPasswordPage';
import PasswordResetEmailPage from './pages/PasswordResetEmailPage';
import OTPForm from './components/OTPForm';
import ProtectedRoutes from './utils/ProtectedRoutes';
import RestaurantPage from './pages/RestaurantPage';


function App() {
    return (
      <Router>
        <AuthProvider>
          <Navbar/>
          <SuccessMessage/>
          <FailureMessage/>
          <NoticeMessage/>
          <OTPForm/>
          <Routes>
            <Route element={<ProtectedRoutes/>}>
              <Route element={<HomePage/>} path='/' exact/> 
            </Route>

            //auth
            <Route element={<LoginPage/>} path='/login'/>
            <Route element={<SignupPage/>} path='/signup'/>
            <Route element={<PasswordResetEmailPage/>} path='/reset-password'/>
            <Route element={<PasswordResetNewPasswordPage/>} path='/reset-password/new-password'/>

            //restaurants
            <Route element={<RestaurantPage/>} path='/r/:slug/:uuid'/>
          </Routes>
        </AuthProvider>
      </Router>
    )
}

export default App
