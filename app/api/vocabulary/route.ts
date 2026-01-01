import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. GET: Fetch Vocabulary
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nodeId = searchParams.get("nodeId");

  if (!nodeId)
    return NextResponse.json({ error: "Node ID required" }, { status: 400 });

  const items = await prisma.vocabulary.findMany({
    where: { nodeId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

// 2. POST: Save Vocabulary
export async function POST(request: Request) {
  const { id, text, nodeId } = await request.json();

  const newItem = await prisma.vocabulary.create({
    data: {
      id,
      text,
      nodeId,
      // definition: null (Optional for V2)
    },
  });

  return NextResponse.json(newItem);
}

// 3. DELETE: Remove Vocabulary
export async function DELETE(request: Request) {
  const { id } = await request.json();

  await prisma.vocabulary.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
