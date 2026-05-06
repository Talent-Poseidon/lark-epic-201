import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emitDomainEvent } from "@/lib/domain-events";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.scenario.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("[API] GET /api/scenario failed:", error);
    return NextResponse.json({ error: "Failed to fetch scenarios" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { details } = body;

    if (!details) {
      return NextResponse.json({ error: "Scenario details are required" }, { status: 400 });
    }

    const scenario = await prisma.scenario.create({
      data: { details },
    });

    await emitDomainEvent("ScenarioSubmitted", "Scenario", scenario.id, {
      details: scenario.details,
    });

    return NextResponse.json(scenario, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/scenario failed:", error);
    return NextResponse.json({ error: "Failed to create scenario" }, { status: 500 });
  }
}
