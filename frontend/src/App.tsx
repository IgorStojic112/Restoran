
import './App.css'
import LoginScreen from "./components/LoginScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterScreen from './components/RegisterScreen';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import Menu from './pages/Menu'
import CreateMenuItem from './pages/CreateMenuItem';
import AddIngredients from './pages/AddIngredinets';

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
        <Route path='/menu' element={<Menu />} />
        <Route path='/createMeniItem' element={<CreateMenuItem/>} />
        <Route path='/addIngredient' element={<AddIngredients />} />
        
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
