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
    <div className="min-h-screen bg-gray-50">
      <NavBar onSearch={null} user={user} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900">Vaša narudžba</h1>

        {status === "success" && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            Narudžba je uspješno predana!
          </div>
        )}
        {status === "error" && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {errorMsg}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <p className="text-gray-600">Narudžba Vam je prazna.</p>
          </div>
          
        ) : (
          <>
            <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {cart.map((item) => (
                  <li key={item.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                          <h2 className="truncate text-lg font-medium text-gray-900">{item.Name}</h2>
                          <p className="mt-1 text-sm text-gray-500">
                              €{item.Price} × {item.quantity}
                          </p>
                      </div>

                      <div className="flex items-center justify-between gap-6 sm:justify-end">
                          <p className="text-lg font-semibold text-gray-900">
                              €{(Number(item.Price) * item.quantity).toFixed(2)}
                          </p>
                          <button
                          onClick={() => removeFromCart(item.id)}
                          className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                          >
                            Uklonite
                          </button>
                      </div>
                  </li>
                ))}
            </ul>

            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-baseline justify-between">
                    <h2 className="text-lg font-medium text-gray-600">
                        Ukupan iznos
                    </h2>
                    <p className="text-2xl font-semibold text-gray-900">
                        €{total.toFixed(2)}
                    </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row-reverse">
                    <button
                    onClick={handleProceed}
                    disabled={status === "loading"}
                    className="w-full rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                    
                    {status === "loading" ? "Šalje se..." : "Izvršite narudžbu"}
                    
                    </button>
                    <button 
                    onClick={clearCart}
                    className="w-full rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 sm:w-auto"
                    >
                      Otkazite narudžbu
                    </button>
                </div>
            </div>

            
          </>
        )}
      </div>
    </div>
  );
}

export default OrderPage;