import { useState } from "react";

interface DishQAProps {
  dishId: number;
  dishName: string;
}

function DishQA({ dishId, dishName }: DishQAProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    const q = question.trim();
    if (!q) return;

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/menu/${dishId}/qa/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Greška pri dohvaćanju odgovora");
      }

      setAnswer(data.answer);
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
  <div className="mt-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <p className="text-xs text-gray-500 mb-2">
      Pitajte nešto o jelu "{dishName}"
    </p>

    <div className="flex gap-2">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="npr. Sadrži li gluten?"
        className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-400"
      />
      <button
        onClick={handleAsk}
        disabled={loading || !question.trim()}
        className="text-sm px-3 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
      >
        {loading ? "..." : "Pitaj"}
      </button>
    </div>

    {answer && (
      <div className="mt-3 text-sm text-gray-800 bg-gray-50 rounded-lg px-3 py-2">
        {answer}
      </div>
    )}

    {error && (
      <div className="mt-2 text-sm text-red-600">
        {error}
      </div>
    )}
  </div>
);
}

export default DishQA;