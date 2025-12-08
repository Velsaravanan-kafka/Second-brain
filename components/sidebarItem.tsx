"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Plus, FileText } from "lucide-react";
import { Node } from "@/types";

export default function SidebarItem({
  node,
  activeNodeId,
  onSelect,
  onAddChild,
  level = 0,
}: {
  node: Node;
  activeNodeId: string | null;
  onSelect: (node: Node) => void;
  onAddChild: (parentId: string) => void;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState(true); // Default open to see children
  const isActive = activeNodeId === node.id;
  const hasChildren = node.children.length > 0;

  return (
    <div className="select-none">
      {/* Node Row */}
      <div
        className={`group flex items-center justify-between py-1 px-2 rounded-md cursor-pointer transition-colors ${
          isActive
            ? "bg-stone-200 text-stone-900 font-semibold"
            : "text-stone-600 hover:bg-stone-100"
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }} // Indentation
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
      >
        <div className="flex items-center gap-1 overflow-hidden">
          {/* Toggle Arrow (Only if children exist) */}
          <div
            className="p-0.5 rounded-sm hover:bg-stone-300"
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
              // Invisible spacer to keep alignment
              <span className="w-[14px] h-[14px] inline-block" />
            )}
          </div>

          <FileText size={14} className="opacity-100 flex-shrink-0" />
          <span className="truncate">{node.title}</span>
        </div>

        {/* Actions: Appear only if Active or Hovered */}
        <div
          className={`flex items-center gap-1 ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <button
            title="Create Note Inside"
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(node.id);
              setIsOpen(true); // Auto-open to see new child
            }}
            className="p-1 hover:bg-stone-300 rounded"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Recursive Children Rendering */}
      {isOpen && hasChildren && (
        <div className="border-l border-stone-200 ml-4">
          {node.children.map((child) => (
            <SidebarItem
              key={child.id}
              node={child}
              activeNodeId={activeNodeId}
              onSelect={onSelect}
              onAddChild={onAddChild}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
