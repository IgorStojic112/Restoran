import { useState } from "react";


function AddIngredients(){

    const [Ingredients, setIngredient] = useState({
        Name: "",
        is_allergen: false,
        is_vegetarian: false,
        is_vegan: false,
    })
    const [message, setMessage] = useState("");



    const handelChange = (e) => {
        const {name, type, value, checked } = e.target;
        setIngredient((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        setMessage("");

        try{
            const response = await fetch("http://localhost:8000/api/ingredients/add",{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Ingredients),
            });
            
            

            if (!response.ok){
                const text = await response.text();
                setMessage(`Error ${response.status}: ${text}`);
                return;
            }
            const data = await response.json();
            setMessage("Ingredient added!");
            setIngredient({
                Name: "",
                is_allergen: false,
                is_vegetarian: false,
                is_vegan: false,
            });
        }catch (err){
            setMessage("Request failed: " + err.message);
        }
    };

    return (
        
        <div className="bg-white text-black">
            <form onSubmit={handleSubmit}>

                <input 
                    type="text" 
                    name="Name" 
                    placeholder="Name" 
                    value={Ingredients.Name}
                    onChange={handelChange}
                />
                <label >
                    <input 
                        type="checkbox" 
                        name="is_allergen" 
                        checked={Ingredients.is_allergen}
                        onChange={handelChange}
                    />
                    Alergen
                </label>
                <label >
                    <input 
                        type="checkbox" 
                        name="is_vegetarian" 
                        placeholder="is_vegetarian"
                        checked={Ingredients.is_vegetarian}
                        onChange={handelChange}
                    />
                    Vegetarian
                </label>
                <label>
                    <input 
                        type="checkbox" 
                        name="is_vegan" 
                        placeholder="is_vegan"
                        checked={Ingredients.is_vegan}
                        onChange={handelChange}
                    />
                    Vegan
                </label>

                <button type="submit" className="border-2 border-black">Add Ingredient</button>

            </form>

            {message && <p>{message}</p>}
        </div>
    )





}

export default AddIngredients;