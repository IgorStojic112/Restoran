import { useState } from "react";
import NavBar from "../components/NavBar";
import SpecialityCard from "../components/SpecialityCard";
import { useAuth } from "../context/AuthContex";

interface Recommendation {
  id: number;
  Name: string;
  Description: string;
  Price: string;
  Image: string;
  reason: string;
}

function AIAssistant() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [asked, setAsked] = useState(false);

  const handleAsk = async () => {
    const msg = message.trim();
    if (!msg) return;

    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const response = await fetch("http://localhost:8000/api/menu/recommend/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Greška pri dohvaćanju preporuka");

      setRecommendations(data.recommendations);
      setAsked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nešto je pošlo po krivu");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAsk();
  };

  return (
  <div>
    <NavBar onSearch={null} user={user} />

    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">AI asistent za preporuke</h1>
        <p className="text-gray-500 mb-6">
          Opišite što vam se jede i asistent će predložiti jela s jelovnika.
        </p>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="npr. Želim nešto lagano s mesom"
            className="flex-1 text-gray-900 placeholder-gray-400 bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-gray-400"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !message.trim()}
            className="px-5 py-3 bg-gray-900 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
          >
            {loading ? "..." : "Pitaj"}
          </button>
        </div>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        {asked && !loading && recommendations.length === 0 && !error && (
          <p className="text-gray-400">
            Nema preporuka za ovaj upit, pokušajte drugačije opisati što tražite.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map(item => (
            <div key={item.id} className="border border-gray-100 rounded-xl overflow-hidden">
              <SpecialityCard
                image={`http://localhost:8000${item.Image}`}
                title={item.Name}
                description={item.Description}
                price={item.Price}
              />
              <div className="bg-gray-50 text-sm text-gray-700 px-4 py-3 border-t border-gray-100">
                {item.reason}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
}

export default AIAssistant;