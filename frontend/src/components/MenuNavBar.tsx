interface Category {
  id: number;
  Name: string;
  Description: string;
}

interface MenuNavBarProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
}

function MenuNavBar({ categories, selectedCategory, onSelectCategory }: MenuNavBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-2 overflow-x-auto">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
          ${selectedCategory === null
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
      >
        All
      </button>

      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
            ${selectedCategory === cat.id
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          {cat.Name}
        </button>
      ))}
    </div>
  );
}

export default MenuNavBar;

