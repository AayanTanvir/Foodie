import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import axiosClient from '../utils/axiosClient';

let AuthContext = createContext()

export const AuthProvider = ({children}) => {

    let navigate = useNavigate();

    let [authTokens, setAuthTokens] = useState(localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null);
    let [user, setUser] = useState(localStorage.getItem("authTokens") ? jwtDecode(localStorage.getItem("authTokens")) : null);
    let [initialLoad, setInitialLoad] = useState(true);
    let [authError, setAuthError] = useState("");
    let [successMessage, setSuccessMessage] = useState("");
    let [failureMessage, setFailureMessage] = useState("");
    let [noticeMessage, setNoticeMessage] = useState("");
    let [showOTPForm, setShowOTPForm] = useState(false);
    let [canResendOTP, setCanResendOTP] = useState(false);


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
            
                setAuthTokens(data);
                localStorage.setItem("authTokens", JSON.stringify(data));
                setUser(jwtDecode(data.access));
                navigate("/");
                
            } catch (error) {
                const status = error.response?.status;
                const detail = error.response?.data?.detail || "Something went wrong. Check internet connection";
            
                if (status === 401) {
                    setAuthError("Invalid Credentials");
                } else if (status === 500) {
                    setFailureMessage("Internal Server Error (500)");
                } else {
                    setFailureMessage(detail);
                }
            }
        }
    }
    
    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/login");
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
                const response = await axiosClient.post("/user/create/", {
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
                        localStorage.setItem("authTokens", JSON.stringify(login_response.data));
                        setUser(jwtDecode(login_response.data.access));
                        navigate("/");
                        setSuccessMessage("Account Created Successfully!");
                    }
                    catch (error) {
                        const status = error.response?.status;
                        const detail = error.response?.data?.detail || "Something went wrong. Check internet connection";
                    
                        if (status === 401) {
                            setFailureError("Invalid Credentials. Please try again");
                        } else if (status === 500) {
                            setFailureMessage("Internal Server Error (500)");  
                        } else {
                            setFailureMessage(detail);
                        }
                        navigate('/login');
                    }
                }
            }
            catch (error) {
                const status = error.response?.status;
                const detail = error.response?.data;

                if (status === 400) {
                    setAuthError("User with this email already exists");
                }
                if (status === 500) {
                    setFailureMessage("Internal Server Error 500");
                } else {
                    setFailureMessage(detail);
                }
            }

        }
    }
    
    let updateToken = async () => {
        try {
            let response = await fetch("http://127.0.0.1:8000/token/refresh/", {
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({'refresh':authTokens.refresh})
            });
        
            let data = await response.json()
            if(response.ok) {
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem("authTokens", JSON.stringify(data))
            }else {
                logoutUser();
            }
        } catch (error) {
            logoutUser();
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
        
        let response = await fetch("http://localhost:8000/email-verification/", {
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({'email':user.email, 'mode':mode}),
        })
        let data = await response.json();
        if (response.status === 200) {
            setNoticeMessage("Verification email sent! (check spam)");
            if (mode !== "resend") {
                const timer_for_resend = 10000;
                let timeout = setTimeout(() => {
                    clearTimeout(timeout);
                    setCanResendOTP(true);
                }, timer_for_resend);
            }
        } else if (response.status === 500) {
            setFailureMessage("Something went wrong, please try again.");
        } else {
            setNoticeMessage(data?.error);
        }
    }

    let submitVerifyEmailOTP = async (event) => {
        event.preventDefault();

        if (!event.target.otp.value) {
            setAuthError("please enter your OTP");
        } else {
            let response = await fetch("http://localhost:8000/email-verification/verify-otp/", {
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({'email':user.email, 'otp':event.target.otp.value}),
            })
            let data = await response.json();
            if (response.status === 200) {
                setSuccessMessage("Email Verified!");
                setShowOTPForm(false);
            } else if (response.status === 500) {
                setFailureMessage("Internal Server Error 500");
            } else {
                setFailureMessage(data?.non_field_errors);
            }
        }

    }

    let context = {
        user: user,
        authTokens: authTokens,
        successMessage: successMessage,
        failureMessage: failureMessage,
        noticeMessage: noticeMessage,
        authError: authError,
        showOTPForm: showOTPForm,
        canResendOTP: canResendOTP,
        loginUser: loginUser,
        logoutUser: logoutUser,
        signupUser: signupUser,
        setAuthError: setAuthError,
        setSuccessMessage: setSuccessMessage,
        setShowOTPForm: setShowOTPForm,
        verifyEmail: verifyEmail,
        submitVerifyEmailOTP: submitVerifyEmailOTP,
        setCanResendOTP: setCanResendOTP,
        validateCredentials: validateCredentials,
        setFailureMessage: setFailureMessage,
        setNoticeMessage: setNoticeMessage,
    };

    useEffect(() => {
        if (!authTokens) return;

        const FOUR_MIN = 1000 * 60 * 4
        let interval = setInterval(() => {
            updateToken();
        }, FOUR_MIN);
        return () => clearInterval(interval);

    }, [authTokens, initialLoad]);

    useEffect(() => {
        const timeout = setTimeout(() => setAuthError(""), 3000);
        return () => clearTimeout(timeout);
    }, [authError]);
    
    useEffect(() => {
        const timeout = setTimeout(() => {setSuccessMessage(""), setNoticeMessage(""), setFailureMessage("")}, 3000);
        return () => clearTimeout(timeout);
    }, [successMessage, noticeMessage, failureMessage]);

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext