"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  FileText,
  Trash2,
} from "lucide-react";
import { Node } from "@/types";

export default function SidebarItem({
  node,
  activeNodeId,
  onSelect,
  onAddChild,
  onDelete,
  level = 0,
}: {
  node: Node;
  activeNodeId: string | null;
  onSelect: (node: Node) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (deleteId: string) => void;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const isActive = activeNodeId === node.id;
  const hasChildren = node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={`group flex items-center justify-between py-1 px-2 rounded-md cursor-pointer transition-colors ${
          isActive
            ? "bg-red-200 text-stone-900 font-semibold"
            : "bg-transparent text-stone-600 hover:bg-stone-200"
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
      >
        <div className="flex items-center gap-1 overflow-hidden">
          <div
            className="p-0.5 rounded-sm hover:bg-stone-300 text-stone-400"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {hasChildren ? (
              isOpen ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )
            ) : (
              <span className="w-[14px] h-[14px] inline-block" />
            )}
          </div>
          <FileText
            size={14}
            className={isActive ? "text-stone-800" : "text-stone-400"}
          />
          <span className="truncate text-sm">{node.title}</span>
        </div>

        <div
          className={`flex items-center gap-1 ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(node.id);
              setIsOpen(true);
            }}
            className="p-1 hover:bg-stone-300 rounded text-stone-500"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            className="p-1 hover:bg-red-300 rounded text-stone-500 hover:text-red-700"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {isOpen && hasChildren && (
        <div className="border-l border-stone-200 ml-4">
          {node.children.map((child) => (
            <SidebarItem
              key={child.id}
              node={child}
              activeNodeId={activeNodeId}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
