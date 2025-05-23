import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartContextProvider } from './context/CartContext';
import { RestaurantContextProvider } from './context/RestaurantContext';
import AppContent from './components/AppContent';
import { GlobalContextProvider } from './context/GlobalContext';


function App() {
    return (
        <Router>
            <GlobalContextProvider>
                <AuthProvider>
                    <RestaurantContextProvider>
                        <CartContextProvider>
                            <AppContent />
                        </CartContextProvider>
                    </RestaurantContextProvider>
                </AuthProvider>
            </GlobalContextProvider>
        </Router>
    )
}

export default App
