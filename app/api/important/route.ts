import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 1. GET: Fetch all Important highlights for a specific Note
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nodeId = searchParams.get("nodeId");

  if (!nodeId)
    return NextResponse.json({ error: "Node ID required" }, { status: 400 });

  const items = await prisma.important.findMany({
    where: { nodeId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

// 2. POST: Save a new Important highlight
export async function POST(request: Request) {
  const { id, text, nodeId } = await request.json();

  const newItem = await prisma.important.create({
    data: {
      id,
      text,
      nodeId,
    },
  });

  return NextResponse.json(newItem);
}

// 3. DELETE: Remove a highlight
export async function DELETE(request: Request) {
  const { id } = await request.json();

  await prisma.important.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
