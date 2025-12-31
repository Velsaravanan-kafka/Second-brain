"use client";

import React from "react";
import { Plus, Book, Code, Brain, FileText, Trash2 } from "lucide-react";
import { Node } from "@/types";

interface DashboardProps {
  nodes: Node[];
  onEnter: (node: Node) => void;
  onAddSubject: () => void;
  onDelete: (id: string) => void;
}

export default function DashboardView({
  nodes,
  onEnter,
  onAddSubject,
  onDelete,
}: DashboardProps) {
  return (
    <div className="min-h-screen bg-[#FDFCF5] p-10 font-sans text-[#2C2C2C]">
      <h1 className="text-3xl font-bold mb-8 tracking-tight text-stone-800">
        Welcome Bot 👋
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        {/* Render Existing Subjects (Root Nodes) */}
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => onEnter(node)}
            className="aspect-square border border-stone-200 rounded-xl flex flex-col items-center justify-center gap-4 bg-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            {/* Dynamic Icon based on Title */}
            <div className="text-stone-600 group-hover:text-stone-900 transition-colors">
              {node.title.toLowerCase().includes("brain") ? (
                <Brain size={40} strokeWidth={1.5} />
              ) : node.title.toLowerCase().includes("book") ? (
                <Book size={40} strokeWidth={1.5} />
              ) : node.title.toLowerCase().includes("code") ? (
                <Code size={40} strokeWidth={1.5} />
              ) : (
                <FileText size={40} strokeWidth={1.5} />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents entering the subject when clicking delete
                  onDelete(node.id);
                }}
                className="absolute top-2 right-2 p-1.5 text-stone-300 hover:text-red-500 hover:bg-stone-100 rounded-full opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />{" "}
                {/* Make sure to import Trash2 from lucide-react */}
              </button>
            </div>

            <span className="font-semibold text-lg text-stone-700">
              {node.title}
            </span>
          </div>
        ))}

        {/* "Add New Subject" Button */}
        <button
          onClick={onAddSubject}
          className="aspect-square border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center gap-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 hover:border-stone-400 transition"
        >
          <Plus size={40} strokeWidth={1} />
          <span className="font-medium">New Subject</span>
        </button>
      </div>
    </div>
  );
}
