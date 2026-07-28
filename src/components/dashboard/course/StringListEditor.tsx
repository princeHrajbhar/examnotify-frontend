'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ClipboardPaste } from 'lucide-react';

interface StringListEditorProps {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  helpText?: string;
  /** Shown above the list when the caller wants to explain what good entries look like. */
  example?: string;
}

/**
 * Editor for a flat list of short strings (bullet points, roles, audience lines).
 * Used for whatYouWillLearn, whoIsThisFor, notFor and careerRoles.
 *
 * Supports pasting multiple lines at once, which is how existing course copy gets
 * moved in — pasting a block of bullets adds one entry per line rather than a single
 * entry containing newlines.
 */
const StringListEditor: React.FC<StringListEditorProps> = ({
  label,
  value,
  onChange,
  placeholder,
  helpText,
  example,
}) => {
  const [draft, setDraft] = useState('');

  const addFromDraft = (raw: string) => {
    const lines = raw
      .split('\n')
      .map((line) => line.replace(/^\s*[-•*•]\s*/, '').trim())
      .filter(Boolean);
    if (lines.length === 0) return;
    onChange([...value, ...lines]);
    setDraft('');
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (!text.includes('\n')) return;
    e.preventDefault();
    addFromDraft(text);
  };

  const updateAt = (index: number, next: string) => {
    onChange(value.map((item, i) => (i === index ? next : item)));
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {value.length > 0 && (
          <span className="text-xs text-gray-400">
            {value.length} {value.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {example && <p className="text-xs text-gray-400 mb-2">{example}</p>}

      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addFromDraft(draft);
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
        />
        <button
          type="button"
          onClick={() => addFromDraft(draft)}
          className="px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors inline-flex items-center gap-1.5 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateAt(index, e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-sm"
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                aria-label={`Remove item ${index + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
        <ClipboardPaste className="w-3 h-3" />
        {helpText || 'Press Enter to add. Paste multiple lines to add several at once.'}
      </p>
    </div>
  );
};

export default StringListEditor;
