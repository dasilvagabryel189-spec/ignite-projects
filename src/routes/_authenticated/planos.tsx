import { createFileRoute } from "@tanstack/react-router";
import { PlanCards } from "@/components/plans";
import { subscriptionQuery } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/planos")({
  head: () => ({ meta: [{ title: "Planos — Primeiro Projeto Online" }, { name: "description", content: "Plano Base e complemento PRO+." }, { property: "og:title", content: "Planos — Primeiro Projeto Online" }, { property: "og:description", content: "Plano Base e complemento PRO+." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(subscriptionQuery()),
  component: () => (
    <div>
      <h1 className="font-display text-3xl font-semibold">Planos</h1>
      <p className="mt-2 text-muted-foreground">O PRO+ é um complemento do plano Base.</p>
      <div className="mt-8"><PlanCards /></div>
    </div>
  ),
});
