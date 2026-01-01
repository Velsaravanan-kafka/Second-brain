import React from "react";
import {
  ChevronDown,
  Plus,
  Book,
  AlertCircle,
  HelpCircle,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import QuestionCard from "./QuestionCard";

interface DrawerProps {
  activeDrawer: string | null;
  onToggle: (tab: string) => void;
  questions: any[];
  importantList: any[];
  vocabList: any[];

  onSaveAnswer: (
    id: string,
    newQuestion: string,
    newAnswer: string
  ) => Promise<void>;
  onAddIndependentQuestion: () => void;
  onDeleteQuestion: (id: string) => void;
  showHighlights: boolean;
  onToggleHighlights: () => void;
  onDeleteImportant: (id: string) => void;
  onDeleteVocab: (id: string) => void;
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
  importantList = [],
  vocabList = [],
  onDeleteImportant,
  onDeleteVocab,
}: DrawerProps) {
  const isOpen = activeDrawer !== null;

  // Helper for tab styling
  const getTabClass = (tabName: string) => {
    const isActive = activeDrawer === tabName;
    return `
      flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-r border-stone-200
      ${
        isActive
          ? "bg-stone-50 text-stone-900 border-t-2 border-t-stone-800"
          : "bg-white text-stone-500 hover:bg-stone-50 hover:text-stone-700"
      }
    `;
  };

  return (
    // CONTAINER:
    // 1. fixed bottom-0 right-0 -> Anchors to bottom right
    // 2. left-0 md:left-64 -> STOPS it from covering the sidebar (Adjust 'left-64' if your sidebar is different size)
    // 3. z-40 -> Sits above text, but below modals (z-50)
    <div className="fixed bottom-0 right-0 left-0 md:left-64 z-40 flex flex-col shadow-[0_-5px_25px_-5px_rgba(0,0,0,0.1)] pointer-events-none transition-all duration-300">
      {/* 1. THE CONTENT PANEL (Slides UP) */}
      {/* pointer-events-auto allows interaction inside the drawer */}
      {isOpen && (
        <div className="w-full bg-stone-50 border-t border-stone-200 h-[50vh] flex flex-col pointer-events-auto animate-in slide-in-from-bottom-10 duration-200">
          {/* THE HEADER (Title + Controls) */}
          <div className="flex items-center justify-between px-6 h-14 bg-white border-b border-stone-200 shrink-0">
            {/* LEFT: Controls Cluster */}
            <div className="flex items-center gap-4">
              <h2 className="font-serif font-bold text-sm tracking-widest text-stone-800 uppercase">
                {activeDrawer}
              </h2>

              {/* Question Controls */}
              {activeDrawer === "questions" && (
                <div className="flex items-center gap-1.5 bg-stone-100 rounded-full px-1.5 py-0.5 border border-stone-200">
                  <span
                    className={`text-[10px] font-bold px-1.5 rounded-full ${
                      questions.length > 0 ? "text-red-500" : "text-stone-400"
                    }`}
                  >
                    {questions.length}
                  </span>
                  <div className="w-px h-3 bg-stone-300" />
                  <button
                    onClick={onToggleHighlights}
                    className={`p-0.5 rounded-full hover:bg-stone-200 transition-colors ${
                      showHighlights ? "text-stone-600" : "text-stone-400"
                    }`}
                    title={
                      showHighlights ? "Hide Highlights" : "Show Highlights"
                    }
                  >
                    {showHighlights ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                  <div className="w-px h-3 bg-stone-300" />
                  <button
                    onClick={onAddIndependentQuestion}
                    className="p-0.5 rounded-full hover:bg-stone-800 hover:text-white text-stone-500 transition-colors"
                    title="New Question"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: Close Button */}
            <button
              onClick={() => onToggle(activeDrawer)}
              className="p-1 rounded-md hover:bg-stone-100 text-stone-400"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* CONTENT BODY (Full Width Grid) */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeDrawer === "questions" &&
              (questions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-400">
                  <p className="text-sm italic">No questions yet.</p>
                </div>
              ) : (
                // Full width grid layout
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                  {questions.map((q, i) => (
                    <div key={q.id}>
                      <QuestionCard
                        question={q}
                        index={i}
                        onSave={onSaveAnswer}
                        onDelete={onDeleteQuestion}
                      />
                    </div>
                  ))}
                </div>
              ))}

            {/* --- ✅ CHANGED: IMPORTANT SECTION --- */}
            {activeDrawer === "important" &&
              (importantList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-400">
                  <AlertCircle size={32} className="mb-2 opacity-20" />
                  <p className="text-sm italic">No important highlights yet.</p>
                </div>
              ) : (
                <div className="space-y-3 max-w-4xl mx-auto">
                  {importantList.map((item) => (
                    <div
                      key={item.id}
                      id={`important-card-${item.id}`}
                      className="group bg-amber-50 border border-amber-100 p-4 rounded-lg relative hover:shadow-sm transition-all"
                    >
                      <p className="text-stone-800 font-serif text-sm leading-relaxed">
                        "{item.text}"
                      </p>
                      <button
                        onClick={() => onDeleteImportant(item.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-500 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}

            {/* --- ✅ CHANGED: DICTIONARY SECTION --- */}
            {activeDrawer === "dictionary" &&
              (vocabList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-400">
                  <Book size={32} className="mb-2 opacity-20" />
                  <p className="text-sm italic">Vocabulary is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {vocabList.map((item) => (
                    <div
                      key={item.id}
                      id={`vocab-card-${item.id}`}
                      className="group bg-blue-50 border border-blue-100 p-3 rounded-lg relative hover:shadow-sm transition-all"
                    >
                      <span className="text-stone-800 font-bold text-sm tracking-wide">
                        {item.text}
                      </span>
                      <button
                        onClick={() => onDeleteVocab(item.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-500 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 2. THE TAB BAR (Always Visible Dock) */}
      <div className="w-full bg-white border-t border-stone-300 flex pointer-events-auto">
        <button
          onClick={() => onToggle("questions")}
          className={getTabClass("questions")}
        >
          <HelpCircle
            size={16}
            className={
              activeDrawer === "questions" ? "text-stone-800" : "text-stone-400"
            }
          />
          <span>Questions</span>
          {questions.length > 0 && (
            <span className="ml-1 text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-full font-bold">
              {questions.length}
            </span>
          )}
        </button>

        {/* --- ✅ CHANGED: IMPORTANT TAB (With Counter) --- */}
        <button
          onClick={() => onToggle("important")}
          className={getTabClass("important")}
        >
          <AlertCircle
            size={16}
            className={
              activeDrawer === "important" ? "text-amber-600" : "text-stone-400"
            }
          />
          <span>Important</span>
          {importantList.length > 0 && (
            <span className="ml-1 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">
              {importantList.length}
            </span>
          )}
        </button>

        {/* --- ✅ CHANGED: DICTIONARY TAB (With Counter) --- */}
        <button
          onClick={() => onToggle("dictionary")}
          className={getTabClass("dictionary")}
        >
          <Book
            size={16}
            className={
              activeDrawer === "dictionary" ? "text-blue-600" : "text-stone-400"
            }
          />
          <span>Dictionary</span>
          {vocabList.length > 0 && (
            <span className="ml-1 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">
              {vocabList.length}
            </span>
          )}
        </button>

        {/* Filler Space */}
        <div className="flex-1 bg-white border-b border-white"></div>
      </div>
    </div>
  );
}
