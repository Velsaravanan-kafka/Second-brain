"use client";

import React, { useState } from "react";
import { Check, Edit2, AlertCircle, Book, Bookmark } from "lucide-react";
import QuestionCard from "./QuestionCard";
import { Eye, EyeOff } from "lucide-react";
import { ChevronDown, Plus } from "lucide-react";
// Types specific to this component
type Question = {
  id: string;
  question: string;
  answer: string | null;
  isSolved: boolean;
};

interface DrawerProps {
  activeDrawer: string | null;
  onToggle: (tab: string) => void;
  questions: Question[];
  onSaveAnswer: (
    id: string,
    newQuestion: string,
    newAnswer: string
  ) => Promise<void>;
  showHighlights: boolean;
  onToggleHighlights: () => void;
  onDeleteQuestion: (id: string) => void;
}

export default function Drawer({
  activeDrawer,
  onToggle,
  questions,
  onSaveAnswer,
  showHighlights,
  onToggleHighlights,
  onDeleteQuestion,
}: DrawerProps) {
  // Local state for the "Answer Editor" (doesn't need to be global)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempAnswer, setTempAnswer] = useState("");

  const unsolvedCount = questions.filter((q) => !q.isSolved).length;

  return (
    <div
      className={`border-t border-stone-200 bg-white flex flex-col transition-all duration-300 ease-in-out shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]`}
      style={{ height: activeDrawer ? "40%" : "40px" }}
    >
      {/* 1. HEADER STRIP */}
      <div className="flex items-center h-[40px] bg-[#EBE9DE] px-4 justify-between shrink-0">
        <div className="flex gap-4 h-full pt-1">
          {/* THE QUESTIONS TAB */}
          <div
            // FIX 1: Allow closing! If it's already "questions", clicking sends null (close).
            // If it's something else, it opens "questions".
            onClick={() => onToggle("questions")}
            className={`flex items-center gap-3 px-4 rounded-t-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer select-none ${
              activeDrawer === "questions"
                ? "bg-white text-stone-900 border-t border-x border-stone-200"
                : "bg-[#EBE9DE] text-stone-500 hover:bg-[#E0DECF]"
            }`}
          >
            <span>Questions</span>

            {/* FIX 2: Only show badge if there are UNSOLVED questions */}
            {questions.filter((q) => !q.isSolved).length > 0 && (
              <span className="bg-red-500 text-white text-[9px] px-1.5 rounded-full">
                {questions.filter((q) => !q.isSolved).length}
              </span>
            )}

            {/* THE EYE TOGGLE */}
            {activeDrawer === "questions" && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Keep this! Prevents the tab from closing when clicking the eye.
                  onToggleHighlights();
                }}
                className="hover:bg-stone-100 p-1 rounded-md text-stone-400 hover:text-stone-700 transition-colors ml-1"
                title={showHighlights ? "Hide underlines" : "Show underlines"}
              >
                {showHighlights ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT SIDE ICONS */}
        <div className="flex gap-2 text-stone-400">
          <button className="hover:text-stone-700">
            <AlertCircle size={16} />
          </button>
          <button className="hover:text-stone-700">
            <Book size={16} />
          </button>
        </div>
      </div>

      {/* 2. CONTENT AREA (Clean List) */}
      {activeDrawer === "questions" && (
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto w-full pt-8 px-12 pb-12">
            <div className="space-y-4">
              {questions.length === 0 ? (
                <div className="text-center text-stone-400 text-sm py-10 italic">
                  No questions yet. Highlight text to create one.
                </div>
              ) : (
                questions.map((q: any, i: number) => (
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
          </div>
        </div>
      )}
    </div>
  );
}
