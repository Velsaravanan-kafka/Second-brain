"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Plus, FileText } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import SidebarItem from "@/components/sidebarItem";
import { initialData } from "@/lib/data";
import { Node } from "@/types";

// --- Types ---
// type Node = {
//   id: string;
//   title: string;
//   children: Node[];
//   content?: string; // Storing simple content in state for prototype
// };

// --- Mock Initial Data ---
// const initialData: Node[] = [
//   {
//     id: "root-brain",
//     title: "BRAIN",
//     children: [],
//     content: "<p>Welcome to your second brain. Start creating nodes.</p>",
//   },
// ];

// --- Helper: Generate simple ID ---
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- RECURSIVE SIDEBAR COMPONENT ---

// --- MAIN PAGE COMPONENT ---
export default function Page2Prototype() {
  const [treeData, setTreeData] = useState<Node[]>(initialData);
  const [activeNode, setActiveNode] = useState<Node>(initialData[0]);

  // --- Tiptap Setup ---
  const editor = useEditor({
    extensions: [StarterKit],
    content: activeNode.content || "",
    editorProps: {
      attributes: {
        class: "prose prose-stone focus:outline-none max-w-none min-h-[50vh]",
      },
    },
    onUpdate: ({ editor }) => {
      // In a real app, save content here
      // For prototype, we just let it be strictly local UI
    },
    immediatelyRender: false,
  });

  // Update editor content when switching nodes
  useEffect(() => {
    if (editor && activeNode) {
      // Only set content if it's different to prevent cursor jumps
      // (Simplified for prototype)
      editor.commands.setContent(activeNode.content || "");
    }
  }, [activeNode.id, editor]);

  // --- LOGIC: Add Node ---
  const handleAddNode = (parentId: string) => {
    const newNode: Node = {
      id: generateId(),
      title: "New Note",
      children: [],
      content: "<p></p>",
    };

    const addNodeRecursive = (nodes: Node[]): Node[] => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          return { ...node, children: [...node.children, newNode] };
        }
        if (node.children.length > 0) {
          return { ...node, children: addNodeRecursive(node.children) };
        }
        return node;
      });
    };

    setTreeData(addNodeRecursive(treeData));
    // Optional: Auto-select the new node?
    // setActiveNode(newNode);
  };

  // --- LOGIC: Update Title (Sync Sidebar <-> Editor) ---
  const handleTitleChange = (newTitle: string) => {
    // 1. Update Active Node State (Immediate UI feedback)
    setActiveNode((prev) => ({ ...prev, title: newTitle }));

    // 2. Update Tree Data (The "Database")
    const updateTitleRecursive = (nodes: Node[]): Node[] => {
      return nodes.map((node) => {
        if (node.id === activeNode.id) {
          return { ...node, title: newTitle };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateTitleRecursive(node.children) };
        }
        return node;
      });
    };
    setTreeData(updateTitleRecursive(treeData));
  };

  return (
    <div className="flex h-screen bg-[#FDFCF5] text-[#2C2C2C] font-sans overflow-hidden">
      {/* --- LEFT SIDEBAR --- */}
      <aside className="w-64 border-r border-stone-200 flex flex-col bg-[#F7F5EB]">
        <div className="p-4 border-b border-stone-200">
          <h2 className="text-sm font-bold tracking-widest text-stone-500 uppercase">
            Explorer
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {treeData.map((node) => (
            <SidebarItem
              key={node.id}
              node={node}
              activeNodeId={activeNode.id}
              onSelect={setActiveNode}
              onAddChild={handleAddNode}
            />
          ))}
        </div>
      </aside>

      {/* --- RIGHT EDITOR --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Editor Header (Title Input) */}
        <div className="pt-12 px-12 pb-4">
          <input
            type="text"
            value={activeNode.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-4xl font-serif font-bold bg-transparent border-none focus:outline-none w-full placeholder-stone-300 text-stone-800"
            placeholder="Untitled Note"
          />
        </div>

        {/* Tiptap Editor Area */}
        <div className="flex-1 overflow-y-auto px-12 pb-12">
          {editor && <EditorContent editor={editor} />}
        </div>
      </main>
    </div>
  );
}
