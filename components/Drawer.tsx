import React from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import QuestionCard from "./QuestionCard";

interface DrawerProps {
  activeDrawer: string | null;
  onToggle: (tab: string) => void;
  questions: any[];

  // Strict Types
  onSaveAnswer: (
    id: string,
    newQuestion: string,
    newAnswer: string
  ) => Promise<void>;

  onAddIndependentQuestion: () => void; // <--- The new feature
  onDeleteQuestion: (id: string) => void;
  showHighlights: boolean;
  onToggleHighlights: () => void;
}

export default function Drawer({
  activeDrawer,
  onToggle,
  questions,
  onSaveAnswer,
  onAddIndependentQuestion,
  onDeleteQuestion,
  showHighlights,
  onToggleHighlights,
}: DrawerProps) {
  // 1. FIX: REMOVED the "if (!activeDrawer) return null" check.
  // The Drawer must always exist so you can see the handle to open it.

  const isOpen = activeDrawer === "questions";

  return (
    <div
      className={`
        fixed bottom-0 right-0 bg-stone-50 border-t border-l border-stone-200 shadow-xl transition-all duration-300 ease-in-out z-50
        ${
          isOpen ? "h-96 w-96" : "h-12 w-48"
        } /* 2. FIX: Height/Width changes on toggle, never vanishes */
      `}
    >
      {/* HEADER: ALWAYS VISIBLE */}
      <div
        className="flex items-center justify-between px-4 h-12 border-b border-stone-200 bg-white cursor-pointer hover:bg-stone-50 transition-colors"
        onClick={() => onToggle("questions")} // Clicking header toggles it
      >
        <div className="flex items-center gap-2">
          {/* 3. FIX: RESTORED UPPERCASE & BOLD styling */}
          <h2 className="font-serif font-bold text-sm tracking-widest text-stone-800 uppercase">
            Questions
          </h2>

          {/* 4. FIX: RESTORED RED BADGE */}
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              questions.length > 0
                ? "bg-red-500 text-white"
                : "bg-stone-200 text-stone-500"
            }`}
          >
            {questions.length}
          </span>

          {/* THE "+" BUTTON (Visible only when open to save space, or always if you prefer) */}
          {isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Don't close drawer when clicking +
                onAddIndependentQuestion();
              }}
              className="ml-1 p-0.5 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-800 hover:text-white transition-all"
              title="Add Independent Question"
            >
              <Plus size={14} />
            </button>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex gap-1 items-center">
          {isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleHighlights();
              }}
              className={`p-1 rounded-md transition-colors mr-1 ${
                showHighlights
                  ? "bg-stone-200 text-stone-700"
                  : "text-stone-300 hover:bg-stone-100"
              }`}
              title={showHighlights ? "Hide Highlights" : "Show Highlights"}
            >
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  showHighlights ? "border-current" : "border-stone-300"
                }`}
              />
            </button>
          )}

          {/* Toggle Icon */}
          <div className="text-stone-400">
            {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </div>
        </div>
      </div>

      {/* CONTENT AREA: Only visible when Open */}
      {isOpen && (
        <div className="h-[calc(100%-3rem)] overflow-y-auto p-4 space-y-4 bg-stone-50">
          {questions.length === 0 ? (
            <div className="text-center mt-10 text-stone-400">
              <p className="text-xs italic">No questions yet.</p>
              <button
                onClick={onAddIndependentQuestion}
                className="mt-2 text-xs underline hover:text-stone-600"
              >
                Add one?
              </button>
            </div>
          ) : (
            questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                onSave={onSaveAnswer}
                onDelete={onDeleteQuestion}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
