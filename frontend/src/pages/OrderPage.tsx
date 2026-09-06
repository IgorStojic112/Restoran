import { useCart } from "../context/CartContext";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContex";
 

function OrderPage() {

    const {cart, removeFromCart, clearCart} = useCart();
    const { user, token } = useAuth();

    const total = cart.reduce(
        (sum,item) => sum + Number(item.Price) * item.quantity, 0
    );

    const handleProceed = async () => {
                
        const orderItems = cart.map(item => ({
            menu_item: item.id,
            quantity: item.quantity,
        }));

        const response = await fetch("http://127.0.0.1:8000/api/orders/create", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
                body: JSON.stringify({
                    items: orderItems
                })
            }
        );

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.error || "Failed to create order");
        }
        clearCart();
        console.log("Order Created",data);
    }

    return (
        <div >
            <NavBar onSearch={null} user={user}></NavBar>
            
            <div className="bg-white">
                <h1>Vasa narudba</h1>

                {cart.length === 0 ?(
                    <p>Narudba Vam je prazna</p>
                ): (
                    <>
                        {cart.map(item => (
                            <div key={item.id}>
                                <h2>{item.Name}</h2>
                                <p>Price: €{item.Price}</p>
                                <p>Kolicina: {item.quantity}</p>
                                <p>Toral: €{Number(item.Price) * item.quantity}</p>
                                <button onClick={() => removeFromCart(item.id)}> Uklonite</button>
                            </div>
                        ))}

                        <h2>Ukupni iznos: €{total.toFixed(2)}</h2>
                        <button onClick={handleProceed}>Izvrstie narudzbu</button>
                        <button onClick={clearCart}>Odkazite narudzbu</button>
                    </>
                )}
            </div>
        </div>
    );
    

}


export default OrderPage;