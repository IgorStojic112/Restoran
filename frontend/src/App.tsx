
import './App.css'
import LoginScreen from "./components/LoginScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterScreen from './components/RegisterScreen';
import NavBar from './components/NavBar';


// <Route path="/" element={<LoginScreen />} />

function App() {

  return (
    <BrowserRouter>
      <Routes>
        
      
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen/>} />
        <Route path='/nav' element={<NavBar/>} />
        
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
