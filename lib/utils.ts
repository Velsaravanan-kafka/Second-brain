import { Node } from "@/types";

// The shape of the raw data coming from the Database (Prisma)
// It is flat and has a parentId.
export type PrismaNode = {
  id: string;
  title: string;
  content: string | null;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// --- THE TRANSFORMER ---
// Converts Flat Database Rows -> Nested UI Tree
export function buildTree(flatNodes: PrismaNode[]): Node[] {
  const nodeMap = new Map<string, Node>();
  const rootNodes: Node[] = [];

  // 1. Create a map of all nodes (easier to find them by ID)
  // We strictly convert the Prisma data to your UI "Node" type here
  flatNodes.forEach((dbNode) => {
    nodeMap.set(dbNode.id, {
      id: dbNode.id,
      title: dbNode.title,
      children: [], // Start empty
      content: dbNode.content || "",
    });
  });

  // 2. Assemble the tree
  flatNodes.forEach((dbNode) => {
    const node = nodeMap.get(dbNode.id);
    if (!node) return;

    if (dbNode.parentId) {
      // If it has a parent, find the parent and add this node to its children
      const parent = nodeMap.get(dbNode.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        // Edge case: Orphan node (parent deleted?), treat as root for safety
        rootNodes.push(node);
      }
    } else {
      // If no parentId, it is a Root node (like "BRAIN")
      rootNodes.push(node);
    }
  });

  return rootNodes;
}
