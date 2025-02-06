import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Navbar from './components/navbar';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar/>
        <Routes>
          <Route element={<HomePage/>} path='/' exact/>
          <Route element={<LoginPage/>} path='/login'/>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
