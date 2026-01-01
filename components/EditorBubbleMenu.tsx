// components/EditorBubbleMenu.tsx
import React from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  AlertCircle, // <--- NEW ICON
  Book, // <--- NEW ICON
} from "lucide-react";
import { BubbleMenu, BubbleMenuProps } from "@tiptap/react";

// 1. UPDATE INTERFACE
interface EditorBubbleMenuProps extends Omit<BubbleMenuProps, "children"> {
  editor: any;
  onAddQuestion: () => void;
  onAddImportant: () => void; // <--- NEW PROP
  onAddVocabulary: () => void; // <--- NEW PROP
}

export const EditorBubbleMenu = ({
  editor,
  onAddQuestion,
  onAddImportant, // <--- RECEIVE IT
  onAddVocabulary, // <--- RECEIVE IT
  ...props
}: EditorBubbleMenuProps) => {
  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex items-center gap-1 bg-stone-900 text-stone-50 px-2 py-1 rounded-md shadow-xl border border-stone-700"
      {...props}
    >
      {/* --- 1. ASK BUTTON --- */}
      <button
        onClick={onAddQuestion}
        className="flex items-center gap-1 px-2 py-1 hover:bg-stone-700 rounded transition-colors text-xs font-medium"
      >
        <span className="font-serif italic">?</span>
        <span>Ask</span>
      </button>

      {/* DIVIDER */}
      <div className="w-px h-4 bg-stone-700 mx-1" />

      {/* --- 2. IMPORTANT BUTTON (Amber) --- */}
      <button
        onClick={onAddImportant}
        className="flex items-center gap-1 px-2 py-1 hover:bg-stone-700 hover:text-amber-400 rounded transition-colors text-xs font-medium"
        title="Mark as Important"
      >
        <AlertCircle size={14} />
      </button>

      {/* --- 3. VOCABULARY BUTTON (Blue) --- */}
      <button
        onClick={onAddVocabulary}
        className="flex items-center gap-1 px-2 py-1 hover:bg-stone-700 hover:text-blue-400 rounded transition-colors text-xs font-medium"
        title="Add to Vocabulary"
      >
        <Book size={14} />
      </button>

      {/* DIVIDER */}
      <div className="w-px h-4 bg-stone-700 mx-1" />

      {/* --- 4. FORMATTING BUTTONS (Existing) --- */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 hover:bg-stone-700 rounded transition-colors ${
          editor.isActive("bold") ? "text-white" : "text-stone-400"
        }`}
      >
        <Bold size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 hover:bg-stone-700 rounded transition-colors ${
          editor.isActive("italic") ? "text-white" : "text-stone-400"
        }`}
      >
        <Italic size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1 hover:bg-stone-700 rounded transition-colors ${
          editor.isActive("underline") ? "text-white" : "text-stone-400"
        }`}
      >
        <Underline size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1 hover:bg-stone-700 rounded transition-colors ${
          editor.isActive("strike") ? "text-white" : "text-stone-400"
        }`}
      >
        <Strikethrough size={14} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-1 hover:bg-stone-700 rounded transition-colors ${
          editor.isActive("code") ? "text-white" : "text-stone-400"
        }`}
      >
        <Code size={14} />
      </button>
    </BubbleMenu>
  );
};
