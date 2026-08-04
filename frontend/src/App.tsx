
import './App.css'
import LoginScreen from "./components/LoginScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterScreen from './components/RegisterScreen';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';

// <Route path="/" element={<LoginScreen />} />

function App() {

  return (
    <BrowserRouter>
      <Routes>
        
      
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen/>} />
        <Route path='/nav' element={<NavBar/>} />
        <Route path='/Home' element={<HomePage />} />
        <Route path='/footer' element={<Footer />} />
        
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
