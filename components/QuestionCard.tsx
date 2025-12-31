import React, { useState } from "react";
import { Edit2, Check, X, Trash2 } from "lucide-react";

interface QuestionCardProps {
  question: any;
  index: number;
  onSave: (id: string, newQuestion: string, newAnswer: string) => void;
  onDelete: (id: string) => void;
}

export default function QuestionCard({
  question,
  index,
  onSave,
  onDelete,
}: QuestionCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  // State for BOTH fields
  const [editedQuestion, setEditedQuestion] = useState(question.question);
  const [editedAnswer, setEditedAnswer] = useState(question.answer || "");

  const handleSaveClick = () => {
    onSave(question.id, editedQuestion, editedAnswer);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    // Revert changes
    setEditedQuestion(question.question);
    setEditedAnswer(question.answer || "");
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-stone-200 mb-3 hover:shadow-md transition-shadow group">
      {/* HEADER: Dynamic Input or Text */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 mr-2">
          <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block mb-1">
            {isEditing ? "Editing Question..." : `Q${index + 1}`}
          </span>

          {isEditing ? (
            /* EDIT MODE: Input Box for Title */
            <input
              type="text"
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              className="w-full text-sm font-serif font-medium text-stone-800 bg-stone-50 border-b border-stone-300 focus:border-stone-800 focus:outline-none py-1"
              placeholder="Type question here..."
              autoFocus // Puts focus here first
            />
          ) : (
            /* VIEW MODE: Normal Text */
            <h3 className="text-sm font-serif font-medium text-stone-800 leading-tight">
              {question.question}
            </h3>
          )}
        </div>

        {/* Status Dot */}
        <div
          className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
            question.isSolved ? "bg-green-500" : "bg-red-400"
          }`}
        />
      </div>

      {/* BODY: Dynamic Textarea or Text */}
      <div className="mb-3">
        {isEditing ? (
          <textarea
            value={editedAnswer}
            onChange={(e) => setEditedAnswer(e.target.value)}
            className="w-full text-sm text-stone-600 bg-stone-50 p-2 rounded border border-stone-200 focus:border-stone-400 focus:outline-none min-h-[60px]"
            placeholder="Type your answer..."
          />
        ) : (
          <p
            className={`text-sm ${
              question.answer ? "text-stone-600" : "text-stone-400 italic"
            }`}
          >
            {question.answer || "No answer yet..."}
          </p>
        )}
      </div>

      {/* FOOTER: Buttons */}
      <div className="flex justify-end gap-2 items-center">
        {/* Delete only visible when NOT editing */}
        {!isEditing && (
          <button
            onClick={() => onDelete(question.id)}
            className="p-1.5 rounded-full hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors mr-auto opacity-0 group-hover:opacity-100"
            title="Delete Question"
          >
            <Trash2 size={14} />
          </button>
        )}

        {isEditing ? (
          <>
            <button
              onClick={handleCancelClick}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 transition-colors"
            >
              <X size={16} />
            </button>
            <button
              onClick={handleSaveClick}
              className="flex items-center gap-1 px-3 py-1.5 bg-stone-800 text-white rounded-md text-xs font-medium hover:bg-stone-700 transition-colors"
            >
              <Check size={14} />
              <span>Save</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
