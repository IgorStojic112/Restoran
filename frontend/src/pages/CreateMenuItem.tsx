import { use, useEffect, useState } from "react";


function CreateMenuItem(){
    
    const [categories, setCategories] = useState([]);
    const [ingredient, setIngredient] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [isNewCategory, setIsNewCategory] = useState(false);

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
        <div className="bg-white">
            <h1>Create Menu Item</h1>

            <label >
                <input 
                    type="checkbox" 
                    checked={isNewCategory} 
                    onChange={(e) => {
                        setIsNewCategory(e.target.checked);
                        setMenuItem({...menuItem, Category: ""});
                    }}
                    />
                Add new category
            </label>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="Name"
                    placeholder="Name"
                    value={menuItem.Name}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="Description"
                    placeholder="Description"
                    value={menuItem.Description}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="Price"
                    placeholder="Price"
                    value={menuItem.Price}
                    onChange={handleChange}
                />

                <input 
                    type="file"
                    name="Image"
                    onChange={handleChange}
                />

                {isNewCategory ? (
                    <input
                        type="text"
                        name="Category"
                        placeholder="New category name"
                        value={menuItem.Category}
                        onChange={handleChange}
                    />
                
                ):
                <select
                    name="Category"
                    value={menuItem.Category}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.Name}>
                            {category.Name}
                        </option>
                    ))}    
                </select>
                
                }

                

                <div>
                    <p>Ingredients:</p>
                    {ingredient.map((ing) => (
                        <label key={ing.id} style={{ display: "block" }}>
                            <input 
                                type="checkbox" 
                                checked={selectedIngredients.includes(ing.id)}
                                onChange={() => handleIngredientToggle(ing.id)}
                            />
                            {ing.Name}
                        </label>
                    ))}
                </div>

                <button type="submit">
                    Create
                </button>

            </form>
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