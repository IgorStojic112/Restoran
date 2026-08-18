import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SpecialityCard from "../components/SpecialityCard";

function MenuOrder () {

    const [items, setItems] = useState([]);
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("http://localhost:8000/api/categories/")
            .then(res => res.json())
            .then(data => setCategory(data));
    }, []);

    
    useEffect(() => {
        fetch("http://localhost:8000/api/menu/list")
            .then(res => res.json())
            .then(data => 
                setItems(data.dishes));
    }, []);

    const filterdItems = items
        .filter((item) => (selectedCategory ? item.Category === selectedCategory : true))
        .filter((item) => item.Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        

    
    

    return (
        <div>
            <NavBar onSearch={setSearchTerm}></NavBar>

            <div className="flex min-h-screen">
                
                
                <div className="min-w-50 bg-gray-200">
                    
                    <div
                        onClick={() => setSelectedCategory(null)}
                        className={`mb-3 cursor-pointer px-3 py-2 rounded ${
                            selectedCategory === null ? "bg-gray-400 font-semibold" : "hover:bg-gray-300"
                        }`}
                    >
                        Prikazi sve
                    </div>
                    
                    {category.map(item => (
                        
                        <div 
                            key={item.id} 
                            onClick={() => setSelectedCategory(item.id)}
                            className={`mb-3 cursor-pointer px-3 py-2 rounded ${
                            selectedCategory === item.id ? "bg-gray-400 font-semibold" : "hover:bg-gray-300"
                            }`}
                            >
                            {item.Name}
                        </div>
                    
                    ))}
                </div>
                
                
                
                
                <div className="flex-1 ">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                        {filterdItems.map(item => {
                            console.log(item)
                            return(
                                <SpecialityCard 
                                    key={item.id}
                                    image={`http://localhost:8000/${item.Image}`}
                                    title={item.Name}
                                    description={item.Description}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    )



}

export default MenuOrder;