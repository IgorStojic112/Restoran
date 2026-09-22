import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import MenuNavBar from "../components/MenuNavBar";
import SpecialityCard from "../components/SpecialityCard";
import { useAuth } from "../context/AuthContex";
import { useCart } from "../context/CartContext";
import DishQA from "../components/DishQA";

interface Category {
  id: number;
  Name: string;
  Description: string;
}

interface MenuItem {
  id: number;
  Name: string;
  Description: string;
  Price: string;
  Image: string;
  Available: boolean;
  Category: number;
}

function MenuOrder() {
  const { user } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    fetch("http://localhost:8000/api/categories/")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/menu/list")
      .then(res => res.json())
      .then(data => setItems(data.dishes));
  }, []);

  const filteredItems = items
    .filter(item => (selectedCategory ? item.Category === selectedCategory : true))
    .filter(item => item.Name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <NavBar onSearch={setSearchTerm} user={user} />

      <MenuNavBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="flex flex-col">
              <div
              onClick={() => addToCart(item)}
              className="cursor-pointer"
              >
              <SpecialityCard
                image={`http://localhost:8000${item.Image}`}
                title={item.Name}
                description={item.Description}
                price={item.Price+" €"}
              />
             </div>
             <DishQA dishId={item.id} dishName={item.Name} />
          </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default MenuOrder;