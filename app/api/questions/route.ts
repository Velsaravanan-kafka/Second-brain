import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nodeId = searchParams.get("nodeId");
  if (!nodeId) return NextResponse.json([], { status: 400 });

  const questions = await prisma.question.findMany({
    where: { nodeId },
    orderBy: { createdAt: "desc" }, // Newest first
  });
  return NextResponse.json(questions);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newQ = await prisma.question.create({
      data: {
        id: body.id,
        question: body.question,
        nodeId: body.nodeId,
        isSolved: false,
      },
    });
    return NextResponse.json(newQ);
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating question" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, answer, question } = body; // <--- ACCEPT 'question'

    // Construct the update object dynamically
    const updateData: any = {};
    if (answer !== undefined) updateData.answer = answer;
    if (question !== undefined) updateData.question = question; // <--- ADD THIS

    // Auto-solve logic (only if answer is being updated)
    if (answer !== undefined) {
      updateData.isSolved = answer && answer.trim().length > 0;
    }

    const updatedQ = await prisma.question.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(updatedQ);
  } catch (error) {
    return NextResponse.json({ error: "Error updating" }, { status: 500 });
  }
}

// app/api/questions/route.ts

// ... your existing imports and POST/GET code ...

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response("Missing ID", { status: 400 });
    }

    // --- THE FIX: ACTUALLY DELETE FROM PRISMA ---
    await prisma.question.delete({
      where: { id: id },
    });
    // --------------------------------------------

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
