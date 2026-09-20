import { use, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContex";


function CreateMenuItem(){
    
    const [categories, setCategories] = useState([]);
    const [ingredient, setIngredient] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [isNewCategory, setIsNewCategory] = useState(false);
    const { user } = useAuth();


    const inputClass = "block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30";
    const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";
 


    const [menuItem, setMenuItem] = useState({
        Name: "",
        Description: "",
        Price: "",
        Available: true,
        Category: "",
        Image: null,
    });


    const handleChange = (e) => {
        const {name,value,type,checked,files} = e.target;
        if (type === "file"){
            setMenuItem({...menuItem, [name]: files[0] });
        } else if (type === "checkbox" && name === "Available"){
            setMenuItem({...menuItem, [name]: checked});
        } else {
            setMenuItem({ ...menuItem, [name]: value});
        }
    };

    const handleIngredientToggle = (id) => {
        setSelectedIngredients((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        
        e.preventDefault();

        const formData = new FormData();
        formData.append("Name", menuItem.Name);
        formData.append("Description", menuItem.Description);
        formData.append("Price", menuItem.Price);
        formData.append("Available", String(menuItem.Available));   
        formData.append("Category", menuItem.Category);
        if (menuItem.Image) formData.append("Image", menuItem.Image);

        selectedIngredients.forEach((id) => formData.append("Ingredient", id));

        const response = await fetch(
            "http://localhost:8000/api/menu/add/",
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();
        console.log(data);

        setMenuItem({
            Name: "",
            Description: "",
            Price: "",
            Available: true,
            Category: "",
            Image: null,
        });
        
        setSelectedIngredients([]);

        if (response.ok) {
            // refresh category list in case a new one was created
            fetch("http://localhost:8000/api/categories/")
                .then((res) => res.json())
                .then(setCategories);
        }

    }


    useEffect(() => {
        fetch("http://localhost:8000/api/categories/")
            .then(res => res.json())
            .then(data => setCategories(data));

        fetch("http://localhost:8000/api/ingredient/")
            .then((res) => res.json())
            .then(setIngredient);
    }, []);

    
    return(
        <div className="min-h-screen bg-gray-50">
            
            <NavBar onSearch={null} user={user}></NavBar>
            
            <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
            
                <h1 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900">Dodajte novo jelo</h1>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                    <div>
                        <label htmlFor="Name" className={labelClass}>Ime</label>
                        
                        <input
                        id="Name"
                        type="text"
                        name="Name"
                        placeholder="Name"
                        value={menuItem.Name}
                        onChange={handleChange}
                        className={inputClass}
                        />

                    </div>

                    <div>
                        <label htmlFor="Description" className={labelClass}>Opis</label>
                        <input
                        id="Description"
                        type="text"
                        name="Description"
                        placeholder="Description"
                        value={menuItem.Description}
                        onChange={handleChange}
                        className={inputClass}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="Price" className={labelClass}>Cijena</label>
                        <input
                        type="number"
                        name="Price"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={menuItem.Price}
                        onChange={handleChange}
                        className={`${inputClass} pl-8`}
                        />
                    </div>

                    <div>
                        <label htmlFor="Image" className={labelClass}>Slika</label>
                        <input 
                        id="Image"
                        type="file"
                        name="Image"
                        onChange={handleChange}
                        className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-600 shadow-sm file:mr-4 file:cursor-pointer file:border-0 file:bg-gray-100 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600/30"
                        />
                    </div>
                    
                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label htmlFor="Category" className="text-sm font-medium text-gray-700">Kategorija</label>
                            <label  className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                                <input
                                type="checkbox"
                                checked={isNewCategory}
                                onChange={(e) => {
                                    setIsNewCategory(e.target.checked);
                                    setMenuItem({ ...menuItem, Category: "" });
                                }}
                                className="h-4 w-4 rounded border-gray-300 accent-green-600"
                                />
                                Dodaj novu kategoriju
                            </label>
                        </div>
                        
                        {isNewCategory ? (
                        <input
                            id="Category"
                            type="text"
                            name="Category"
                            placeholder="New category name"
                            value={menuItem.Category}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    
                        ) : (
                        <select
                            id="Category"
                            name="Category"
                            value={menuItem.Category}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.Name}>
                                    {category.Name}
                                </option>
                            ))}    
                        </select>
                    
                        )}

                    </div>
                    
                    <fieldset>
                        <legend className={labelClass}>Sastojci</legend>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {ingredient.map((ing) => (
                                <label 
                                key={ing.id}
                                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 has-[:checked]:border-green-600 has-[:checked]:bg-green-50 has-[:checked]:text-green-800"
                                >
                                <input 
                                type="checkbox" 
                                checked={selectedIngredients.includes(ing.id)}
                                onChange={() => handleIngredientToggle(ing.id)}
                                className="h-4 w-4 rounded border-gray-300 accent-green-600"
                                />
                                {ing.Name}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <button 
                    type="submit"
                    className="w-full rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
                    >
                        Dodaj
                    </button>

                </form>
            </div>
        </div>
    )
}

export default CreateMenuItem;

/*
<input
                    type="number"
                    name="Category"
                    placeholder="Category ID"
                    value={menuItem.Category}
                    onChange={handleChange}
                />


*/