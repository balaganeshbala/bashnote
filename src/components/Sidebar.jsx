import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCategories, addCategory, updateCategoryOrder } from "../firebase/firestore";
import { Vault, Hash, ChevronUp, ChevronDown, Plus, LogOut } from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [categories, setCategories] = useState([]);
  const [adding, setAdding]         = useState(false);
  const [newName, setNewName]       = useState("");

  useEffect(() => {
    if (!user) return;
    loadCategories();
  }, [user]);

  async function loadCategories() {
    const cats = await getCategories(user.uid);
    setCategories(cats);
  }

  async function handleAddCategory() {
    if (!newName.trim()) return;
    await addCategory(user.uid, newName.trim());
    setNewName("");
    setAdding(false);
    loadCategories();
  }

  async function moveCategory(e, idx, dir) {
    e.preventDefault();
    e.stopPropagation();
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= categories.length) return;
    const reordered = [...categories];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
    setCategories(reordered); // optimistic update
    await updateCategoryOrder(user.uid, reordered);
  }

  return (
    <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
        <Vault className="w-5 h-5 text-brand-500" />
        <span className="text-lg font-bold text-white tracking-tight">BashNote</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {categories.map((cat, idx) => (
          <NavLink
            key={cat.id}
            to={`/category/${cat.id}`}
            className={({ isActive }) =>
              `group flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-100 ${
                isActive
                  ? "bg-brand-500/20 text-brand-400 font-medium"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
              }`
            }
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Hash className="w-4 h-4 shrink-0 opacity-70" />
              <span className="truncate">{cat.name}</span>
            </div>

            {/* Reorder controls */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={(e) => moveCategory(e, idx, -1)}
                disabled={idx === 0}
                className="text-gray-600 hover:text-gray-300 disabled:opacity-20 p-0.5"
                title="Move up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => moveCategory(e, idx, 1)}
                disabled={idx === categories.length - 1}
                className="text-gray-600 hover:text-gray-300 disabled:opacity-20 p-0.5"
                title="Move down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </NavLink>
        ))}

        {/* Add category */}
        {adding ? (
          <div className="px-2 pt-2 space-y-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input w-full"
              placeholder="Category name"
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={handleAddCategory} className="btn-primary text-xs py-1 flex-1">Add</button>
              <button onClick={() => setAdding(false)} className="btn-ghost text-xs py-1 flex-1">Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-400 hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New category
          </button>
        )}
      </nav>

      {/* User */}
      <div className="px-4 py-3 border-t border-gray-800 flex items-center gap-3">
        <img
          src={user?.photoURL}
          alt="avatar"
          className="w-7 h-7 rounded-full ring-2 ring-brand-500"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-200 truncate">{user?.displayName}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="text-gray-600 hover:text-red-400 transition-colors p-1"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
