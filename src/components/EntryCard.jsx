import { useState } from "react";

export default function EntryCard({ entry, onEdit, onDelete }) {
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

        {/* Three-dot menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="text-gray-500 hover:text-gray-200 p-1.5 rounded hover:bg-gray-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-1 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
                <button
                  onClick={() => { setMenuOpen(false); onEdit(); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onDelete(); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
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
                    className="text-gray-500 hover:text-gray-200 text-xs"
                  >
                    {revealed[idx] ? "Hide" : "Show"}
                  </button>
                )}
                <button
                  onClick={() => copyToClipboard(field.value)}
                  className="text-gray-500 hover:text-gray-200 text-xs"
                >
                  Copy
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
