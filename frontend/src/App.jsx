import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartContextProvider } from './context/CartContext';
import { RestaurantContextProvider } from './context/RestaurantContext';
import AppContent from './components/AppContent';


function App() {
    return (
        <Router>
            <AuthProvider>
                <RestaurantContextProvider>
                    <CartContextProvider>
                        <AppContent />
                    </CartContextProvider>
                </RestaurantContextProvider>
            </AuthProvider>
        </Router>
    )
}

export default App
