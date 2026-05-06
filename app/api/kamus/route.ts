import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emitDomainEvent } from "@/lib/domain-events";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.kamus.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("[API] GET /api/kamus failed:", error);
    return NextResponse.json({ error: "Failed to fetch kamus" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateFile } = body;

    if (!templateFile) {
      return NextResponse.json({ error: "Template file is required" }, { status: 400 });
    }

    const kamus = await prisma.kamus.create({
      data: { templateFile },
    });

    await emitDomainEvent("KamusSubmitted", "Kamus", kamus.id, {
      templateFile: kamus.templateFile,
    });

    return NextResponse.json(kamus, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/kamus failed:", error);
    return NextResponse.json({ error: "Failed to create kamus" }, { status: 500 });
  }
}
