import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Navbar from './components/navbar';
import { AuthProvider } from './context/AuthContext';
import SignupPage from './pages/SignupPage';
import SuccessMessage from './components/SuccessMessage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar/>
        <SuccessMessage/>
        <Routes>
          <Route element={<HomePage/>} path='/' exact/>
          <Route element={<LoginPage/>} path='/login'/>
          <Route element={<SignupPage/>} path='/signup'/>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
