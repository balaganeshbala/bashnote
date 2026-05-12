import { useState } from "react";
import { MoreVertical, Pencil, Trash2, Eye, EyeOff, Copy, ChevronUp, ChevronDown } from "lucide-react";

export default function EntryCard({ entry, onEdit, onDelete, rearranging, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [revealed, setRevealed] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleReveal(idx) {
    setRevealed((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  function copyToClipboard(value) {
    navigator.clipboard.writeText(value);
  }

  return (
    <div className="card space-y-4 hover:border-gray-700 transition-colors">
      {/* Entry name + actions */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white text-base leading-tight">{entry.name}</h3>

        {rearranging ? (
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className="text-gray-600 hover:text-gray-300 disabled:opacity-20 p-0.5"
              title="Move up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className="text-gray-600 hover:text-gray-300 disabled:opacity-20 p-0.5"
              title="Move down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Three-dot menu */
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="text-gray-500 hover:text-gray-200 p-1.5 rounded hover:bg-gray-700 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
                  <button
                    onClick={() => { setMenuOpen(false); onEdit(); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-2">
        {(entry.fields || []).map((field, idx) => (
          <div key={idx} className="flex items-start gap-3 text-sm group">
            <span className="text-gray-500 w-32 shrink-0 truncate text-sm pt-0.5">{field.label}</span>
            <div className="flex-1 flex flex-wrap items-start gap-2 min-w-0">
              <span className="text-gray-200 text-sm break-all">
                {field.sensitive && !revealed[idx]
                  ? "••••••••"
                  : field.value || <span className="text-gray-600 italic">empty</span>}
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {field.sensitive && (
                  <button
                    onClick={() => toggleReveal(idx)}
                    className="text-gray-500 hover:text-gray-200 text-xs flex items-center gap-1"
                  >
                    {revealed[idx] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {revealed[idx] ? "Hide" : "Show"}
                  </button>
                )}
                <button
                  onClick={() => copyToClipboard(field.value)}
                  className="text-gray-500 hover:text-gray-200 text-xs flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
            </div>
          </div>
        ))}
        {(!entry.fields || entry.fields.length === 0) && (
          <p className="text-xs text-gray-600 italic">No fields added.</p>
        )}
      </div>
    </div>
  );
}
