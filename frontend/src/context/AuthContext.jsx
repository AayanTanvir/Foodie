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

        if (!event.target.password1 || !event.target.email.value || !event.target.username.value) {
            setAuthError("Please fill all fields");
        }
        else if (event.target.password1.value != event.target.password2.value){
            setAuthError("Passwords don't match");
        }
        else {   
            let response = await fetch("http://127.0.0.1:8000/user/create/", {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({'username':event.target.username.value, 'email':event.target.email.value, 'password':event.target.password1.value})
            })

            let data = await response.json()

            if (response.status === 201) {
                navigate("/login")
                alert("Account Created!")
            } else {
                error = Object.values(data).flat().join(" ");
                setAuthError(error || "Something went wrong, please try again.");
            }
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => setAuthError(""), 3000);
        return () => clearTimeout(timeout);
    }, [authError])
    
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


    let context = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
        signupUser:signupUser,
        authError:authError,
    };

    useEffect(() => {
        if (!authTokens) return;

        const FOUR_MIN = 1000 * 60 * 4
        let interval = setInterval(() => {
            updateToken();
        }, FOUR_MIN);
        return () => clearInterval(interval);

    }, [authTokens, initialLoad]);

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext