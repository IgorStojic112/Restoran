import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SpecialityCard from "../components/SpecialityCard";

function MenuOrder () {

    const [items, setItems] = useState([]);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/categories/")
            .then(res => res.json())
            .then(data => setCategory(data));
    });

    
    useEffect(() => {
        fetch("http://localhost:8000/api/menu/list")
            .then(res => res.json())
            .then(data => 
                setItems(data.dishes));
    }, []);
    

    return (
        <div>
            <NavBar></NavBar>

            <div className="flex min-h-screen">
                <div className="min-w-50 bg-gray-200">
                    {category.map(item => (
                        
                        <div key={item.id} className="mb-3">
                            {item.Name}
                        </div>
                    
                    ))}
                </div>
                
                
                
                
                <div className="flex-1 ">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                        {items.map(item => {
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