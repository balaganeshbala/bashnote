import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCategories, getEntries, addEntry, updateEntry, deleteEntry, updateCategory, deleteCategory, updateEntryOrder } from "../firebase/firestore";
import EntryCard from "../components/EntryCard";
import EntryModal from "../components/EntryModal";
import { Check, X, Settings, Pencil, Trash2, Plus, Loader2, ArrowUpDown } from "lucide-react";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { user }       = useAuth();
  const navigate       = useNavigate();

  const [category, setCategory]   = useState(null);
  const [entries, setEntries]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [rearranging, setRearranging] = useState(false);

  // Category name editing
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue]     = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    load();
  }, [categoryId]);

  async function load() {
    setLoading(true);
    const [cats, ents] = await Promise.all([
      getCategories(user.uid),
      getEntries(user.uid, categoryId),
    ]);
    const cat = cats.find((c) => c.id === categoryId) || null;
    setCategory(cat);
    setNameValue(cat?.name || "");
    setEntries(ents);
    setLoading(false);
  }

  async function handleSave(data) {
    if (editEntry) {
      await updateEntry(user.uid, categoryId, editEntry.id, data);
    } else {
      await addEntry(user.uid, categoryId, data);
    }
    setModalOpen(false);
    setEditEntry(null);
    load();
  }

  async function handleDeleteEntry(entryId) {
    if (!confirm("Delete this entry?")) return;
    await deleteEntry(user.uid, categoryId, entryId);
    load();
  }

  async function handleSaveName() {
    if (!nameValue.trim() || nameValue.trim() === category.name) {
      setEditingName(false);
      return;
    }
    await updateCategory(user.uid, categoryId, nameValue.trim());
    setEditingName(false);
    load();
  }

  async function handleDeleteCategory() {
    if (!confirm(`Delete "${category.name}" and all its entries? This cannot be undone.`)) return;
    await deleteCategory(user.uid, categoryId);
    navigate("/");
  }

  async function moveEntry(idx, dir) {
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= entries.length) return;
    const reordered = [...entries];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
    setEntries(reordered);
    await updateEntryOrder(user.uid, categoryId, reordered);
  }

  function openNew() {
    setEditEntry(null);
    setModalOpen(true);
  }

  function openEdit(entry) {
    setEditEntry(entry);
    setModalOpen(true);
  }

  if (loading) return <div className="flex justify-center pt-20 text-brand-500"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                className="input text-xl font-bold"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") setEditingName(false);
                }}
                autoFocus
              />
              <button onClick={handleSaveName} className="btn-primary text-xs py-1 px-3 inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Save</button>
              <button onClick={() => setEditingName(false)} className="btn-ghost text-xs py-1 px-3 inline-flex items-center gap-1.5"><X className="w-3.5 h-3.5" /> Cancel</button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white truncate">{category?.name}</h1>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full shrink-0">
                {entries.length} {entries.length === 1 ? "entry" : "entries"}
              </span>
            </>
          )}
        </div>

        {!editingName && (
          <div className="flex items-center gap-2 shrink-0">
            {rearranging ? (
              <button
                onClick={() => setRearranging(false)}
                className="btn-primary text-sm inline-flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Done
              </button>
            ) : (
              <>
                {/* Settings dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSettingsOpen((o) => !o)}
                    className="btn-ghost text-sm inline-flex items-center gap-1.5"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  {settingsOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setSettingsOpen(false)} />
                      <div className="absolute right-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
                        {entries.length > 1 && (
                          <button
                            onClick={() => { setSettingsOpen(false); setRearranging(true); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors flex items-center gap-2"
                          >
                            <ArrowUpDown className="w-4 h-4" /> Rearrange
                          </button>
                        )}
                        <button
                          onClick={() => { setSettingsOpen(false); setEditingName(true); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                          <Pencil className="w-4 h-4" /> Rename
                        </button>
                        <button
                          onClick={() => { setSettingsOpen(false); handleDeleteCategory(); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete category
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <button onClick={openNew} className="btn-primary text-sm inline-flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> New entry
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="text-gray-500">No entries yet.</p>
          <button onClick={openNew} className="btn-primary text-sm inline-flex items-center gap-1.5 justify-center"><Plus className="w-4 h-4" /> Add your first entry</button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {entries.map((entry, idx) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={() => openEdit(entry)}
              onDelete={() => handleDeleteEntry(entry.id)}
              rearranging={rearranging}
              onMoveUp={() => moveEntry(idx, -1)}
              onMoveDown={() => moveEntry(idx, 1)}
              isFirst={idx === 0}
              isLast={idx === entries.length - 1}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <EntryModal
          initial={editEntry}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditEntry(null); }}
        />
      )}
    </div>
  );
}
