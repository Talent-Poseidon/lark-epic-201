import { prisma } from "@/lib/prisma";

export type DomainEventType =
  | "KamusSubmitted"
  | "StandarSubmitted"
  | "ScenarioSubmitted";

export type AggregateType = "Kamus" | "StandarJabatan" | "Scenario";

export async function emitDomainEvent(
  eventType: DomainEventType,
  aggregateType: AggregateType,
  aggregateId: string,
  payload: Record<string, unknown>
) {
  const event = await prisma.domainEvent.create({
    data: {
      eventType,
      aggregateType,
      aggregateId,
      payload: JSON.stringify(payload),
    },
  });

  console.log(`[DomainEvent] ${eventType} emitted for ${aggregateType}:${aggregateId}`);

  return event;
}
