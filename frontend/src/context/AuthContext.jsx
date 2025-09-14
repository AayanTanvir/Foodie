import { createContext, useState, useEffect, useContext } from 'react'
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import axiosClient from '../utils/axiosClient';
import { logout, isExpiredSeconds, sendRequest, validateCredentials } from '../utils/Utils';
import { GlobalContext } from './GlobalContext';

let AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const navigate = useNavigate();

    const [authTokens, setAuthTokens] = useState(localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null);
    const [user, setUser] = useState(localStorage.getItem("authTokens") ? jwtDecode(localStorage.getItem("authTokens")) : null);
    const [authError, setAuthError] = useState("");
    const [showOTPForm, setShowOTPForm] = useState(false);
    const [canResendOTP, setCanResendOTP] = useState(false);
    const { setMessageAndMode } = useContext(GlobalContext);

    const loginUser = async (event) => {
        event.preventDefault();

        
        if (!event.target.password.value || !event.target.email.value) {
            setAuthError("Please fill all fields")
        } else {
            const res = await sendRequest({
                method: "post",
                to: "/token/",
                postData: {
                    email: event.target.email.value,
                    password: event.target.password.value
                }
            })

            if (res.status === 401) {
                setAuthError("Invalid Credentials");
                return
            } else if (res.status !== 200) {
                setMessageAndMode("An error occurred.", "failure");
                return
            }

            const data = res.data;
            const refresh = jwtDecode(data.refresh);
            const access = jwtDecode(data.access);

            setAuthTokens(data);
            setUser(access);
            localStorage.setItem("authTokens", JSON.stringify(data));
            localStorage.setItem("refreshTokenExp", refresh.exp);
            localStorage.setItem("accessTokenExp", access.exp);

            navigate("/");

            // try {
            //     const response = await axiosClient.post("/token/", {
            //         email: event.target.email.value,
            //         password: event.target.password.value
            //     });
            
            //     const data = response.data;
            //     const refresh = jwtDecode(data.refresh);
            //     const access = jwtDecode(data.access);
                
            //     setAuthTokens(data);
            //     setUser(access);
            //     localStorage.setItem("authTokens", JSON.stringify(data));
            //     localStorage.setItem("refreshTokenExp", refresh.exp);
            //     localStorage.setItem("accessTokenExp", access.exp);
                
            //     navigate("/");
                
            // } catch (error) {
            //     if (error.response.status === 401) {
            //         setAuthError("Invalid Credentials");
            //     } else if (error.response.status === 500) {
            //         setMessageAndMode("Internal Server Error (500) Please retry later.", "failure");
            //         console.error(error);
            //     } else {
            //         setMessageAndMode("An error occurred", "failure");
            //         console.error(error);
            //     }
            // }
        }
    }
    
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        logout();
    }

    const signupUser = async (event) => {
        event.preventDefault();

        if (
            !event.target.email?.value.trim() || 
            !event.target.password1?.value.trim() || 
            !event.target.password2?.value.trim() || 
            !event.target.username?.value.trim()
        ) {
            setAuthError("Please fill all fields");
            return
        }

        if (!validateCredentials(event.target.password1.value, event.target.password2.value, event.target.username.value)) {
            return
        }

        const res = await sendRequest({
            method: "post",
            to: "/users/create/",
            desiredStatus: 201,
            postData: {
                username: event.target.username.value,
                email: event.target.email.value,
                password1: event.target.password1.value,
                password2: event.target.password2.value
            }
        });

        if (res.status === 400) {
            setAuthError("User with this email already exists");
            return
        } else if (res.status !== 201) {
            setMessageAndMode("An error occurred.", "failure");
            return
        } else {
            const login_res = await sendRequest({
                method: "post",
                to: "/token/",
                postData: {
                    username: event.target.username.value,
                    email: event.target.email.value,
                    password1: event.target.password1.value,
                    password2: event.target.password2.value,
                }
            });
            
            if (login_res.status === 200) {
                setAuthTokens(login_res.data);
                setUser(jwtDecode(login_res.data.access));
                localStorage.setItem("authTokens", JSON.stringify(login_res.data));
                localStorage.setItem("refreshTokenExp", jwtDecode(login_res.data.refresh).exp);
                localStorage.setItem("accessTokenExp", jwtDecode(login_res.data.access).exp);
                navigate('/');
                setMessageAndMode("Account Created Successfully!", "success");
            } else {
                setMessageAndMode("An error occurred. Try logging in.", "failure");
                navigate("/login");
            }
        }


        // try{
        //     const response = await axiosClient.post("/users/create/", {
        //         username: event.target.username.value,
        //         email: event.target.email.value,
        //         password1: event.target.password1.value,
        //         password2: event.target.password2.value
        //     });

        //     if (response.status === 201) {
        //         try {
        //             const login_response = await axiosClient.post("/token/", {
        //                 email: event.target.email.value,
        //                 password: event.target.password1.value
        //             });
                
        //             setAuthTokens(login_response.data);
        //             setUser(jwtDecode(login_response.data.access));
        //             localStorage.setItem("authTokens", JSON.stringify(login_response.data));
        //             localStorage.setItem("refreshTokenExp", jwtDecode(login_response.data.refresh).exp);
        //             localStorage.setItem("accessTokenExp", jwtDecode(login_response.data.access).exp);
        //             navigate("/");
        //             setMessageAndMode("Account Created Successfully!", "success");
        //         } catch (error) {  
        //             if (error.response.status === 401) {
        //                 setMessageAndMode("Invalid Credentials. Please try again", "failure");
        //             } else if (error.response.status === 500) {
        //                 setMessageAndMode("Internal Server Error (500) Please try later", "failure");  
        //                 console.error(error);
        //             } else {
        //                 setMessageAndMode("An error occurred", "failure");
        //                 console.error(error);
        //             }
        //             navigate('/login');
        //         }
        //     }
        // } catch (error) {
        //     if (error.response?.status === 400) {
        //         setAuthError("User with this email already exists");
        //     }
        //     if (error.response?.status === 500) {
        //         setMessageAndMode("Internal Server Error (500) Please try later.", "failure");
        //         console.error(error);
        //     } else {
        //         setMessageAndMode("An error occurred", "failure");
        //         console.error(error);
        //     }
        // }
    }


    const verifyEmail = async (mode) => {
        if (showOTPForm == false) setShowOTPForm(true);
        
        const res = await sendRequest({
            method: "post",
            to: "/email-verification/",
            postData: {
                email: user.email,
                mode: mode
            }
        });

        if (res.status === 400) {
            setMessageAndMode("An OTP has already been sent to your email", "failure");
            setShowOTPForm(false);
        } else if (res.status === 200) {
            setMessageAndMode("Verification email sent!", "notice");

            if (mode !== "resend") {
                const time_for_resend = 60000;
                let timeout = setTimeout(() => {
                    setCanResendOTP(true);
                }, time_for_resend);
            }
        }

        // try {
        //     const response = await axiosClient.post("/email-verification/", {
        //         email: user.email,
        //         mode: mode,
        //     });

        //     if (response.status === 200) {
        //         setMessageAndMode("Verification email sent! (check spam)", "notice");
        
        //         if (mode !== "resend") {
        //             const timer_for_resend = 60000;
        //             let timeout = setTimeout(() => {
        //                 clearTimeout(timeout);
        //                 setCanResendOTP(true);
        //             }, timer_for_resend);
        //         }
        //     } else {
        //         console.warn("Unexpected response:", response);
        //         setMessageAndMode("Unexpected response from server.", "notice");
        //         setShowOTPForm(false);
        //     }
        // } catch (error) {
        //     if (error.response?.data?.error === "An OTP has already been sent to your email") {
        //         setMessageAndMode("An OTP has already been sent to your email", "failure");
        //         setShowOTPForm(false);
        //     } else {
        //         setMessageAndMode("Please try again later.", "failure");
        //         console.log(error);
        //         setShowOTPForm(false);
        //     }
        // }
    }

    const submitVerifyEmailOTP = async (event) => {
        event.preventDefault();

        if (!event.target.otp.value) {
            setAuthError("please enter your OTP");
        } else {
            const res = await sendRequest({
                method: "post",
                to: "/email-verification/verify-otp/",
                postData: {
                    email: user.email,
                    otp: event.target.otp.value
                }
            });

            if (res.status !== 200) {
                setMessageAndMode("An error occurred.", "failure");
                return
            }

            setMessageAndMode("Email verified", "success");
            setShowOTPForm(false);
            
            // try {
            //     const response = await axiosClient.post("/email-verification/verify-otp/", {
            //         email: user.email,
            //         otp: event.target.otp.value,
            //     });

            //     if (response.status === 200) {
            //         setMessageAndMode("Email Verified!", "success");
            //         setShowOTPForm(false);
            //     }
            // }
            // catch (error) {
            //     const status = error.response?.status;
            //     setMessageAndMode("Something went wrong. Retry later", "failure");
            // }
        }

    }

    const context = {
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