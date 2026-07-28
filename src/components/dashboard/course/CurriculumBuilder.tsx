'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Video,
  Eye,
  Clock,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react';
import type { ICurriculumSection, ILesson } from '@/features/course/api/courseApi';

interface CurriculumBuilderProps {
  value: ICurriculumSection[];
  onChange: (next: ICurriculumSection[]) => void;
}

/** Renders a minute count as "6h 15m" / "45m". Section and course totals are always
 *  derived from lesson durations so they cannot drift from the lessons themselves. */
export const formatMinutes = (mins: number): string => {
  if (!mins) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
};

export const sectionMinutes = (section: ICurriculumSection): number =>
  (section.lessons || []).reduce((sum, l) => sum + (l.durationMinutes || 0), 0);

export const totalMinutes = (sections: ICurriculumSection[]): number =>
  sections.reduce((sum, s) => sum + sectionMinutes(s), 0);

export const totalLessons = (sections: ICurriculumSection[]): number =>
  sections.reduce((sum, s) => sum + (s.lessons?.length || 0), 0);

const emptySection = (index: number): ICurriculumSection => ({
  label: `Week ${index + 1}`,
  title: '',
  description: '',
  youBuild: '',
  tools: [],
  lessons: [],
});

const exampleJson = `[
  {
    "label": "Week 1",
    "title": "Meta Advertising Mastery",
    "description": "Account setup, Pixel/CAPI, audience targeting, Advantage+, creative testing",
    "youBuild": "A live Meta campaign structure with 3 objectives and verified Pixel tracking",
    "tools": ["Meta Business Suite", "Ads Manager", "Pixel Helper"],
    "lessons": [
      { "title": "Pixel & CAPI setup", "durationMinutes": 45, "isPreview": true }
    ]
  }
]`;

const CurriculumBuilder: React.FC<CurriculumBuilderProps> = ({ value, onChange }) => {
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [showImport, setShowImport] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  const updateSection = (index: number, patch: Partial<ICurriculumSection>) => {
    onChange(value.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const addSection = () => {
    onChange([...value, emptySection(value.length)]);
    setOpenSection(value.length);
  };

  const removeSection = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    setOpenSection(null);
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setOpenSection(target);
  };

  const updateLesson = (sectionIndex: number, lessonIndex: number, patch: Partial<ILesson>) => {
    const lessons = (value[sectionIndex].lessons || []).map((l, i) =>
      i === lessonIndex ? { ...l, ...patch } : l,
    );
    updateSection(sectionIndex, { lessons });
  };

  const addLesson = (sectionIndex: number) => {
    const lessons = [
      ...(value[sectionIndex].lessons || []),
      { title: '', durationMinutes: 0, isPreview: false },
    ];
    updateSection(sectionIndex, { lessons });
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    const lessons = (value[sectionIndex].lessons || []).filter((_, i) => i !== lessonIndex);
    updateSection(sectionIndex, { lessons });
  };

  const handleImport = () => {
    setImportError('');
    setImportSuccess('');
    let parsed: unknown;
    try {
      parsed = JSON.parse(importInput);
    } catch {
      setImportError('Invalid JSON. Check for a trailing comma or an unclosed bracket.');
      return;
    }

    const raw = Array.isArray(parsed)
      ? parsed
      : typeof parsed === 'object' && parsed !== null && Array.isArray((parsed as Record<string, unknown>).curriculum)
        ? ((parsed as Record<string, unknown>).curriculum as unknown[])
        : null;

    if (!raw) {
      setImportError('Expected an array of sections, or an object with a "curriculum" array.');
      return;
    }

    const sections: ICurriculumSection[] = [];
    const skipped: string[] = [];

    raw.forEach((item, i) => {
      const s = item as Record<string, unknown>;
      if (typeof s?.title !== 'string' || !s.title.trim()) {
        skipped.push(`#${i + 1} (missing "title")`);
        return;
      }
      sections.push({
        label: typeof s.label === 'string' && s.label.trim() ? s.label.trim() : `Week ${sections.length + 1}`,
        title: s.title.trim(),
        description: typeof s.description === 'string' ? s.description.trim() : '',
        youBuild: typeof s.youBuild === 'string' ? s.youBuild.trim() : '',
        tools: Array.isArray(s.tools) ? s.tools.filter((t): t is string => typeof t === 'string') : [],
        lessons: Array.isArray(s.lessons)
          ? s.lessons
              .filter((l): l is Record<string, unknown> => typeof l === 'object' && l !== null)
              .map((l) => ({
                title: typeof l.title === 'string' ? l.title : '',
                durationMinutes: Number(l.durationMinutes) || 0,
                // Explicit true only — avoids a truthy string flipping a paid lesson to free.
                isPreview: l.isPreview === true,
              }))
              .filter((l) => l.title)
          : [],
      });
    });

    if (sections.length === 0) {
      setImportError('No valid sections found. Each section needs at least a "title".');
      return;
    }

    onChange([...value, ...sections]);
    setImportSuccess(
      `Imported ${sections.length} section${sections.length === 1 ? '' : 's'}.` +
        (skipped.length ? ` Skipped: ${skipped.join(', ')}.` : ''),
    );
    setImportInput('');
    setTimeout(() => {
      setShowImport(false);
      setImportSuccess('');
    }, 1800);
  };

  const mins = totalMinutes(value);
  const lessonCount = totalLessons(value);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Curriculum</label>
          {value.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              {value.length} section{value.length === 1 ? '' : 's'}
              {lessonCount > 0 && ` • ${lessonCount} lesson${lessonCount === 1 ? '' : 's'}`}
              {mins > 0 && ` • ${formatMinutes(mins)} total`}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowImport(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <Clipboard className="w-3.5 h-3.5" />
          Bulk Import
        </button>
      </div>

      {value.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
          <Video className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No sections yet.</p>
          <p className="text-xs text-gray-400 mt-1">
            Courses without a curriculum simply hide this block on the landing page.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {value.map((section, i) => {
          const isOpen = openSection === i;
          const secMins = sectionMinutes(section);
          return (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 bg-gray-50 p-3">
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? null : i)}
                  className="flex flex-1 items-center gap-3 text-left min-w-0"
                >
                  <span className="shrink-0 rounded-md bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700">
                    {section.label || `#${i + 1}`}
                  </span>
                  <span className="truncate text-sm font-medium text-gray-900">
                    {section.title || <span className="text-gray-400 italic">Untitled section</span>}
                  </span>
                  {(section.lessons?.length || 0) > 0 && (
                    <span className="shrink-0 text-xs text-gray-400">
                      {section.lessons?.length} lesson{section.lessons?.length === 1 ? '' : 's'}
                      {secMins > 0 && ` • ${formatMinutes(secMins)}`}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(i, -1)}
                  disabled={i === 0}
                  className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
                  aria-label="Move section up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(i, 1)}
                  disabled={i === value.length - 1}
                  className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
                  aria-label="Move section down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeSection(i)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"
                  aria-label="Remove section"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? null : i)}
                  className="p-1.5 text-gray-400"
                  aria-label={isOpen ? 'Collapse section' : 'Expand section'}
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {isOpen && (
                <div className="space-y-4 border-t border-gray-100 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                      <input
                        type="text"
                        value={section.label}
                        onChange={(e) => updateSection(i, { label: e.target.value })}
                        placeholder="Week 1 / Level 1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(i, { title: e.target.value })}
                        placeholder="Meta Advertising Mastery"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Focus</label>
                    <textarea
                      value={section.description || ''}
                      onChange={(e) => updateSection(i, { description: e.target.value })}
                      rows={2}
                      placeholder="What this section covers"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">You Build</label>
                    <textarea
                      value={section.youBuild || ''}
                      onChange={(e) => updateSection(i, { youBuild: e.target.value })}
                      rows={2}
                      placeholder="The concrete deliverable the learner keeps"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Core Tools</label>
                    <input
                      type="text"
                      value={(section.tools || []).join(', ')}
                      onChange={(e) =>
                        updateSection(i, {
                          tools: e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="Meta Business Suite, Ads Manager, Pixel Helper"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Comma separated.</p>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-600">
                          Lessons <span className="font-normal text-gray-400">(optional)</span>
                        </label>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Leave empty to describe this section at week level only.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addLesson(i)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Plus className="w-3 h-3" />
                        Lesson
                      </button>
                    </div>

                    {(section.lessons || []).map((lesson, li) => (
                      <div key={li} className="flex items-center gap-2 mb-2">
                        <Video className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => updateLesson(i, li, { title: e.target.value })}
                          placeholder="Lesson title"
                          className="flex-1 min-w-0 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                        />
                        <div className="relative shrink-0">
                          <Clock className="w-3 h-3 text-gray-300 absolute left-2 top-1/2 -translate-y-1/2" />
                          <input
                            type="number"
                            min={0}
                            value={lesson.durationMinutes || ''}
                            onChange={(e) =>
                              updateLesson(i, li, { durationMinutes: parseInt(e.target.value) || 0 })
                            }
                            placeholder="min"
                            className="w-20 pl-7 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => updateLesson(i, li, { isPreview: !lesson.isPreview })}
                          className={`shrink-0 inline-flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                            lesson.isPreview
                              ? 'border-teal-300 bg-teal-50 text-teal-700'
                              : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                          }`}
                          title="Free preview lesson"
                        >
                          <Eye className="w-3 h-3" />
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => removeLesson(i, li)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-md shrink-0"
                          aria-label="Remove lesson"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addSection}
        className="mt-3 w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/30 transition-all inline-flex items-center justify-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        Add Section
      </button>

      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Bulk Import Curriculum</h4>
              <button
                type="button"
                onClick={() => setShowImport(false)}
                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-3">
              Paste a JSON array of sections. Imported sections are appended to any existing ones.
            </p>

            <textarea
              value={importInput}
              onChange={(e) => setImportInput(e.target.value)}
              rows={10}
              placeholder={exampleJson}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
            />

            {importError && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{importError}</span>
              </div>
            )}
            {importSuccess && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{importSuccess}</span>
              </div>
            )}

            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-700">
                Show expected format
              </summary>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                {exampleJson}
              </pre>
            </details>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImport(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImport}
                className="px-4 py-2 rounded-xl bg-teal-600 text-sm font-medium text-white hover:bg-teal-700"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumBuilder;
