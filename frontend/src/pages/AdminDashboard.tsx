import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContex";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

interface MenuItem {
  id: number;
  Name: string;
  Description: string;
  Price: string;
  Image: string;
  Available: boolean;
  Category: number;
}

interface OrderItem {
  menu_item: number;
  menu_item_name: string;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  status: string;
  created_at: string;
  total_price: string;
  items: OrderItem[];
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Na čekanju" },
  { value: "PREPARING", label: "Priprema se" },
  { value: "READY", label: "Spremno" },
  { value: "COMPLETED", label: "Završeno" },
  { value: "CANCELLED", label: "Otkazano" },
];

function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"items" | "orders">("items");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { newOrderSignal } = useNotifications();

  useEffect(() => {
        if (tab === "orders") loadOrders();
    }, [tab, newOrderSignal]);

  useEffect(() => {
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      navigate("/menuOrder");
    }
  }, [user, navigate]);

  const loadItems = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/menu/list")
      .then(res => res.json())
      .then(data => setItems(data.dishes))
      .finally(() => setLoading(false));
  };

  const loadOrders = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/orders/list/", {
      headers: { "Authorization": `Token ${token}` },
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === "items") loadItems();
    else loadOrders();
  }, [tab]);

  const handleDelete = async (id: number) => {
    if (!confirm("Jeste li sigurni da želite obrisati ovo jelo?")) return;

    const response = await fetch(`http://localhost:8000/api/menu/${id}/delete/`, {
      method: "DELETE",
      headers: { "Authorization": `Token ${token}` },
    });

    if (response.ok) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const response = await fetch(`http://localhost:8000/api/orders/${orderId}/status/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  };

  return (
    <div>
      <NavBar onSearch={null} user={user} />

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Admin nadzorna ploča</h1>

          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setTab("items")}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                tab === "items" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Jela
            </button>
            <button
              onClick={() => setTab("orders")}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                tab === "orders" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Narudžbe
            </button>
          </div>

          {tab === "items" && (
            <div>
              <button
                onClick={() => navigate("/createMeniItem")}
                className="mb-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
              >
                + Dodaj novo jelo
              </button>

              {loading ? (
                <p className="text-gray-400">Učitavanje...</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={`http://localhost:8000${item.Image}`}
                          alt={item.Name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.Name}</p>
                          <p className="text-sm text-gray-500">€{item.Price}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-sm text-red-600 hover:text-red-800 px-3 py-1"
                      >
                        Obriši
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "orders" && (
            <div>
              {loading ? (
                <p className="text-gray-400">Učitavanje...</p>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900">Narudžba #{order.id}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.created_at).toLocaleString("hr-HR")}
                          </p>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-sm border border-gray-200 rounded-lg px-2 py-1 text-gray-900"
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="text-sm text-gray-600">
                        {order.items.map((oi, idx) => (
                          <p key={idx}>{oi.quantity}x {oi.menu_item_name} — €{oi.price}</p>
                        ))}
                      </div>

                      <p className="text-sm font-medium text-gray-900 mt-2">
                        Ukupno: €{order.total_price}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;