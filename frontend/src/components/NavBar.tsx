import { Bell, Moon, Search } from "lucide-react";

import profileImage from "../assets/hero.png"
import { useRef, useState } from "react";

function SerchBar(){
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
                className={`bg-transparent outline-none ml-2 text-sm w-full transition-opacity duration-200
                    ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
                />

        </div>
    );
}

// <div className="flex-1 flex justify-center">Serch bar</div>
// <li>Rezerviraj</li> <li>Meni</li>

function NavBar() {
    
    return (
        <nav className="bg-white shadow">
            <div className="w-full px-6 py-4 flex items-center">
                <div className="flex gap-8 items-center" > 
                    
                    <div className="text-xl font-bold whitespace-nowrap">
                    Restoran Logo
                    </div>

                    <ul className="hidden lg:flex gap-8 whitespace-nowrap">
                        <li>Dashborad</li>
                        <li> Narudzba</li>
                        <li>AI asistent</li>
                        <li>Naoredna pretraga</li>
                        <li>O nama</li>
                        <li>Kontakt</li>
                    </ul>

                </div>
                
                <div className="flex-1 flex justify-end mr-6">
                    <SerchBar></SerchBar>
                </div>
                

                <ul className="ml-auto flex gap-8 items-center mr-4"> 
                    <li> <Moon className=""></Moon> </li>
                    <li> <Bell></Bell> </li>
                    <li> 
                        <img 
                            src={profileImage}
                            alt="profile"
                            className="w-10 h-10 rounded-full object-cover"
                        /> 
                    </li>
                </ul>
            </div>          
        </nav>
    );
}

export default NavBar;