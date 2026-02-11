import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  display_order: number;
}

export function useExperience() {
  return useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("experience")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data as Experience[];
    },
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (exp: Omit<Experience, "id">) => {
      const { error } = await (supabase as any).from("experience").insert(exp);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast({ title: "Success", description: "Experience added!" });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("experience").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast({ title: "Deleted", description: "Experience removed!" });
    },
  });
}