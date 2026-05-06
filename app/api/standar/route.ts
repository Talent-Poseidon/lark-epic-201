import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emitDomainEvent } from "@/lib/domain-events";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.standarJabatan.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("[API] GET /api/standar failed:", error);
    return NextResponse.json({ error: "Failed to fetch standar" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { standard } = body;

    if (!standard) {
      return NextResponse.json({ error: "Job standard is required" }, { status: 400 });
    }

    const standar = await prisma.standarJabatan.create({
      data: { standard },
    });

    await emitDomainEvent("StandarSubmitted", "StandarJabatan", standar.id, {
      standard: standar.standard,
    });

    return NextResponse.json(standar, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/standar failed:", error);
    return NextResponse.json({ error: "Failed to create standar" }, { status: 500 });
  }
}
