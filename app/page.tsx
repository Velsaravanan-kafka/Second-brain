"use client";

import React, { useState, useEffect } from "react";
import { Node } from "@/types";
import { buildTree, PrismaNode } from "@/lib/utils";
import DashboardView from "@/components/DashboardView";
import EditorView from "@/components/EditorView";

// --- Helper: Generate simple ID ---
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function PageController() {
  const [treeData, setTreeData] = useState<Node[]>([]);
  const [view, setView] = useState<"dashboard" | "editor">("dashboard");
  const [currentRoot, setCurrentRoot] = useState<Node | null>(null);

  // --- FETCH DATA ---
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const res = await fetch("/api/nodes");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: PrismaNode[] = await res.json();
      setTreeData(buildTree(data));
    } catch (error) {
      console.error("Failed to load notes:", error);
    }
  }

  // --- ACTIONS (Passed down to components) ---

  const handleEnterSubject = (node: Node) => {
    setCurrentRoot(node);
    setView("editor");
  };

  const handleAddSubject = async () => {
    const title = prompt("Enter Subject Name (e.g. Brain, Journal):");
    if (!title) return;
    await handleAddNode("root", title);
  };

  const handleAddNode = async (parentId: string, customTitle?: string) => {
    const title = customTitle || "New Note";
    const newNode: Node = {
      id: generateId(),
      title,
      children: [],
      content: "",
    };

    // 1. Optimistic Update
    const updateRecursive = (nodes: Node[]): Node[] => {
      return nodes.map((n) => {
        if (n.id === parentId)
          return { ...n, children: [...n.children, newNode] };
        if (n.children.length > 0)
          return { ...n, children: updateRecursive(n.children) };
        return n;
      });
    };

    setTreeData((prev) =>
      parentId === "root" ? [...prev, newNode] : updateRecursive(prev)
    );

    // 2. Save to DB & Refresh
    await fetch("/api/nodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        parentId: parentId === "root" ? null : parentId,
      }),
    });
    fetchNotes(); // Re-fetch to get real IDs
  };
  // Add this near your other handlers
  // CORRECTED: Update TreeData instead of ActiveNode
  const handleUpdateContent = (newContent: string, nodeId: string) => {
    // 1. Update Global Tree Data
    // (This saves the text in memory so if you switch pages, it's still there)
    const updateContentRec = (nodes: Node[]): Node[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, content: newContent };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateContentRec(node.children) };
        }
        return node;
      });
    };

    setTreeData((prev) => updateContentRec(prev));

    // 2. Debounce Save to DB (Wait 1s, then save)
    // We use a simple timeout here.
    setTimeout(async () => {
      await fetch("/api/nodes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: nodeId, content: newContent }),
      });
    }, 1000);
  };

  const handleDelete = async (deleteId: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;

    // 1. Optimistic Update (Remove from screen immediately)
    const deleteRec = (nodes: Node[]): Node[] =>
      nodes
        .filter((n) => n.id !== deleteId)
        .map((n) => ({ ...n, children: deleteRec(n.children) }));

    setTreeData((prev) => deleteRec(prev));

    // 2. Real API Delete
    try {
      await fetch(`/api/nodes?id=${deleteId}`, { method: "DELETE" });
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Could not delete from database.");
    }
  };

  const handleUpdateTitle = (newTitle: string, nodeId: string) => {
    // Recursive title update
    const updateTitleRec = (nodes: Node[]): Node[] =>
      nodes.map((n) => {
        if (n.id === nodeId) return { ...n, title: newTitle };
        if (n.children.length > 0)
          return { ...n, children: updateTitleRec(n.children) };
        return n;
      });
    setTreeData((prev) => updateTitleRec(prev));
    // You can add API debounce save here later
  };

  // --- RENDER ---
  if (view === "dashboard") {
    return (
      <DashboardView
        nodes={treeData}
        onEnter={handleEnterSubject}
        onAddSubject={handleAddSubject}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <EditorView
      rootNode={currentRoot!}
      treeData={treeData}
      onBack={() => setView("dashboard")}
      onAddNode={handleAddNode}
      onDeleteNode={handleDelete}
      onUpdateTitle={handleUpdateTitle}
      onUpdateContent={handleUpdateContent}
    />
  );
}
