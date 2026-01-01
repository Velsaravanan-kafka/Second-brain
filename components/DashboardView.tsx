"use client";

import React, { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Node } from "@/types";
import { AVAILABLE_ICONS, getIconComponent } from "@/lib/iconMap";
import { useUser, UserButton } from "@clerk/nextjs";

interface DashboardProps {
  nodes: Node[];
  onEnter: (node: Node) => void;
  // We replaced 'onAddSubject' with this specific handler that takes an icon
  onAddNode: (parentId: string, title: string, icon: string) => void;
  onDelete: (id: string) => void;
}

export default function DashboardView({
  nodes,
  onEnter,
  onAddNode,
  onDelete,
}: DashboardProps) {
  const { user } = useUser();
  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newIcon, setNewIcon] = useState<string>("brain");

  const handleModalSubmit = () => {
    if (!newTitle.trim()) return;
    // Call the parent function: (parentId, title, icon)
    onAddNode("root", newTitle, newIcon);

    // Reset and Close
    setIsModalOpen(false);
    setNewTitle("");
    setNewIcon("brain");
  };

  return (
    <div className="min-h-screen bg-[#FDFCF5] p-10 font-sans text-[#2C2C2C]">
      <h1 className="text-3xl font-bold mb-8 tracking-tight text-stone-800">
        Welcome {user?.firstName || "Explorer"} 👋
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        {/* 1. RENDER EXISTING SUBJECTS */}
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => onEnter(node)}
            className="relative aspect-square border border-stone-200 rounded-xl flex flex-col items-center justify-center gap-4 bg-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            {/* DYNAMIC ICON RENDERER */}
            <div className="text-stone-600 group-hover:text-stone-900 transition-colors">
              {(() => {
                // This lines gets the correct icon from your DB string (e.g. "code")
                const IconComponent =
                  getIconComponent(node.icon || null) ||
                  getIconComponent("brain");
                // @ts-ignore
                return <IconComponent size={40} strokeWidth={1.5} />;
              })()}
            </div>

            <span className="font-semibold text-lg text-stone-700">
              {node.title}
            </span>

            {/* DELETE BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
              className="absolute top-2 right-2 p-1.5 text-stone-300 hover:text-red-500 hover:bg-stone-100 rounded-full opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {/* 2. "ADD NEW SUBJECT" BUTTON */}
        <button
          onClick={() => setIsModalOpen(true)} // <--- Opens the Modal
          className="aspect-square border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center gap-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 hover:border-stone-400 transition"
        >
          <Plus size={40} strokeWidth={1} />
          <span className="font-medium">New Subject</span>
        </button>
      </div>

      {/* 3. THE POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-stone-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h3 className="font-serif font-bold text-stone-800">
                Create New Subject
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Name Input */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Subject Name
                </label>
                <input
                  autoFocus
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Physics, Journal..."
                  className="w-full text-lg font-serif border-b-2 border-stone-200 focus:border-stone-800 outline-none py-2 bg-transparent transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleModalSubmit()}
                />
              </div>

              {/* Icon Picker */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Select Icon
                </label>
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                  {AVAILABLE_ICONS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = newIcon === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setNewIcon(item.id)}
                        className={`flex-shrink-0 p-3 rounded-lg transition-all border ${
                          isSelected
                            ? "bg-stone-800 text-white border-stone-800 scale-105 shadow-md"
                            : "bg-stone-50 text-stone-400 border-stone-100 hover:border-stone-300 hover:bg-white"
                        }`}
                        title={item.label}
                      >
                        <Icon size={20} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleModalSubmit}
                disabled={!newTitle.trim()}
                className="w-full bg-stone-800 text-white py-3 rounded-lg font-medium hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-stone-200"
              >
                Create Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
