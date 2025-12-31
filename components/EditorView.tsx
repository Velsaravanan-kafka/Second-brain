"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import { ChevronLeft } from "lucide-react";
import SidebarItem from "@/components/sidebarItem";
import { Node } from "@/types";
import Drawer from "@/components/Drawer";
import EditorBubbleMenu from "@/components/EditorBubbleMenu";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import { QuestionMark } from "./Extensions/QuestionMark";

interface EditorViewProps {
  rootNode: Node;
  treeData: Node[];
  onBack: () => void;
  onAddNode: (parentId: string, title?: string) => void;
  onDeleteNode: (id: string) => void;
  onUpdateTitle: (newTitle: string, activeNodeId: string) => void;
  onUpdateContent: (content: string, id: string) => void;
}

// NOTICE THE "export default" BELOW
export default function EditorView({
  rootNode,
  treeData,
  onBack,
  onAddNode,
  onDeleteNode,
  onUpdateTitle,
  onUpdateContent,
}: EditorViewProps) {
  // Toggle for showing/hiding underlines
  const [showHighlights, setShowHighlights] = useState(true);

  const [activeNode, setActiveNode] = useState<Node | null>(rootNode);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  // Stores the list of questions for the current note
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    // Only fetch if we have a note selected AND the questions tab is open
    if (activeNode && activeDrawer === "questions") {
      fetch(`/api/questions?nodeId=${activeNode.id}`)
        .then((res) => res.json())
        .then((data) => setQuestions(data));
    }
  }, [activeNode, activeDrawer]);

  // --- Tiptap Setup ---
  const editor = useEditor({
    extensions: [
      StarterKit,
      BubbleMenu.configure({
        pluginKey: "bubbleMenu", // Important for stability
      }),
      QuestionMark,
    ],

    content: activeNode?.content || "",
    editorProps: {
      attributes: {
        class: "prose prose-stone focus:outline-none max-w-none min-h-[50vh]",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      // If we have a note selected, send the new text up to be saved
      if (activeNode) {
        onUpdateContent(html, activeNode.id);
      }
    },
    immediatelyRender: false,
  });

  // Sync Editor Content when switching notes
  useEffect(() => {
    if (editor && activeNode) {
      const currentContent = editor.getHTML();
      if (currentContent !== activeNode.content) {
        editor.commands.setContent(activeNode.content || "");
      }
    }
  }, [activeNode?.id, editor]);

  const markAsSolvedInEditor = (qId: string) => {
    if (!editor || !activeNode) return;

    let changeMade = false;

    // 1. Scan and Paint Green
    editor.state.doc.descendants((node, pos) => {
      const mark = node.marks.find(
        (m) => m.type.name === "questionMark" && m.attrs.id === qId
      );

      if (mark) {
        const tr = editor.state.tr.addMark(
          pos,
          pos + node.nodeSize,
          editor.schema.marks.questionMark.create({
            ...mark.attrs,
            isSolved: true,
          })
        );
        editor.view.dispatch(tr);
        changeMade = true;
      }
    });

    // 2. FORCE SAVE TO DB (The missing piece!)
    // This grabs the HTML with the new <span data-is-solved="true"> and saves it.
    if (changeMade) {
      const newHtml = editor.getHTML();
      onUpdateContent(newHtml, activeNode.id);
    }
  };
  // RENAME: handleSaveAnswer -> handleUpdateQuestion
  const handleUpdateQuestion = async (
    qId: string,
    newQuestion: string,
    newAnswer: string
  ) => {
    // 1. Optimistic Update (Update UI instantly)
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              question: newQuestion,
              answer: newAnswer,
              isSolved: !!newAnswer,
            }
          : q
      )
    );

    // 2. Visuals: Turn Green if answered (Visual logic remains same)
    if (newAnswer && markAsSolvedInEditor) {
      markAsSolvedInEditor(qId);
    }

    // 3. API Call (Send both fields)
    await fetch("/api/questions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: qId,
        question: newQuestion, // <--- Now sending the title
        answer: newAnswer,
      }),
    });
  };

  // MODIFIED: Accepts optional string.
  // If string is present -> Creates Independent Question.
  // If string is missing -> Creates Linked Question from Selection.
  const handleAddQuestion = async (manualTextOrEvent?: string | any) => {
    // 1. DETERMINE MODE
    // We ensure 'manualText' is strictly a string to avoid React Event objects
    const manualText =
      typeof manualTextOrEvent === "string" ? manualTextOrEvent : undefined;
    const isManual = !!manualText;

    let realId = crypto.randomUUID();
    let textToUse = manualText;

    // 2. PATH A: SELECTION MODE (The Old Logic)
    if (!isManual) {
      // Safety Checks (Moved inside this block)
      const { from, to, empty } = editor?.state.selection || {};

      // If no text selected and not manual, STOP.
      if (empty || !editor) return;

      // Get text from editor
      textToUse = editor.state.doc.textBetween(from!, to!, " ");

      // Paint the Red Line
      editor.chain().focus().setMark("questionMark", { id: realId }).run();

      // Force Save HTML
      if (activeNode) onUpdateContent(editor.getHTML(), activeNode.id);
    }

    // 3. COMMON PATH: Update State & Database
    const finalQuestionText = textToUse || "New Question";

    const newQ = {
      id: realId,
      question: finalQuestionText,
      answer: null,
      isSolved: false,
    };

    // Optimistic UI Update
    setQuestions((prev) => [newQ, ...prev]);
    setActiveDrawer("questions");

    // API Call
    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: realId,
        question: finalQuestionText,
        nodeId: activeNode?.id,
      }),
    });
  };

  // 1. HELPER: REMOVE MARK FROM EDITOR (Visuals)
  // 1. HELPER: REMOVE MARK (Corrected Logic)
  // 1. HELPER: REMOVE MARK (Debug Version)
  const removeMarkFromEditor = (qId: string) => {
    if (!editor || !activeNode) {
      console.error("❌ Delete Failed: Editor or ActiveNode missing");
      return;
    }

    console.log(`🔍 Hunting for mark with ID: ${qId}`);

    const tr = editor.state.tr;
    let changeMade = false;

    // Scan the document
    editor.state.doc.descendants((node, pos) => {
      // Log what marks we find (to see if ID matches)
      const questionMark = node.marks.find(
        (m) => m.type.name === "questionMark"
      );
      if (questionMark) {
        console.log(
          `   Found a mark at pos ${pos}. ID is: ${questionMark.attrs.id}`
        );

        // CHECK MATCH
        // We convert both to strings to ensure "123" == 123 matches
        if (String(questionMark.attrs.id) === String(qId)) {
          console.log("   ✅ MATCH FOUND! Scheduling removal...");
          tr.removeMark(
            pos,
            pos + node.nodeSize,
            editor.schema.marks.questionMark
          );
          changeMade = true;
        }
      }
    });

    if (changeMade) {
      console.log("💾 Dispatching changes and Saving to DB...");
      editor.view.dispatch(tr);

      // Force Save
      const cleanHtml = editor.getHTML();
      onUpdateContent(cleanHtml, activeNode.id);
    } else {
      console.warn(`⚠️ Could not find any mark matching ID: ${qId}`);
    }
  };

  // 2. MAIN ACTION: DELETE QUESTION
  const handleDeleteQuestion = async (qId: string) => {
    // A. Optimistic Update (Remove from list instantly)
    setQuestions((prev) => prev.filter((q) => q.id !== qId));

    // B. Remove the Red Line
    removeMarkFromEditor(qId);

    // C. API Call (Delete from DB)
    await fetch(`/api/questions?id=${qId}`, {
      method: "DELETE",
    });
  };

  return (
    <div className="flex h-screen bg-[#FDFCF5] text-[#2C2C2C] font-sans overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r border-stone-200 flex flex-col bg-[#F7F5EB]">
        <div className="p-4 border-b border-stone-200 flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1 hover:bg-stone-200 rounded text-stone-500 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-sm font-bold tracking-widest text-stone-600 uppercase truncate">
            {rootNode.title}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {/* Render ONLY the current root subject from the tree */}
          <SidebarItem
            node={treeData.find((n) => n.id === rootNode.id) || rootNode}
            activeNodeId={activeNode?.id || null}
            onSelect={setActiveNode}
            onAddChild={onAddNode}
            onDelete={onDeleteNode}
          />
        </div>
      </aside>

      {/* RIGHT EDITOR */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#FDFCF5]">
        <div className="pt-12 px-12 pb-4 max-w-4xl mx-auto w-full">
          <input
            type="text"
            value={activeNode?.title || ""}
            onChange={(e) => {
              const val = e.target.value;
              setActiveNode((prev) => (prev ? { ...prev, title: val } : null));
              if (activeNode) onUpdateTitle(val, activeNode.id);
            }}
            disabled={!activeNode}
            className="text-5xl font-serif font-bold bg-transparent border-none focus:outline-none w-full placeholder-stone-200 text-stone-800"
            placeholder="Untitled Note"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-12 pb-12">
          <div className="max-w-4xl mx-auto w-full">
            {editor && activeNode ? (
              <>
                {/* --- PLACE IT HERE --- */}
                <EditorBubbleMenu
                  editor={editor}
                  onAddQuestion={handleAddQuestion}
                />

                <div
                  className={`max-w-4xl mx-auto w-full ${
                    !showHighlights ? "hide-highlights" : ""
                  }`}
                >
                  <EditorContent editor={editor} />
                </div>
              </>
            ) : (
              <div className="text-stone-300 italic mt-10">
                Select a note...
              </div>
            )}
          </div>
        </div>
        {/* B. BOTTOM DRAWER (Clean Component) */}
        <Drawer
          activeDrawer={activeDrawer}
          onToggle={(tab) =>
            setActiveDrawer((prev) => (prev === tab ? null : tab))
          }
          questions={questions}
          onSaveAnswer={handleUpdateQuestion}
          showHighlights={showHighlights}
          onToggleHighlights={() => setShowHighlights(!showHighlights)}
          onDeleteQuestion={handleDeleteQuestion}
          //onAddIndependentQuestion={() => handleAddQuestion("NEW QUESTION")}
        />
      </main>
    </div>
  );
}
