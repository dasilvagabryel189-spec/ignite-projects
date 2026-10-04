import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const PLANS = {
  base: { name: "Base", price: "R$19,90", period: "/mês" },
  pro: { name: "PRO+", price: "R$7,90", period: "/mês", total: "R$27,80" },
};

// Cole aqui os links de checkout da Kiwify quando tiver (são públicos).
export const CHECKOUT_URLS = {
  base: "",
  pro: "",
};

export type Subscription = {
  base_active: boolean;
  pro_active: boolean;
  base_status: string | null;
  pro_status: string | null;
  base_next_renewal: string | null;
  pro_next_renewal: string | null;
};

export const subscriptionQuery = () =>
  queryOptions({
    queryKey: ["subscription"],
    queryFn: async (): Promise<Subscription & { hasBase: boolean; hasPro: boolean }> => {
      const { data: u } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("subscriptions")
        .select("base_active, pro_active, base_status, pro_status, base_next_renewal, pro_next_renewal")
        .eq("user_id", u.user?.id ?? "")
        .maybeSingle();
      if (error) throw error;
      const s: Subscription = data ?? {
        base_active: false, pro_active: false, base_status: null, pro_status: null,
        base_next_renewal: null, pro_next_renewal: null,
      };
      return { ...s, hasBase: s.base_active, hasPro: s.base_active && s.pro_active };
    },
  });

export const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString("pt-BR") : null);
