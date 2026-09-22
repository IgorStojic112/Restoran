
import './App.css'
import LoginScreen from "./components/LoginScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterScreen from './components/RegisterScreen';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
{/*import Menu from './pages/Menu'*/}
import CreateMenuItem from './pages/CreateMenuItem';
import AddIngredients from './pages/AddIngredinets';
import MenuOrder from './pages/MenuOrder';
import ProfilePage from './pages/ProfilePage';
import OrderPage from './pages/OrderPage';
import AIAssistant from './pages/AIAssistant';
import AdminDashboard from './pages/AdminDashboard';
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from './components/ProtectedRoute';
// <Route path="/" element={<LoginScreen />} />

function App() {

  return (
    <BrowserRouter>
        <NotificationProvider>
          <Routes>
            
          
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen/>} />
            <Route path='/nav' element={<NavBar onSearch={null} user={null}/>} />
            <Route path='/Home' element={<HomePage />} />
            <Route path='/footer' element={<Footer />} />
            {/*<Route path='/menu' element={<Menu />} />*/}
            
            <Route element={<ProtectedRoute allowedRoles={["ADMIN","STAFF"]} /> }>
              <Route path='/createMeniItem' element={<CreateMenuItem/>} />
              <Route path='/addIngredient' element={<AddIngredients />} />
            </Route>

            <Route path='/admin' element={<AdminDashboard />} />
            
            <Route path='/menuOrder' element={<MenuOrder />} />
            <Route path='/profilePage' element={<ProfilePage />} />
            <Route path='/OrderPage' element={<OrderPage />} />

            <Route path='/assistant' element={<AIAssistant />} />

          </Routes>
        </NotificationProvider>
      </BrowserRouter>
    
  )
}

export default App
