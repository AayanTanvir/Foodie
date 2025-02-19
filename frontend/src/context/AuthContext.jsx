import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"

let AuthContext = createContext()

export const AuthProvider = ({children}) => {

    let navigate = useNavigate();

    let [authTokens, setAuthTokens] = useState(localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null);
    let [user, setUser] = useState(localStorage.getItem("authTokens") ? jwtDecode(localStorage.getItem("authTokens")) : null);
    let [initialLoad, setInitialLoad] = useState(true);
    let [authError, setAuthError] = useState("");
    let [successMessage, setSuccessMessage] = useState("");
    let [showOTPForm, setShowOTPForm] = useState(false);


    let loginUser = async (event) => {
        event.preventDefault();

        if (!event.target.password || !event.target.email) {
            setAuthError("Please fill all fields");
        } else {
            let response = await fetch("http://127.0.0.1:8000/token/", {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({'email':event.target.email.value, 'password':event.target.password.value})
            });
        
            let data = await response.json();
            if(response.status === 200) {
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem("authTokens", JSON.stringify(data));
                navigate("/");
            } else if(response.status === 401) {
                setAuthError("Invalid Credentials");
            } else if(response.status === 500) {
                setAuthError("Server Error");
            } else {
                setAuthError(data.detail || "Something went wrong, please try again.");
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
            let response = await fetch("http://127.0.0.1:8000/user/create/", {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({'username':event.target.username.value, 'email':event.target.email.value, 'password1':event.target.password1.value, 'password2':event.target.password2.value})
            })

            let data = await response.json();

            if (response.status === 201) {
                navigate("/login");
                setSuccessMessage("Account Created!");
            } else {
                error = Object.values(data).flat().join(" ");
                setAuthError(error || "Something went wrong, please try again.");
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
        if (username.length < 4) {
            setAuthError("Username must be at least 4 characters long");
            return false;
        }
        if (regex_whitespace.test(username)) {
            setAuthError("Username must not contain whitespace");
            return false;
        }
        if (password1 !== password2) {
            setAuthError("Passwords don't match");
            return false;
        }
        return true;
    }

    let verifyEmail = async (mode) => {

        let response = await fetch("http://localhost:8000/email-verification/", {
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({'email':user.email, 'mode':mode}),
        })
        let data = await response.json();
        if (response.status === 200) {
            setSuccessMessage("Verification email sent! (check spam)");
            setShowOTPForm(true);
        } else {
            alert(data.error || "Something went wrong, please try again.");
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
            } else {
                setAuthError(data.non_field_errors || "Something went wrong, please try again.");
            }
        }

    }

    let context = {
        user:user,
        authTokens:authTokens,
        successMessage:successMessage,
        authError:authError,
        showOTPForm:showOTPForm,
        loginUser:loginUser,
        logoutUser:logoutUser,
        signupUser:signupUser,
        setAuthError:setAuthError,
        setSuccessMessage:setSuccessMessage,
        setShowOTPForm:setShowOTPForm,
        verifyEmail:verifyEmail,
        submitVerifyEmailOTP:submitVerifyEmailOTP,
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
        const timeout = setTimeout(() => setSuccessMessage(""), 3000);
        return () => clearTimeout(timeout);
    }, [successMessage]);

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext