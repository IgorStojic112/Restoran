import { Bell, Moon, Search } from "lucide-react";
import profileImage from "../assets/hero.png"
import { useRef, useState } from "react";
import { type User, useAuth } from "../context/AuthContex";
import { useNavigate } from "react-router-dom";

interface NavBarProps {
    onSearch: ((value: string) => void) | null;
    user: User | null;
}

function SerchBar({ onSearch}){
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef(null);

    const handleExpand = () => {
        setIsExpanded(true);
        setTimeout(() => inputRef.current?.focus(),0);
    };

    const handleCollapse = () => {
        
        if(!inputRef.current?.value){
        setIsExpanded(false);
        }
    };

    const handleChange = (e) => {
        onSearch?.(e.target.value);
    };

    return (
        <div
        onClick={handleExpand}
        className={`flex items-center bg-gray-100 rounded-full transition-all duration-300 ease-in-out overflow-hidden
                ${isExpanded ? "w-80 px-4" : "w-10 px-2 cursor-pointer"} h-10`}
        >
            <Search className="w-5 h-5 text-gray-500 shrink-0"/>
            <input 
                ref={inputRef}
                type="text"
                placeholder="Pretrazi"
                onBlur={handleCollapse}
                onChange={handleChange}
                className={`bg-transparent outline-none ml-2 text-sm w-full transition-opacity duration-200
                    ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
                />

        </div>
    );
}

// <div className="flex-1 flex justify-center">Serch bar</div>
// <li>Rezerviraj</li> <li>Meni</li>

function NavBar({ onSearch }: NavBarProps) { // user bio unutra
    
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);

    const { user, logout } = useAuth();
    
    
    return (
        <nav className="bg-white shadow">
            <div className="w-full px-6 py-4 flex items-center">
                <div className="flex gap-8 items-center" > 
                    
                    <div className="text-xl font-bold whitespace-nowrap">
                    Restoran Logo
                    </div>

                    <ul className="hidden lg:flex gap-8 whitespace-nowrap">
                        <li onClick={() => {navigate('/home')}}>Dashborad</li>
                        <li onClick={() => {navigate('/OrderPage')}}> Narudzba</li>
                        <li>AI asistent</li>
                        <li>Naoredna pretraga</li>
                        <li>O nama</li>
                        <li>Kontakt</li>
                    </ul>

                </div>
                
                <div className="flex-1 flex justify-end mr-6">
                    <SerchBar onSearch={onSearch}></SerchBar>
                </div>
                

                <ul className="ml-auto flex gap-8 items-center mr-4"> 
                    <li> <Moon className=""></Moon> </li>
                    <li> <Bell></Bell> </li>
                    <li>
                        {user ? (
                            
                            <div className="relative">
                                
                                <button onClick={() => setProfileOpen(!profileOpen)}>

                                    <img 
                                        src={profileImage}
                                        alt="profile"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                        
                                        <button
                                        onClick={ () => navigate('/profilePage')}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-100">
                                            Profile
                                        </button>
                                        
                                        <button
                                        className="w-full text-left px-4 py-3 hover:bg-gray-100"
                                        >
                                            Settings
                                        </button>
                                        
                                        <button
                                        onClick={ async () => {
                                            await logout();
                                            setProfileOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-100"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                )}

                            </div>
                            

                        ) : (
                            <button 
                                onClick={() => navigate("/login") }
                                className="text-sm font-medium px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                
                                Log in
                            </button>
                        )

                        }
                         
                    </li>
                </ul>
            </div>          
        </nav>
    );
}

export default NavBar;