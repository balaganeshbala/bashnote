import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCategories, getEntries, addEntry, updateEntry, deleteEntry } from "../firebase/firestore";
import EntryCard from "../components/EntryCard";
import EntryModal from "../components/EntryModal";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { user }       = useAuth();

  const [category, setCategory] = useState(null);
  const [entries, setEntries]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null); // null = new entry

  useEffect(() => {
    load();
  }, [categoryId]);

  async function load() {
    setLoading(true);
    const [cats, ents] = await Promise.all([
      getCategories(user.uid),
      getEntries(user.uid, categoryId),
    ]);
    setCategory(cats.find((c) => c.id === categoryId) || null);
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

  async function handleDelete(entryId) {
    if (!confirm("Delete this entry?")) return;
    await deleteEntry(user.uid, categoryId, entryId);
    load();
  }

  function openNew() {
    setEditEntry(null);
    setModalOpen(true);
  }

  function openEdit(entry) {
    setEditEntry(entry);
    setModalOpen(true);
  }

  if (loading) return <div className="text-gray-500 text-sm pt-10 text-center">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">{category?.name}</h1>
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </span>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm">
          <span>+</span> New entry
        </button>
      </div>

      {/* Entries grid */}
      {entries.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="text-gray-500">No entries yet.</p>
          <button onClick={openNew} className="btn-primary text-sm">Add your first entry</button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={() => openEdit(entry)}
              onDelete={() => handleDelete(entry.id)}
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
