import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartContextProvider } from './context/CartContext';
import AppContent from './components/AppContent';


function App() {
    return (
        <Router>
            <AuthProvider>
                <CartContextProvider>
                    <AppContent />
                </CartContextProvider>
            </AuthProvider>
        </Router>
    )
}

export default App
