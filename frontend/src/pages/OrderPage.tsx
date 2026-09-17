import { useState } from "react";
import { useCart } from "../context/CartContext";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContex";

type OrderStatus = "idle" | "loading" | "success" | "error";

function OrderPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user, token } = useAuth();
  const [status, setStatus] = useState<OrderStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + Number(item.Price) * item.quantity, 0
  );

  const handleProceed = async () => {
    setStatus("loading");
    setErrorMsg("");

    const orderItems = cart.map(item => ({
      menu_item: item.id,
      quantity: item.quantity,
    }));

    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({ items: orderItems }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      clearCart();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div>
      <NavBar onSearch={null} user={user} />
      <div className="bg-white p-6">
        <h1>Vaša narudžba</h1>

        {status === "success" && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
            Narudžba je uspješno predana!
          </div>
        )}
        {status === "error" && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
            {errorMsg}
          </div>
        )}

        {cart.length === 0 ? (
          <p>Narudžba Vam je prazna.</p>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id}>
                <h2>{item.Name}</h2>
                <p>Cijena: €{item.Price}</p>
                <p>Količina: {item.quantity}</p>
                <p>Ukupno: €{(Number(item.Price) * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.id)}>Uklonite</button>
              </div>
            ))}
            <h2>Ukupni iznos: €{total.toFixed(2)}</h2>
            <button onClick={handleProceed} disabled={status === "loading"}>
              {status === "loading" ? "Šalje se..." : "Izvršite narudžbu"}
            </button>
            <button onClick={clearCart}>Otkažite narudžbu</button>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderPage;