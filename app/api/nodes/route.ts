import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const nodes = await prisma.node.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(nodes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch nodes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, parentId } = body;

    const newNode = await prisma.node.create({
      data: {
        title: title || "Untitled Note",
        parentId: parentId || null,
        content: "",
      },
    });

    return NextResponse.json(newNode);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create node" },
      { status: 500 }
    );
  }
}

// 3. PATCH: Update a node's title or content
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, title, content } = body;

    const updatedNode = await prisma.node.update({
      where: { id },
      data: {
        title: title, // Updates title if provided
        content: content, // Updates content if provided
      },
    });

    return NextResponse.json(updatedNode);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// 4. DELETE: Remove a node and its children
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    // Note: If you set up "Cascade Delete" in Prisma, this deletes children automatically.
    // If not, we manually delete the node.
    await prisma.node.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
