import { useState } from "react";

export default function EntryModal({ initial, onSave, onClose }) {
  const [name, setName]     = useState(initial?.name || "");
  const [fields, setFields] = useState(
    initial?.fields || [{ label: "", value: "", sensitive: false }]
  );

  function updateField(idx, key, value) {
    setFields((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [key]: value } : f))
    );
  }

  function addField() {
    setFields((prev) => [...prev, { label: "", value: "", sensitive: false }]);
  }

  function removeField(idx) {
    setFields((prev) => prev.filter((_, i) => i !== idx));
  }

  function moveField(idx, dir) {
    const next = [...fields];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setFields(next);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), fields });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold text-base">
            {initial ? "Edit entry" : "New entry"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-lg leading-none">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-4 space-y-5 overflow-y-auto flex-1">
            {/* Entry name */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Entry name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. HDFC Savings, Zerodha Demat"
                autoFocus
                required
              />
            </div>

            {/* Fields */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-400 uppercase tracking-wide">Fields</label>
                <button type="button" onClick={addField} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  + Add field
                </button>
              </div>
              <div className="space-y-2">
                {fields.map((field, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-700 rounded-lg p-2">
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5">
                      <button type="button" onClick={() => moveField(idx, -1)} className="text-gray-600 hover:text-gray-300 text-xs leading-none">▲</button>
                      <button type="button" onClick={() => moveField(idx,  1)} className="text-gray-600 hover:text-gray-300 text-xs leading-none">▼</button>
                    </div>
                    {/* Label */}
                    <input
                      className="input w-32 shrink-0"
                      value={field.label}
                      onChange={(e) => updateField(idx, "label", e.target.value)}
                      placeholder="Label"
                    />
                    {/* Value */}
                    <input
                      className="input flex-1"
                      value={field.value}
                      onChange={(e) => updateField(idx, "value", e.target.value)}
                      placeholder="Value"
                      type={field.sensitive ? "password" : "text"}
                    />
                    {/* Sensitive toggle */}
                    <button
                      type="button"
                      onClick={() => updateField(idx, "sensitive", !field.sensitive)}
                      title={field.sensitive ? "Mark as not sensitive" : "Mark as sensitive"}
                      className={`text-xs px-2 py-1 rounded border shrink-0 transition-colors ${
                        field.sensitive
                          ? "border-brand-500 text-brand-400 bg-brand-500/10"
                          : "border-gray-600 text-gray-500 hover:border-gray-400"
                      }`}
                    >
                      Sensitive
                    </button>
                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeField(idx)}
                      className="text-gray-600 hover:text-red-400 text-xs shrink-0 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Mark a field as Sensitive to hide its value by default in the vault.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-800 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="btn-ghost text-sm">Cancel</button>
            <button type="submit" className="btn-primary text-sm">
              {initial ? "Save changes" : "Create entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
