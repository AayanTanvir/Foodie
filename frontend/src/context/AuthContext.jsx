import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"

let AuthContext = createContext()

export const AuthProvider = ({children}) => {

    let navigate = useNavigate()

    let [authTokens, setAuthTokens] = useState(localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null)
    let [user, setUser] = useState(localStorage.getItem("authTokens") ? jwtDecode(localStorage.getItem("authTokens")) : null)
    let [initialLoad, setInitialLoad] = useState(true)

    let loginUser = async (e) => {
    
        e.preventDefault()
        let response = await fetch("http://127.0.0.1:8000/api/token/", {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
        })
    
        let data = await response.json()
        if(response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
            navigate("/")
        }else if(response.status === 401) {
            alert("Wrong Credentials")
        }else {
            alert("Something went wrong")
        }
    }
    
    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        navigate("/login")
    }

    let updateToken = async () => {
        let response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':authTokens.refresh})
        })
    
        let data = await response.json()
        if(response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
        }else {
            logoutUser()
        }
    }


    let context = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }

    useEffect(() => {
        
        const FOUR_MIN = 1000 * 60 * 4
        let interval = setInterval(() => {
            if(authTokens) {
                updateToken()
            }
        }, FOUR_MIN)
        return () => clearInterval(interval)

    }, [authTokens, initialLoad])

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext