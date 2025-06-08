import { createContext, useState, useEffect, useContext } from 'react'
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import axiosClient from '../utils/axiosClient';
import { logout, isExpiredSeconds } from '../utils/Utils';
import { GlobalContext } from './GlobalContext';

let AuthContext = createContext()

export const AuthProvider = ({children}) => {

    let navigate = useNavigate();

    let [authTokens, setAuthTokens] = useState(localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null);
    let [user, setUser] = useState(localStorage.getItem("authTokens") ? jwtDecode(localStorage.getItem("authTokens")) : null);
    let [authError, setAuthError] = useState("");
    let [showOTPForm, setShowOTPForm] = useState(false);
    let [canResendOTP, setCanResendOTP] = useState(false);
    let { setMessageAndMode } = useContext(GlobalContext);

    let loginUser = async (event) => {
        event.preventDefault();

        
        if (!event.target.password.value || !event.target.email.value) {
            setAuthError("Please fill all fields")
        } else {
            try {
                const response = await axiosClient.post("/token/", {
                    email: event.target.email.value,
                    password: event.target.password.value
                });
            
                const data = response.data;
                const refresh = jwtDecode(data.refresh);
                const access = jwtDecode(data.access);
                
                setAuthTokens(data);
                setUser(access);
                localStorage.setItem("authTokens", JSON.stringify(data));
                localStorage.setItem("refreshTokenExp", refresh.exp);
                localStorage.setItem("accessTokenExp", access.exp);
                
                navigate("/");
                
            } catch (error) {
                if (error.response.status === 401) {
                    setAuthError("Invalid Credentials");
                } else if (error.response.status === 500) {
                    setMessageAndMode("Internal Server Error (500) Please retry later.", "failure");
                    console.error(error);
                } else {
                    setMessageAndMode("An error occurred", "failure");
                    console.error(error);
                }
            }
        }
    }
    
    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        logout();
    }

    let signupUser = async (event) => {
        event.preventDefault();

        if (
            !event.target.email?.value.trim() || 
            !event.target.password1?.value.trim() || 
            !event.target.password2?.value.trim() || 
            !event.target.username?.value.trim()
        ) {
            setAuthError("Please fill all fields");
        }

        if (validateCredentials(event.target.password1.value, event.target.password2.value, event.target.username.value)) {
            try{
                const response = await axiosClient.post("/users/create/", {
                    username: event.target.username.value,
                    email: event.target.email.value,
                    password1: event.target.password1.value,
                    password2: event.target.password2.value
                });
    
                if (response.status === 201) {
                    try {
                        const login_response = await axiosClient.post("/token/", {
                            email: event.target.email.value,
                            password: event.target.password1.value
                        });
                    
                        setAuthTokens(login_response.data);
                        setUser(jwtDecode(login_response.data.access));
                        localStorage.setItem("authTokens", JSON.stringify(login_response.data));
                        localStorage.setItem("refreshTokenExp", jwtDecode(login_response.data.refresh).exp);
                        localStorage.setItem("accessTokenExp", jwtDecode(login_response.data.access).exp);
                        navigate("/");
                        setMessageAndMode("Account Created Successfully!", "success");
                    } catch (error) {  
                        if (error.response.status === 401) {
                            setMessageAndMode("Invalid Credentials. Please try again", "failure");
                        } else if (error.response.status === 500) {
                            setMessageAndMode("Internal Server Error (500) Please try later", "failure");  
                            console.error(error);
                        } else {
                            setMessageAndMode("An error occurred", "failure");
                            console.error(error);
                        }
                        navigate('/login');
                    }
                }
            } catch (error) {
                if (error.response?.status === 400) {
                    setAuthError("User with this email already exists");
                }
                if (error.response?.status === 500) {
                    setMessageAndMode("Internal Server Error (500) Please try later.", "failure");
                    console.error(error);
                } else {
                    setMessageAndMode("An error occurred", "failure");
                    console.error(error);
                }
            }

        }
    }

    let validateCredentials = (password1, password2, username) => {
        let regex_lowercase = /[a-z]/;
        let regex_uppercase = /[A-Z]/;
        let regex_digit = /\d/;
        let regex_special = /[!@#$%^&*]/;
        let regex_whitespace = /\s/;
        

        if (password1.length < 8) {
            setAuthError("Password must be at least 8 characters long");
            return false;
        }
        if (password1 !== password2) {
            setAuthError("Passwords don't match");
            return false;
        }
        if (!regex_lowercase.test(password1)) {
            setAuthError("Password must contain atleast one lowercase letter");
            return false;
        }
        if (!regex_uppercase.test(password1)) {
            setAuthError("Password must contain atleast one uppercase letter");
            return false;
        }
        if(regex_whitespace.test(password1)) {
            setAuthError("Password must not contain whitespace");
            return false;
        }
        if (!regex_digit.test(password1)) {
            setAuthError("Password must contain atleast one digit");
            return false;
        }
        if (!regex_special.test(password1)) {
            setAuthError("Password must contain atleast one special character");
            return false;
        }
        if (username?.length < 4) {
            setAuthError("Username must be at least 4 characters long");
            return false;
        }
        if (username && regex_whitespace.test(username)) {
            setAuthError("Username must not contain whitespace");
            return false;
        }
        return true;
    }

    let verifyEmail = async (mode) => {
        if (showOTPForm == false) setShowOTPForm(true);
        
        try {
            const response = await axiosClient.post("/email-verification/", {
                email: user.email,
                mode: mode,
            });

            if (response.status === 200) {
                setMessageAndMode("Verification email sent! (check spam)", "notice");
        
                if (mode !== "resend") {
                    const timer_for_resend = 60000;
                    let timeout = setTimeout(() => {
                        clearTimeout(timeout);
                        setCanResendOTP(true);
                    }, timer_for_resend);
                }
            } else {
                console.warn("Unexpected response:", response);
                setMessageAndMode("Unexpected response from server.", "notice");
                setShowOTPForm(false);
            }
        } catch (error) {
            if (error.response?.data?.error === "An OTP has already been sent to your email") {
                setMessageAndMode("An OTP has already been sent to your email", "failure");
                setShowOTPForm(false);
            } else {
                setMessageAndMode("Please try again later.", "failure");
                console.log(error);
                setShowOTPForm(false);
            }
        }
    }

    let submitVerifyEmailOTP = async (event) => {
        event.preventDefault();

        if (!event.target.otp.value) {
            setAuthError("please enter your OTP");
        } else {
            try {
                const response = await axiosClient.post("/email-verification/verify-otp/", {
                    email: user.email,
                    otp: event.target.otp.value,
                });

                if (response.status === 200) {
                    setMessageAndMode("Email Verified!", "success");
                    setShowOTPForm(false);
                }
            }
            catch (error) {
                const status = error.response?.status;
                setMessageAndMode("Something went wrong. Retry later", "failure");
            }
        }

    }

    let context = {
        user,
        authTokens,
        authError,
        showOTPForm,
        canResendOTP,
        loginUser,
        logoutUser,
        signupUser,
        setAuthError,
        setShowOTPForm,
        verifyEmail,
        submitVerifyEmailOTP,
        setCanResendOTP,
        validateCredentials,
    };

    useEffect(() => {
        if (authError === "") return;

        const timeout = setTimeout(() => setAuthError(""), 3000);
        return () => clearTimeout(timeout);
    }, [authError]);

    useEffect(() => {
        const refreshExp = parseInt(localStorage.getItem("refreshTokenExp"), 10);
        if (isExpiredSeconds(refreshExp)) {
            logoutUser();
        }
    }, [])

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext