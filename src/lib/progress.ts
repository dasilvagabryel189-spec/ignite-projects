import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Step = { id: string; position: number; title: string };
export type Mission = {
  id: string; title: string; description: string; category: "semana" | "rapida" | "avancada";
  difficulty: string; xp_per_step: number; xp_bonus: number; starts_at: string; ends_at: string; steps: Step[];
};

export const todayISO = () => new Date().toLocaleDateString("en-CA");

export const progressQuery = queryOptions({
  queryKey: ["progress"],
  queryFn: async () => {
    const [m, s, done, daily, dailyDone, prof, xpEv] = await Promise.all([
      supabase.from("missions").select("*").order("sort"),
      supabase.from("mission_steps").select("id, mission_id, position, title").order("position"),
      supabase.from("user_step_progress").select("step_id"),
      supabase.from("daily_missions").select("*").order("sort"),
      supabase.from("daily_completions").select("day, daily_mission_id, completed_at").order("day", { ascending: false }),
      supabase.from("profiles").select("display_name").maybeSingle(),
      supabase.from("xp_events").select("amount"),
    ]);
    const err = m.error || s.error || done.error || daily.error || dailyDone.error;
    if (err) throw err;
    const missions: Mission[] = (m.data ?? []).map((x) => ({
      ...(x as Omit<Mission, "steps">),
      steps: (s.data ?? []).filter((st) => st.mission_id === x.id),
    }));
    const doneSet = new Set((done.data ?? []).map((d) => d.step_id));
    const dailyList = daily.data ?? [];
    const dayIndex = Math.floor(Date.now() / 86400000) % Math.max(dailyList.length, 1);
    const today = dailyList[dayIndex] ?? null;
    const history = dailyDone.data ?? [];
    let xp = 0;
    for (const mi of missions) {
      const c = mi.steps.filter((st) => doneSet.has(st.id)).length;
      xp += c * mi.xp_per_step + (c === mi.steps.length && c > 0 ? mi.xp_bonus : 0);
    }
    const dailyXp = Object.fromEntries(dailyList.map((d) => [d.id, d.xp]));
    for (const h of history) xp += dailyXp[h.daily_mission_id] ?? 0;
    for (const e of xpEv.data ?? []) xp += e.amount;
    return { missions, doneSet, today, history, dailyList, xp, name: prof.data?.display_name ?? "" };
  },
});

export const levelFromXp = (xp: number) => ({ level: Math.floor(xp / 200) + 1, into: xp % 200, need: 200 });
