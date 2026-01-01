import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // 1. Check who is logged in
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Only fetch notes belonging to THIS user
  const nodes = await prisma.node.findMany({
    where: { userId: userId }, // <--- 🔒 THIS IS THE SEPARATION
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(nodes);
}

export async function POST(request: Request) {
  const { userId } = await auth(); // <--- Check login

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, parentId, icon } = body;

  const node = await prisma.node.create({
    data: {
      title,
      parentId: parentId || null,
      icon: icon || null,
      userId: userId, // <--- 🔒 STAMP THE OWNER
    },
  });

  return NextResponse.json(node);
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  // 🔒 Secure Delete: Ensure the node belongs to the user requesting deletion
  await prisma.node.deleteMany({
    where: {
      id: id,
      userId: userId, // <--- SECURITY CHECK
    },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title, content } = await request.json();

  // 🔒 Secure Update
  const updated = await prisma.node.updateMany({
    where: {
      id: id,
      userId: userId, // <--- SECURITY CHECK
    },
    data: {
      title: title,
      content: content,
    },
  });

  return NextResponse.json(updated);
}
