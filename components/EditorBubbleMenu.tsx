"use client";

import React from "react";
import { BubbleMenu } from "@tiptap/react";
import { Editor } from "@tiptap/react";

import { HelpCircle, Bold, Italic } from "lucide-react";

interface EditorBubbleMenuProps {
  editor: Editor | null;
  onAddQuestion: () => void;
}

export default function EditorBubbleMenu({
  editor,
  onAddQuestion,
}: EditorBubbleMenuProps) {
  if (!editor) return null;

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="bg-stone-900 text-stone-50 px-2 py-1 rounded shadow-xl flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
        {/* The "Ask Question" Button */}
        <button
          onClick={onAddQuestion}
          className="flex items-center gap-1.5 px-2 py-1 hover:bg-stone-700 rounded transition-colors text-xs font-medium"
        >
          <HelpCircle size={14} className="text-red-400" />
          <span>Ask</span>
        </button>

        {/* Divider */}
        <div className="w-px h-3 bg-stone-700 mx-1"></div>

        {/* Standard Formatting Tools */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 hover:bg-stone-700 rounded ${
            editor.isActive("bold") ? "text-blue-400" : ""
          }`}
        >
          <Bold size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 hover:bg-stone-700 rounded ${
            editor.isActive("italic") ? "text-blue-400" : ""
          }`}
        >
          <Italic size={14} />
        </button>
      </div>
    </BubbleMenu>
  );
}
